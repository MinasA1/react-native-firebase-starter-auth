/**
 * @flow
 *
 * The Login screen allows the user to login.  It is made up of two tabs:
 *
 * 1) Email Login
 * 2) Phone Login
 *
 * And a third block handling Social Login.
 */
import React from 'react';

import EmailLogin from '../../email/components/EmailLogin';
import PhoneLogin from '../../phone/components/PhoneLogin';
import SocialLogin from '../../social/components/SocialLogin';
import Screen from '../../../ui/components/Screen';
import Tabs from '../../../ui/components/tab/Tabs';
import Tab from '../../../ui/components/tab/Tab';

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // The currently selected tab
  selected: 'email' | 'phone',
}

/**
 * The Login Screen is made up of two tabs:

 */
export default class Login extends React.Component<*, State> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Log in',
  };

  constructor(props: any, context: any) {
    super(props, context);
    // Set the default state
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
        {selected === 'email' && <EmailLogin />}
        {selected === 'phone' && <PhoneLogin />}
        <SocialLogin title="Login with your social account" />
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
