/**
 * @flow
 *
 * The ForgottenPassword screen allows the user to reset their password.
 */
import React from 'react';
import firebase from 'react-native-firebase';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import FormError from '../../../ui/components/form/FormError';
import Screen from '../../../ui/components/Screen';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import { showMessage } from '../../../ui/components/Toast';
import TextField from '../../../ui/components/form/TextField';
import { isEmailValid } from '../../../util/validator';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
} & FormProps;

class ForgottenPassword extends React.Component<Props> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Forgotten password',
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
          onSubmitEditing={handleSubmit(this.onResetPassword)}
          placeholder="Email"
          validate={isEmailValid}
        />
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onResetPassword)}
          text="Reset password"
        />
      </Screen>
    );
  }

  /**
   * Called when the user submits the form.
   */
  onResetPassword = async (values: Object) => {
    const { email } = values;
    try {
      // 1) Tell firebase to send a password reset email
      await firebase.auth().sendPasswordResetEmail(email);
      // 2) Display an informational message
      showMessage('You\'ll receive an email with instructions shortly');
      // 3) Navigate back to the previous screen
      this.props.navigation.goBack();
    } catch (error) {
      // If there is an error, pass it back to `redux-form`
      throw new SubmissionError({ _error: error });
    }
  }
}

// reduxForm allows `redux-form` to manage the underlying form and its fields
export default reduxForm({
  form: 'ForgottenPassword',
})(ForgottenPassword);
