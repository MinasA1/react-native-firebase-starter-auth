/**
 * @flow
 *
 * The VerificationCodeForm component takes the user's verification code and passes it
 * back to the PhoneAuth component to continue the verification process
 */
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import isEmpty from 'validator/lib/isEmpty';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import FormError from '../../../ui/components/form/FormError';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import TextField from '../../../ui/components/form/TextField';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether to prompt for re-authentication
  allowReAuth: boolean,
  navigation: NavigationScreenProp<*, *>,
  // Called when the user has submitted their verification code
  onVerificationCode: (Object) => Promise<any>,
} & FormProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verifyHeading: {
    fontWeight: '500',
    marginHorizontal: 32,
    marginVertical: 4,
    textAlign: 'center',
  },
});

class VerificationCodeForm extends React.Component<Props> {
  render() {
    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <FormError error={error} />
        <Text style={styles.verifyHeading}>
          Please enter the verification code from the text message we just sent you
        </Text>
        <Field
          autoFocus
          component={TextField}
          keyboardType="numeric"
          icon="md-lock"
          name="verificationCode"
          onSubmitEditing={handleSubmit(this.onVerificationCode)}
          placeholder="Verification code"
          validate={this.isVerificationCodeValid}
        />
        <SubmitButton
          disabled={invalid && !error}
          onPress={handleSubmit(this.onVerificationCode)}
          loading={submitting}
          text="VERIFY"
        />
      </ScrollView>
    );
  }

  isVerificationCodeValid = (verificationCode: string): ?string => (!!verificationCode && !isEmpty(verificationCode) ? undefined : 'Required');

  /*
   * This is triggered when the user submits the form
   */
  onVerificationCode = (values: Object) => {
    const { verificationCode } = values;
    const { allowReAuth, navigation, onVerificationCode } = this.props;

    return onVerificationCode(verificationCode)
      .catch((error) => {
        if (allowReAuth && error.code === 'auth/requires-recent-login') {
          // If we're supporting re-authentication and the error indicates that
          // re-authentication is required, then show the ReAuthModal
          navigation.navigate('ReAuth');
        } else {
          // If there is an error, pass it back to `redux-form`
          throw new SubmissionError({ _error: error });
        }
      });
  }
}

// reduxForm allows `redux-form` to manage the underlying form and its fields
export default withNavigation(reduxForm({
  form: 'VerificationCode',
})(VerificationCodeForm));
