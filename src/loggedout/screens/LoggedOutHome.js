/**
 * @flow
 *
 * The Logged Out Home screen is a simple screen allowing the user to choose whether to login or
 * register.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import Button from '../../ui/components/Button';
import LinkButton from '../../ui/components/LinkButton';
import Screen from '../../ui/components/Screen';

import RNFirebaseLogo from '../../../assets/RNFirebase512x512.png';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 250,
    width: 250,
  },
  linkContainer: {
    alignSelf: 'center',
    height: 45,
  },
  loginOptions: {
    padding: 8,
  },
  signUpText: {
    fontWeight: '700',
  },
  welcome: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 20,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default class Home extends React.Component<Props> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Screen>
        <View style={styles.welcome}>
          <Image source={RNFirebaseLogo} style={styles.image} />
          <Text style={styles.welcomeText}>
            Welcome to the React Native Firebase Auth Starter Kit
          </Text>
        </View>
        <View style={styles.loginOptions}>
          <Button
            onPress={this.onLogin}
            text="Login"
          />
          <LinkButton
            containerStyle={styles.linkContainer}
            onPress={this.onSignUp}>
            <Text>Don't have an account yet? <Text style={styles.signUpText}>Sign Up</Text></Text>
          </LinkButton>
        </View>
      </Screen>
    );
  }

  /**
   * Called when the Login button is pressed
   */
  onLogin = () => {
    // Navigate to the Login screen
    this.props.navigation.navigate('Login');
  }

  /**
   * Called when the Sign Up button is pressed
   */
  onSignUp = () => {
    // Navigate to the SignUp screen
    this.props.navigation.navigate('SignUp');
  }
}
