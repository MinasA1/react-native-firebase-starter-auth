/**
 * @flow
 *
 * The LinkPhone screen allows the user to link a phone number with their account.
 */
import React from 'react';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import PhoneAuth from '../components/PhoneAuth';
import { showMessage } from '../../../ui/components/Toast';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
} & FormProps;

export default class LinkPhone extends React.Component<Props> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Link phone number',
  };

  render() {
    // We make use of the standard PhoneAuth component to manage the flow
    return (
      <PhoneAuth
        autoFocus
        buttonText="LINK"
        onSuccess={this.onSuccess}
        type="link"
      />
    );
  }

  /**
   * Called when the email address has been linked
   */
  onSuccess = () => {
    // 1) We show a success message
    showMessage('Your phone number has been linked');
    // 2) We navigate back to the previous screen
    this.props.navigation.goBack();
  }
}
