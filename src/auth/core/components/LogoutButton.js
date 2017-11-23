/**
 * @flow
 *
 * The LogoutButton component triggers a logout from Firebase and any third party providers.
 */
import React from 'react';
import { Button } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

import * as Theme from '../../../theme';

const logout = () => {
  // Logout from Firebase
  firebase.auth().signOut();
  // Logout from Facebook
  LoginManager.logOut();
  // Logout from Google
  GoogleSignin.signOut();
};

export default () => (
  <Button
    color={Theme.PRIMARY}
    onPress={logout}
    title="Logout"
  />
);
