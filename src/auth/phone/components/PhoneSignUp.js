/**
 * @flow
 *
 * The PhoneSignUp component allows the user to sign up with a phone number.
 */
import React from 'react';
import firebase from 'react-native-firebase';

import PhoneAuth from './PhoneAuth';

/**
 * Called when the user has successfully signed up.
 */
const onSuccess = (user: Object, name?: string) => {
  // We set the display name of the user based on what was entered on the registration screen
  user.updateProfile({ displayName: name });
  // FirebaseAnalytics: Tell Analytics that a user has registered by phone number
  firebase.analytics().logEvent('sign_up', {
    sign_up_method: 'phone',
  });
};

// We make use of the standard PhoneAuth component to manage the flow
export default () => (
  <PhoneAuth
    buttonText="SIGN UP"
    collectName
    onSuccess={onSuccess}
    type="register"
  />
);
