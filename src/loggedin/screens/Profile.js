/**
 * @flow
 *
 * The Profile screen allows the user to view and manage all their linked accounts.
 */
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import firebase from 'react-native-firebase';
import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import { connect } from 'react-redux';

import ActionSheet from '../../ui/components/ActionSheet';
import Icon from '../../ui/components/Icon';
import List from '../../ui/components/list/List';
import ListHeader from '../../ui/components/list/ListHeader';
import ListItem from '../../ui/components/list/ListItem';
import LogoutButton from '../../auth/core/components/LogoutButton';
import Screen from '../../ui/components/Screen';
import SocialAuth from '../../auth/social/components/SocialAuth';
import { hideLoading, showLoading } from '../../ui/redux/uiActions';
import { showError, showMessage, showWarning } from '../../ui/components/Toast';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The redux dispatch function
  dispatch: (Object) => any,
  navigation: NavigationScreenProp<*, *>,
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // Temporarily stores the provider ID being edited
  editSocialProviderId?: string,
  // The current Firebase user
  user: firebase.auth.User,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 18,
  },
  photo: {
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 8,
    marginTop: 16,
  },
  photoImage: {
    height: 100,
    width: 100,
  },
  photoIcon: {
    fontSize: 100,
    height: 100,
  },
  providersContainer: {
    alignSelf: 'stretch',
  },
});

class Profile extends React.Component<Props, State> {
  editEmailActionSheet: ActionSheet;
  editSocialActionSheet: ActionSheet;
  userSubscription: () => any;

  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerRight: <LogoutButton />,
    headerTitle: 'Profile',
  };

  constructor(props: Props, context: any) {
    super(props, context);
    // Set the default state of the component
    this.state = {
      user: firebase.auth().currentUser,
    };
  }

  /**
   * When the component mounts, we need to listen for any user state changes
   * in Firebase.
   */
  componentDidMount() {
    this.userSubscription = firebase.auth().onUserChanged((user) => {
      this.setState({ user });
    });
  }

  /**
   * When the App component ubmounts, we need to stop listening for any authentication state changes
   * in Firebase.
   */
  componentWillUnmount() {
    this.userSubscription();
  }

  render() {
    const { user } = this.state;

    // When the user logs out there may be a minor period where the Profile screen is
    // still displayed.  This protects against this scenario.
    if (!user) {
      return null;
    }

    // We check which providers already exist, so that we only offer to add new providers
    let hasEmail = false;
    let hasFacebook = false;
    let hasGoogle = false;
    let hasPhone = false;
    const providers = user.providerData.map((provider) => {
      let icon;
      let onPress;
      let text;
      if (provider.providerId === firebase.auth.EmailAuthProvider.PROVIDER_ID) {
        hasEmail = true;
        icon = 'md-mail';
        onPress = this.onEditEmail;
        text = provider.email;
      } else if (provider.providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID) {
        hasFacebook = true;
        icon = 'logo-facebook';
        onPress = this.onEditFacebook;
        text = provider.displayName;
      } else if (provider.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID) {
        hasGoogle = true;
        icon = 'logo-google';
        onPress = this.onEditGoogle;
        text = provider.displayName;
      } else if (provider.providerId === firebase.auth.PhoneAuthProvider.PROVIDER_ID) {
        hasPhone = true;
        icon = 'md-call';
        onPress = this.onEditPhone;
        text = provider.phoneNumber;
      } else {
        return null;
      }
      return (
        <ListItem
          icon={icon}
          key={provider.providerId}
          onPress={onPress}
          text={text}
        />
      );
    });

    return (
      <Screen>
        {user.photoURL
          ? (
            <Image
              source={{ uri: user.photoURL }}
              style={[styles.photo, styles.photoImage]}
            />
          ) : (
            <Icon
              active
              name="md-person"
              style={[styles.photo, styles.photoIcon]}
            />
          )}
        <Text style={styles.nameText}>{user.displayName}</Text>
        <List>
          <ListHeader text="Accounts" />
          {providers}
          {!hasEmail && <ListItem icon="md-mail" text="Link Email Address" onPress={this.onLinkEmail} />}
          {!hasFacebook && (
            <SocialAuth
              onSuccess={this.onLinkSocialSuccess}
              providerId={firebase.auth.FacebookAuthProvider.PROVIDER_ID}
              render={onPress => (
                <ListItem
                  icon="logo-facebook"
                  text="Link Facebook Account"
                  onPress={onPress}
                />
              )}
              type="link"
            />
          )}
          {!hasGoogle && (
            <SocialAuth
              onSuccess={this.onLinkSocialSuccess}
              providerId={firebase.auth.GoogleAuthProvider.PROVIDER_ID}
              render={onPress => (
                <ListItem
                  icon="logo-google"
                  text="Link Google Account"
                  onPress={onPress}
                />
              )}
              type="link"
            />
          )}
          {!hasPhone && <ListItem icon="md-call" text="Link Phone Number" onPress={this.onLinkPhone} />}
        </List>
        <ActionSheet
          ref={(ref) => { this.editEmailActionSheet = ref; }}
          options={['Change email address', 'Change password', 'Remove account', 'Cancel']}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this.onEditEmailActionSheetPress}
        />
        <ActionSheet
          ref={(ref) => { this.editSocialActionSheet = ref; }}
          options={['Remove account', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.onEditSocialActionSheetPress}
        />
      </Screen>
    );
  }

  /**
   * Called when the user wants to edit their email account
   */
  onEditEmail = () => {
    this.editEmailActionSheet.show();
  }

  /**
   * Called when the user has clicked a button on the edit email action sheet
   */
  onEditEmailActionSheetPress = (buttonIndex: number) => {
    const { navigation } = this.props;
    if (buttonIndex === 0) {
      // Navigate to the ChangeEmail screen
      navigation.navigate('ChangeEmail');
    } else if (buttonIndex === 1) {
      // Navigate to the ChangePassword screen
      navigation.navigate('ChangePassword');
    } else if (buttonIndex === 2) {
      // Start the unlink process to remove the email account
      this.unlink(firebase.auth.EmailAuthProvider.PROVIDER_ID);
    }
  }

  /**
   * Called when the user wants to edit their Facebook account
   */
  onEditFacebook = () => {
    this.onEditSocial(firebase.auth.FacebookAuthProvider.PROVIDER_ID);
  }

  /**
   * Called when the user wants to edit their Google account
   */
  onEditGoogle = () => {
    this.onEditSocial(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
  }

  /**
   * Called when the user wants to edit their phone account
   */
  onEditPhone = () => {
    this.onEditSocial(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
  }

  /**
   * Called by `onEditFacebook`, `onEditGoogle` and `onEditPhone`
   */
  onEditSocial = (providerId: string) => {
    this.setState({ editSocialProviderId: providerId });
    this.editSocialActionSheet.show();
  }

  /**
   *
   */
  onEditSocialActionSheetPress = (buttonIndex: number) => {
    const { editSocialProviderId } = this.state;
    if (editSocialProviderId && (buttonIndex === 0 || buttonIndex === '0')) {
      // Start the unlink process to remove the account
      this.unlink(editSocialProviderId);
    }
  }

  /**
   * Called when the user wants to link an email account
   */
  onLinkEmail = () => {
    // Navigate to the LinkEmail screen
    this.props.navigation.navigate('LinkEmail');
  }

  /**
   * Called when the user wants to link a Phone number
   */
  onLinkPhone = () => {
    this.props.navigation.navigate('LinkPhone');
  }

  /**
   * Called when the social link process has succeeded
   */
  onLinkSocialSuccess = () => {
    // Show a success message
    showMessage('Your account has been linked');
  }

  /**
   * Handles removing a social provider from the user's Firebase account
   */
  unlink = async (providerId: string) => {
    const { currentUser } = firebase.auth();
    // Check that the user isn't trying to remove the last linked provider
    if (currentUser && currentUser.providerData.length > 1) {
      try {
        // 1) Show the loading screen
        this.props.dispatch(showLoading());
        // 2) Unlink the credential from the user's account
        await currentUser.unlink(providerId);
        // 3) Show a success message
        showMessage('Your account has been removed');
      } catch (error) {
        // If there are any errors, show an error message
        showError(error.message);
      }
      // Hide the loading screen
      this.props.dispatch(hideLoading());
    } else {
      // If this is the user's last linked provider we show a warning
      showWarning('You cannot remove your last account');
    }
  }
}

// connect allows the component to communicate with redux
export default connect()(Profile);
