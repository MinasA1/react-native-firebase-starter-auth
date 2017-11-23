/**
 * @flow
 *
 * The ChangeEmail screen allows the user to update their email address.
 */
import React from 'react';
import firebase from 'react-native-firebase';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import FormError from '../../../ui/components/form/FormError';
import Screen from '../../../ui/components/Screen';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import TextField from '../../../ui/components/form/TextField';
import { showMessage } from '../../../ui/components/Toast';
import { isEmailValid, isPasswordValid } from '../../../util/validator';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
} & FormProps;

class ChangeEmail extends React.Component<Props> {
  passwordInput: ?Field;

  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Change email',
  };

  render() {
    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props;

    return (
      <Screen>
        <FormError error={error} />
        <Field
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          component={TextField}
          keyboardType="email-address"
          icon="md-mail"
          name="email"
          onSubmitEditing={this.focusPasswordInput}
          placeholder="Enter your new email address"
          validate={isEmailValid}
        />
        <Field
          autoCapitalize="none"
          component={TextField}
          icon="md-lock"
          name="password"
          onSubmitEditing={handleSubmit(this.onChangeEmail)}
          placeholder="Enter your password to confirm"
          ref={(ref) => { this.passwordInput = ref; }}
          secureTextEntry
          validate={isPasswordValid}
          withRef
        />
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onChangeEmail)}
          text="Change email address"
        />
      </Screen>
    );
  }

  /**
   * Allows us to programatically focus the password input field
   */
  focusPasswordInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.passwordInput) this.passwordInput.getRenderedComponent().focus();
  }

  /**
   * Called when the user submits the form
   */
  onChangeEmail = async (values: Object) => {
    try {
      const { email, password } = values;
      const currentEmail = firebase.auth().currentUser.email;

      // 1) We need to re-authenticate the user before updating their email address for security
      const credential = firebase.auth.EmailAuthProvider.credential(currentEmail, password);
      await firebase.auth().currentUser.reauthenticateWithCredential(credential);
      // 2) We update the user's email address
      await firebase.auth().currentUser.updateEmail(email);
      // 3) We show a success message
      showMessage('Your email address has been updated');
      // 4) We navigate back to the previous screen
      this.props.navigation.goBack();
    } catch (error) {
      // If there is an error, pass it back to `redux-form`
      throw new SubmissionError({ _error: error });
    }
  }
}

// reduxForm allows `redux-form` to manage the underlying form and its fields
export default reduxForm({
  form: 'ChangeEmail',
})(ChangeEmail);
