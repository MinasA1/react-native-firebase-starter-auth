/**
 * @flow
 *
 * The LinkEmail screen allows the user to link an email address with their account.
 */
import React from 'react';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';
import type { FormProps } from 'redux-form';

import EmailAuth from '../components/EmailAuth';
import { showMessage } from '../../../ui/components/Toast';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
} & FormProps;

export default class LinkEmail extends React.Component<Props> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Link email address',
  };

  render() {
    // We make use of the standard EmailAuth component to manage the flow
    return (
      <EmailAuth
        autoFocus
        buttonText="LINK"
        onSuccess={this.onSuccess}
        reAuth
        type="link"
      />
    );
  }

  /**
   * Called when the email address has been linked
   */
  onSuccess = () => {
    // 1) We show a success message
    showMessage('Your email address has been linked');
    // 2) We navigate back to the previous screen
    this.props.navigation.goBack();
  }
}
