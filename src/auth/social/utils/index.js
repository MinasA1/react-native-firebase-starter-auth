/**
 * @flow
 *
 * This file contains shared helper methods for the authentication flows
 */
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

/**
 * Retrieves a valid Facebook Login Credential, by either:
 * 1) Obtaining a pre-existing token
 * 2) Prompting the user to login to Facebook and obtain a new token
 */
export const getFacebookLoginCredential = async (): Promise<?Object> => {
  // Check if there is an Access Token already available
  let data = await AccessToken.getCurrentAccessToken();

  if (!data || !data.accessToken) {
    // If the Access Token doesn't exist, then prompt the user to login to Facebook
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
    if (!result.isCancelled) {
      // If the user successfully completed the login flow, then retrieve the new Access Token
      data = await AccessToken.getCurrentAccessToken();
    }
  }

  if (data && data.accessToken) {
    // If there is a valid Access Token, then build a Firebase credential object
    return firebase.auth.FacebookAuthProvider.credential(data.accessToken);
  }

  return null;
};

/**
 * Retrieves a valid Google Login Credential, by either:
 * 1) Obtaining a pre-existing token
 * 2) Prompting the user to login to Google and obtain a new token
 */
export const getGoogleLoginCredential = async (): Promise<?Object> => {
  try {
    // Check if there is a User already available
    let data = await GoogleSignin.currentUserAsync();

    if (!data || !data.accessToken) {
      // If the User doesn't exist, then prompt the user to login to Google
      data = await GoogleSignin.signIn();
    }

    if (data && data.accessToken) {
      // If there is a valid Access Token, then build a Firebase credential object
      return firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
    }
  } catch (error) {
    // `react-native-google-signin` returns an error code -5 if the user cancels
    // the sign in flow. In this case, gracefully exist
    if (error.code !== -5) {
      throw error;
    }
  }

  return null;
};
