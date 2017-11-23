/**
 * @flow
 *
 * The PhoneAuth component handles the email authentication flows for four cases:
 *
 * 1) Login
 * 2) Registration
 * 3) Linking
 * 4) Re-authentication
 *
 * It consists of two parts:
 *
 * 1) Collect the user's phone number (and optional name field)
 * 2) Validate the phone number using Firebase
 */
import React from 'react';
import firebase from 'react-native-firebase';

import PhoneNumberForm from './PhoneNumberForm';
import VerificationCodeForm from './VerificationCodeForm';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether to autofocus the first field
  autoFocus?: boolean,
  // The text to show on the submit button
  buttonText: string,
  // Whether to show a name field (for registration)
  collectName?: boolean,
  // An optional function called when the auth flow has succeeded
  onSuccess?: (Object, string | void) => any,
  // The type of email authentication to perform
  type: 'link' | 'reAuth' | 'register' | 'signIn',
};

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // The value of the name field to pass between the PhoneNumberForm and the VerificationCodeForm
  name?: string,
  // The value of the verificationId obtained from Firebase to use with the verification code
  verificationId?: string,
}

export default class PhoneAuth extends React.Component<Props, State> {
  static defaultProps = {
    autoFocus: false,
    collectName: false,
  }

  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    const {
      autoFocus,
      buttonText,
      collectName,
      type,
    } = this.props;
    const {
      verificationId,
    } = this.state;

    if (verificationId) {
      return (
        <VerificationCodeForm
          allowReAuth={type === 'link'}
          onVerificationCode={this.onVerificationCode}
        />
      );
    }

    return (
      <PhoneNumberForm
        allowReAuth={type === 'link'}
        autoFocus={autoFocus}
        buttonText={buttonText}
        collectName={collectName}
        onVerificationCodeSent={this.onVerificationCodeSent}
        onVerified={this.onVerified}
        reAuth={type === 'reAuth'}
      />
    );
  }

  /*
   * This is triggered by the VerificationCodeForm when a verification code has been submitted
   */
  onVerificationCode = (verificationCode: string) => {
    const { name, verificationId } = this.state;
    const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    return this.onVerified(credential, name);
  }

  /*
   * This is triggered by the PhoneNumberForm when the phone number has been submitted and
   * Firebase has sent the verification code by SMS
   */
  onVerificationCodeSent = (verificationId: string, name?: string) => {
    this.setState({ name, verificationId });
  }

  /*
   * This is triggered in 2 situations:
   * 1) When a verification code has been entered manually
   * 2) When the phone number has been auto-verified (Android only)
   */
  onVerified = async (credential: Object, name?: string) => {
    const { onSuccess, type } = this.props;
    let user;
    if (type === 'link') {
      user = await firebase.auth().currentUser.linkWithCredential(credential);
    } else if (type === 'reAuth') {
      user = await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    } else {
      user = await firebase.auth().signInWithCredential(credential);
    }

    if (onSuccess) onSuccess(user, name);
  }
}
