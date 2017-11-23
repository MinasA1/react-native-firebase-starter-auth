/**
 * @flow
 *
 * The EmailLogin component allows the user to login with an email address.
 */
import React from 'react';
import firebase from 'react-native-firebase';

import EmailAuth from './EmailAuth';

/**
 * Called when the user has successfully logged in.
 */
const onSuccess = () => {
  // FirebaseAnalytics: Tell Analytics that a user has logged in by email address
  firebase.analytics().logEvent('login', {
    sign_up_method: 'email',
  });
};

// We make use of the standard EmailAuth component to manage the flow
export default () => (
  <EmailAuth
    buttonText="LOG IN"
    onSuccess={onSuccess}
    showForgottenPassword
    type="signIn"
  />
);
