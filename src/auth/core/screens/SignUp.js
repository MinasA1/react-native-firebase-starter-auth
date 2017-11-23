/**
 * @flow
 *
 * The SignUp screen allows the user to sign up.  It is made up of two tabs:
 *
 * 1) Email Sign Up
 * 2) Phone Sign Up
 *
 * And a third block handling Social Sign Up.
 */
import React from 'react';

import EmailSignUp from '../../email/components/EmailSignUp';
import PhoneSignUp from '../../phone/components/PhoneSignUp';
import Screen from '../../../ui/components/Screen';
import SocialLogin from '../../social/components/SocialLogin';
import Tabs from '../../../ui/components/tab/Tabs';
import Tab from '../../../ui/components/tab/Tab';

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // The currently selected tab
  selected: 'email' | 'phone',
}

export default class SignUp extends React.Component<*, State> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Sign up',
  };

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      selected: 'email',
    };
  }

  render() {
    const { selected } = this.state;
    return (
      <Screen>
        <Tabs>
          <Tab
            active={selected === 'email'}
            heading="Email"
            icon="md-mail"
            onPress={this.selectEmail}
          />
          <Tab
            active={selected === 'phone'}
            heading="Phone"
            icon="md-call"
            onPress={this.selectPhone}
          />
        </Tabs>
        {selected === 'email' && <EmailSignUp />}
        {selected === 'phone' && <PhoneSignUp />}
        <SocialLogin title="Sign up with your social account" />
      </Screen>
    );
  }

  /**
   * Select the email tab
   */
  selectEmail = () => {
    this.setState({ selected: 'email' });
  }

  /**
   * Select the phone tab
   */
  selectPhone = () => {
    this.setState({ selected: 'phone' });
  }
}
