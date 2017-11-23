/**
 * @flow
 *
 * The EmailSignUp component allows the user to sign up with an email address.
 */
import React from 'react';
import firebase from 'react-native-firebase';

import EmailAuth from './EmailAuth';

/**
 * Called when the user has successfully signed up.
 */
const onSuccess = (user: Object, name?: string) => {
  // We set the display name of the user based on what was entered on the registration screen
  user.updateProfile({ displayName: name });
  // FirebaseAnalytics: Tell Analytics that a user has registered by email address
  firebase.analytics().logEvent('sign_up', {
    sign_up_method: 'email',
  });
};

// We make use of the standard EmailAuth component to manage the flow
export default () => (
  <EmailAuth
    buttonText="SIGN UP"
    collectName
    onSuccess={onSuccess}
    type="register"
  />
);
