/**
 * @flow
 *
 * The ChangeEmail screen allows the user to update their password.
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
import { isPasswordValid } from '../../../util/validator';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
} & FormProps;

class ChangePassword extends React.Component<Props> {
  newPasswordInput: ?Field;

  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Change password',
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
          autoFocus
          component={TextField}
          icon="md-lock"
          name="oldPassword"
          onSubmitEditing={this.focusNewPasswordInput}
          placeholder="Enter your current password"
          secureTextEntry
          validate={isPasswordValid}
          withRef
        />
        <Field
          autoCapitalize="none"
          component={TextField}
          icon="md-lock"
          name="newPassword"
          onSubmitEditing={handleSubmit(this.onChangePassword)}
          placeholder="Enter your new password"
          ref={(ref) => { this.newPasswordInput = ref; }}
          secureTextEntry
          validate={isPasswordValid}
          withRef
        />
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onChangePassword)}
          text="Change password"
        />
      </Screen>
    );
  }

  /**
   * Allows us to programatically focus the new password input field
   */
  focusNewPasswordInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.newPasswordInput) this.newPasswordInput.getRenderedComponent().focus();
  }

  /**
   * Called when the user submits the form
   */
  onChangePassword = async (values: Object) => {
    try {
      const { oldPassword, newPassword } = values;
      const { email } = firebase.auth().currentUser;

      // 1) We need to re-authenticate the user before updating their password for security
      const credential = firebase.auth.EmailAuthProvider.credential(email, oldPassword);
      await firebase.auth().currentUser.reauthenticateWithCredential(credential);
      // 2) We update the user's password
      await firebase.auth().currentUser.updatePassword(newPassword);
      // 3) We show a success message
      showMessage('Your password has been updated');
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
  form: 'ChangePassword',
})(ChangePassword);
