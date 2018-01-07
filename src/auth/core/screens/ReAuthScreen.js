/**
 * @flow
 *
 * The ReAuthScreen is displayed when Firebase requires re-authentication before it can perform
 * sensitive tasks.
 *
 * The modal will check which Providers the current user has available and show a single
 * re-authentication method based on the following priority list:
 * 1) Email
 * 2) Phone
 * 3) Facebook
 * 4) Google
 */
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import Button from '../../../ui/components/Button';
import EmailAuth from '../../email/components/EmailAuth';
import PhoneAuth from '../../phone/components/PhoneAuth';
import SocialAuth from '../../social/components/SocialAuth';
import { showMessage } from '../../../ui/components/Toast';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 300,
    justifyContent: 'center',
    padding: 8,
    width: Dimensions.get('window').width - 32,
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
});

export default class ReAuthScreen extends React.Component<Props> {
  render() {
    const user = firebase.auth().currentUser;

    let hasEmail = false;
    let hasFacebook = false;
    let hasGoogle = false;
    let hasPhone = false;
    user.providerData.forEach((provider) => {
      if (provider.providerId === firebase.auth.EmailAuthProvider.PROVIDER_ID) {
        hasEmail = true;
      } else if (provider.providerId === firebase.auth.PhoneAuthProvider.PROVIDER_ID) {
        hasPhone = true;
      } else if (provider.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID) {
        hasFacebook = true;
      } else if (provider.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
        hasGoogle = true;
      }
    });

    let reAuthComponent;
    if (hasEmail) {
      reAuthComponent = (
        <EmailAuth
          buttonText="RE-AUTHENTICATE"
          onSuccess={this.onReAuth}
          type="reAuth"
        />
      );
    } else if (hasPhone) {
      reAuthComponent = (
        <PhoneAuth
          buttonText="RE-AUTHENTICATE"
          onSuccess={this.onReAuth}
          type="reAuth"
        />
      );
    } else if (hasFacebook) {
      reAuthComponent = (
        <SocialAuth
          onSuccess={this.onReAuth}
          providerId={firebase.auth.FacebookAuthProvider.PROVIDER_ID}
          render={onPress => (
            <Button
              icon="logo-facebook"
              onPress={onPress}
              text="RE-AUTHENTICATE"
            />
          )}
          type="reAuth"
        />
      );
    } else if (hasGoogle) {
      reAuthComponent = (
        <SocialAuth
          onSuccess={this.onReAuth}
          providerId={firebase.auth.GoogleAuthProvider.PROVIDER_ID}
          render={onPress => (
            <Button
              icon="logo-google"
              onPress={onPress}
              text="RE-AUTHENTICATE"
            />
          )}
          type="reAuth"
        />
      );
    }

    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>We need to re-authenticate you:</Text>
          {reAuthComponent}
        </View>
      </View>
    );
  }

  /**
   * Called when the user has been succesfully re-authenticated
   */
  onReAuth = () => {
    showMessage('Re-authentication successful, you may now try again');
    this.props.navigation.goBack();
  }
}
