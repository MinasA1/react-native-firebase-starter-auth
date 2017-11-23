/**
 * @flow
 *
 * This file is the main entry point into our app.
 * It is shared across both Android and iOS.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import { Provider } from 'react-redux';

import { GOOGLE_SIGN_IN_ANDROID_CLIENT_ID, GOOGLE_SIGN_IN_IOS_CLIENT_ID } from './config';
import store from './redux/store';

import LoadingModal from './ui/components/LoadingModal';
import LoggedIn from './loggedin/screens';
import LoggedOut from './loggedout/screens';

// Configure `react-native-google-signin` with our client IDs
GoogleSignin.configure({
  iosClientId: GOOGLE_SIGN_IN_IOS_CLIENT_ID,
  webClientId: GOOGLE_SIGN_IN_ANDROID_CLIENT_ID,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // Whether Firebase is still checking if the user is logged in or out
  loading: boolean,
  // The Firebase user
  user?: Object,
}

export default class App extends React.Component<*, State> {
  authSubscription: () => any;
  state: State;

  constructor() {
    super();
    // Set the default state of the component
    this.state = {
      loading: true,
    };
  }

  /**
   * When the App component mounts, we need to listen for any authentication state changes
   * in Firebase.
   * Once subscribed, the 'user' parameter will either be null (logged out) or an Object (logged in)
   */
  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
      // FirebaseAnalytics: Tell Analytics who the user is, or clear if the user is logged out
      // We do this here as it's the central place we manage user state, rather than having to
      // add it to every login, logout and sign up action.
      firebase.analytics().setUserId(user ? user.uid : null);
    });
  }

  /**
   * When the App component unmounts, we need to stop listening for any authentication state changes
   * in Firebase.
   */
  componentWillUnmount() {
    this.authSubscription();
  }

  /**
   * Render the application based on 3 states:
   *  1 - loading: onAuthStateChanged has not triggered yet, show nothing.
   *  2 - user<null>: If user is null, it means the user is not logged in and we'll show the
   *      LoggedOut screens to the user
   *  3 - user<Object>: If user is an Object, it means there's an account on the device and
   *      we'll show the LoggedIn screens
   */
  render() {
    if (this.state.loading) return null;

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <LoadingModal />
          {this.state.user ? <LoggedIn /> : <LoggedOut />}
        </View>
      </Provider>
    );
  }
}
