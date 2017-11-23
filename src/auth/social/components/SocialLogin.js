/**
 * @flow
 *
 * The SocialLogin component handles the login and registration flow for these providers:
 *
 * 1) Facebook
 * 2) Google
 */
import React from 'react';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';

import IconButton from '../../../ui/components/IconButton';
import SocialAuth from './SocialAuth';
import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The title text to display on the component
  title: string,
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // Whether the component is hidden - used on Android when the keyboard is shown
  hidden: boolean,
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fff',
  },
  iconStyle: {
    color: Theme.PRIMARY,
  },
  optionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.PRIMARY,
    height: 140,
  },
  optionsContainerHidden: {
    height: 0,
  },
  orContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: 22.5,
    borderBottomRightRadius: 22.5,
    borderColor: Theme.PRIMARY,
    borderWidth: StyleSheet.hairlineWidth,
    height: 22.5,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 45,
  },
  orText: {
    color: Theme.PRIMARY,
    fontWeight: '700',
    marginTop: -2,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  socialTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});

export default class SocialLogin extends React.Component<Props, State> {
  keyboardDidHideObserver: any;
  keyboardDidShowObserver: any;

  constructor(props: Props, context: any) {
    super(props, context);
    // Set the default state of the component
    this.state = {
      hidden: false,
    };
  }

  /**
   * Android's keyboard behaviour is a little eratic - to help us out, we add a listener and
   * hide/show this component based on whether the keyboard is displayed or not
   */
  componentDidMount() {
    if (Platform.OS === 'android') {
      this.keyboardDidShowObserver = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
      this.keyboardDidHideObserver = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
    }
  }

  /**
   * When the component unmounts, we need to stop listening for any keyboard state changes
   */
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      if (this.keyboardDidShowObserver) this.keyboardDidShowObserver.remove();
      if (this.keyboardDidHideObserver) this.keyboardDidHideObserver.remove();
    }
  }

  render() {
    const { title } = this.props;
    const { hidden } = this.state;
    return (
      <View style={[styles.optionsContainer, hidden && styles.optionsContainerHidden]}>
        <View style={styles.orContainer}>
          <Text style={styles.orText}>OR</Text>
        </View>
        <Text style={styles.socialTitle}>{title}</Text>
        <View style={styles.socialButtonsContainer}>
          <SocialAuth
            onSuccess={this.onSuccess}
            providerId={firebase.auth.FacebookAuthProvider.PROVIDER_ID}
            render={onPress => (
              <IconButton
                containerStyle={styles.iconContainer}
                icon="logo-facebook"
                iconStyle={styles.iconStyle}
                onPress={onPress}
              />
            )}
            type="signIn"
          />
          <SocialAuth
            onSuccess={this.onSuccess}
            providerId={firebase.auth.GoogleAuthProvider.PROVIDER_ID}
            render={onPress => (
              <IconButton
                containerStyle={styles.iconContainer}
                icon="logo-google"
                iconStyle={styles.iconStyle}
                onPress={onPress}
              />
            )}
            type="signIn"
          />
        </View>
      </View>
    );
  }

  /**
   * Called when the keyboard is shown to hide the component
   */
  onKeyboardDidShow = () => {
    this.setState({ hidden: true });
  }

  /**
   * Called when the keyboard is hidden to show the component
   */
  onKeyboardDidHide = () => {
    this.setState({ hidden: false });
  }

  /**
   * Called when the auth flow succeeds
   */
  onSuccess = (user: Object, providerId: string) => {
    // 1) FirebaseAnalytics: Tell Analytics that a user has logged in using a social provider
    // Unfortunately, it's not currently possible to tell whether this was a new registration
    // or an existing user, so we log it as a login
    firebase.analytics().logEvent('login', {
      sign_up_method: providerId,
    });
  }
}
