/**
 * @flow
 *
 * The SocialAuth component handles the social authentication flows for four cases:
 *
 * 1) Login
 * 2) Registration
 * 3) Linking
 * 4) Re-authentication
 *
 * For the following social providers:
 *
 * 1) Facebook
 * 2) Google
 *
 * It checks if a valid access token already exists and if not directs them to the social provider
 * to perform their standard authentication flow.
 */
import React, { type Element } from 'react';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import { getFacebookLoginCredential, getGoogleLoginCredential } from '../utils';
import { hideLoading, showLoading } from '../../../ui/redux/uiActions';
import { showError } from '../../../ui/components/Toast';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The redux dispatch function
  dispatch: (Object) => any,
  navigation: NavigationScreenProp<*, *>,
  // An optional function called when the auth flow has succeeded
  onSuccess?: (Object, string) => any,
  // The ID of the Firebase provider being used
  providerId:
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
    | firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  // A method to render the component that should be used for triggering SocialAuth
  render: (onPress: () => any) => Element<*>,
  // The type of email authentication to perform
  type: 'link' | 'reAuth' | 'register' | 'signIn',
};

class SocialAuth extends React.Component<Props> {
  render() {
    return this.props.render(this.onLogin);
  }

  getCredential = async () => {
    const { providerId } = this.props;
    if (providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID) {
      return getFacebookLoginCredential();
    } else if (providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
      return getGoogleLoginCredential();
    }
    throw new Error('Invalid providerId supplied');
  }

  /**
   * Handles logging in with the social provider.
   * If the user does not already exist, Firebase creates it automatically.
   */
  onLogin = async () => {
    const {
      dispatch,
      navigation,
      onSuccess,
      type,
    } = this.props;

    try {
      // Show the loading modal
      dispatch(showLoading());
      // Retrieve the credential from the social account
      const credential = await this.getCredential();
      if (credential) {
        let user;
        // If there is a credential, perform the corresponding Firebase action
        if (type === 'link') {
          user = await firebase.auth().currentUser.linkWithCredential(credential);
        } else if (type === 'reAuth') {
          user = await firebase.auth().currentUser.reauthenticateWithCredential(credential);
        } else {
          user = await firebase.auth().signInWithCredential(credential);
        }

        if (onSuccess) onSuccess(user, credential.providerId);
      }
    } catch (error) {
      if (type === 'link' && error.code === 'auth/requires-recent-login') {
        // If we're supporting re-authentication and the error indicates that re-authentication
        // is required, then show the ReAuthModal
        navigation.navigate('ReAuth');
      } else {
        // If there is an error, show an error message
        showError(error.message);
      }
    }
    // Hide the loading modal
    dispatch(hideLoading());
  }
}

// connect allows the component to communicate with redux
// withNavigation ensures that the component has access to the navigation object
export default connect()(withNavigation(SocialAuth));
