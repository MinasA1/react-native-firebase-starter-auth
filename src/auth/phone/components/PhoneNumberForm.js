/**
 * @flow
 *
 * The PhoneNumberForm component takes the user's phone number and optional name and passes them
 * to Firebase to start the verification process. Once started, it returns back to the PhoneAuth
 * component to complete the process
 */
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import FormError from '../../../ui/components/form/FormError';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import TextField from '../../../ui/components/form/TextField';
import { isNameValid, isPhoneNumberValid } from '../../../util/validator';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether to prompt for re-authentication
  allowReAuth: boolean,
  // Whether to autofocus the first field
  autoFocus?: boolean,
  // The text to show on the submit button
  buttonText: string,
  // Whether to show a name field (for registration)
  collectName: boolean,
  navigation: NavigationScreenProp<*, *>,
  // Called when Firebase has sent a verification code
  onVerificationCodeSent: (string) => any,
  // Called if Firebase auto-verifies the phone number (Android only)
  onVerified: (Object, ?string) => any,
  // Whether we are re-authenticating the current user
  reAuth: boolean,
} & FormProps;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
  },
});

class PhoneNumberForm extends React.Component<Props> {
  phoneNumberInput: ?Field;

  static defaultProps = {
    autoFocus: false,
  }
  componentWillMount() {
    const { reAuth } = this.props;
    if (reAuth) {
      this.props.initialize({ phoneNumber: firebase.auth().currentUser.phoneNumber });
    }
  }

  render() {
    const {
      autoFocus,
      buttonText,
      collectName,
      error,
      handleSubmit,
      invalid,
      reAuth,
      submitting,
    } = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <FormError error={error} />
        {collectName && (
          <Field
            autoFocus={autoFocus}
            component={TextField}
            icon="md-person"
            name="name"
            onSubmitEditing={this.focusPhoneNumberInput}
            placeholder="Name"
            validate={isNameValid}
          />
        )}
        <Field
          autoFocus={autoFocus && !collectName}
          component={TextField}
          editable={!reAuth}
          keyboardType="phone-pad"
          icon="md-call"
          name="phoneNumber"
          onSubmitEditing={handleSubmit(this.onSubmit)}
          placeholder="Phone number"
          ref={(ref) => { this.phoneNumberInput = ref; }}
          validate={isPhoneNumberValid}
          withRef
        />
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onSubmit)}
          text={buttonText}
        />
      </ScrollView>
    );
  }

  focusPhoneNumberInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.phoneNumberInput) this.phoneNumberInput.getRenderedComponent().focus();
  }

  /*
   * This is triggered when the user submits the form
   */
  onSubmit = (values: Object) => {
    const {
      allowReAuth,
      navigation,
      onVerificationCodeSent,
      onVerified,
    } = this.props;
    const { name, phoneNumber } = values;

    // We return a Promise to allow `redux-form` to manage validation of any errors
    return new Promise((resolve, reject) => {
      // Start the Firebase verification process
      firebase.auth().verifyPhoneNumber(phoneNumber)
        // We listen for any state changed events to allow us to act accordingly
        .on('state_changed', (phoneAuthSnapshot) => {
          switch (phoneAuthSnapshot.state) {
            case firebase.auth.PhoneAuthState.CODE_SENT: {
              // If the code has been sent, trigger the next step in the verification process
              const { verificationId } = phoneAuthSnapshot;
              onVerificationCodeSent(verificationId, name);
              resolve();
              break;
            }

            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: {
              // If the phone number has been auto-verified (Android only) then trigger the next
              // step in the authentication flow
              const { code, verificationId } = phoneAuthSnapshot;
              const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
              onVerified(credential, name);
              break;
            }

            case firebase.auth.PhoneAuthState.ERROR: {
              const { error } = phoneAuthSnapshot;
              if (allowReAuth && error.code === 'auth/requires-recent-login') {
                // If we're supporting re-authentication and the error indicates that
                // re-authentication is required, then show the ReAuthModal
                navigation.navigate('ReAuth');
              } else {
                // If there is an error, pass it back to `redux-form`
                reject(new SubmissionError({ _error: error }));
              }
              break;
            }

            default:
              break;
          }
        });
    });
  }
}

// withNavigation ensures that the component has access to the navigation object
// reduxForm allows `redux-form` to manage the underlying form and its fields
export default withNavigation(reduxForm({
  form: 'PhoneNumber',
})(PhoneNumberForm));
