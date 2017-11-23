/**
 * @flow
 *
 * The PhoneLogin component allows the user to login with a phone number.
 */
import React from 'react';
import firebase from 'react-native-firebase';

import PhoneAuth from './PhoneAuth';

/**
 * Called when the user has successfully logged in.
 */
const onSuccess = () => {
  // FirebaseAnalytics: Tell Analytics that a user has logged in by phone number
  firebase.analytics().logEvent('login', {
    sign_up_method: 'phone',
  });
};

// We make use of the standard PhoneAuth component to manage the flow
export default () => (
  <PhoneAuth
    buttonText="LOG IN"
    onSuccess={onSuccess}
    type="signIn"
  />
);
