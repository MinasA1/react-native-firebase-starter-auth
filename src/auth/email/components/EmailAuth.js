/**
 * @flow
 *
 * The EmailAuth component handles the email authentication flows for four cases:
 *
 * 1) Login
 * 2) Registration
 * 3) Linking
 * 4) Re-authentication
 *
 * It takes an email address, password and optional name field, passing them to firebase
 * before returning the user
 */
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import type { FormProps } from 'redux-form';

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import FormError from '../../../ui/components/form/FormError';
import LinkButton from '../../../ui/components/LinkButton';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import TextField from '../../../ui/components/form/TextField';
import { isEmailValid, isNameValid, isPasswordValid } from '../../../util/validator';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether to autofocus the first field
  autoFocus?: boolean,
  // The text to show on the submit button
  buttonText: string,
  // Whether to show a name field (for registration)
  collectName?: boolean,
  navigation: NavigationScreenProp<*, *>,
  // An optional function called when the auth flow has succeeded
  onSuccess?: (Object, ?string) => any,
  // Whether to show the forgotten password link
  showForgottenPassword?: boolean,
  // The type of email authentication to perform
  type: 'link' | 'reAuth' | 'register' | 'signIn',
} & FormProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forgottenPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginRight: 8,
  },
  forgottenPasswordText: {
    color: '#444',
    fontSize: 13,
  },
});

class EmailAuth extends React.Component<Props> {
  emailInput: ?Field;
  passwordInput: ?Field;

  static defaultProps = {
    autoFocus: false,
    collectName: false,
    showForgottenPassword: false,
  }

  componentWillMount() {
    const { type } = this.props;
    if (type === 'reAuth') {
      this.props.initialize({ email: firebase.auth().currentUser.email });
    }
  }

  render() {
    const {
      autoFocus,
      buttonText,
      collectName,
      error,
      handleSubmit,
      invalid,
      showForgottenPassword,
      submitting,
      type,
    } = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <FormError error={error} />
        {collectName && (
          <Field
            autoFocus={autoFocus}
            component={TextField}
            icon="md-person"
            name="name"
            onSubmitEditing={this.focusEmailInput}
            placeholder="Name"
            validate={isNameValid}
          />
        )}
        <Field
          autoCapitalize="none"
          autoFocus={autoFocus && !collectName}
          component={TextField}
          editable={type !== 'reAuth'}
          keyboardType="email-address"
          icon="md-mail"
          name="email"
          onSubmitEditing={this.focusPasswordInput}
          placeholder="Email"
          ref={(ref) => { this.emailInput = ref; }}
          validate={isEmailValid}
          withRef
        />
        <Field
          autoCapitalize="none"
          component={TextField}
          icon="md-lock"
          name="password"
          onSubmitEditing={handleSubmit(this.onSubmit)}
          placeholder="Password"
          ref={(ref) => { this.passwordInput = ref; }}
          secureTextEntry
          validate={isPasswordValid}
          withRef
        />
        {showForgottenPassword && (
          <LinkButton
            containerStyle={styles.forgottenPasswordContainer}
            onPress={this.onForgottenPassword}
            textStyle={styles.forgottenPasswordText}
            text="Forgotten your password?"
          />
        )}
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onSubmit)}
          text={buttonText}
        />
      </ScrollView>
    );
  }

  focusEmailInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.emailInput) this.emailInput.getRenderedComponent().focus();
  }

  focusPasswordInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.passwordInput) this.passwordInput.getRenderedComponent().focus();
  }

  onForgottenPassword = () => {
    // Navigates to the Forgotten Password screen
    this.props.navigation.navigate('ForgottenPassword');
  }

  onSubmit = async (values: Object) => {
    const { email, name, password } = values;
    const { navigation, onSuccess, type } = this.props;
    try {
      let user;
      if (type === 'link') {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        user = await firebase.auth().currentUser.linkWithCredential(credential);
      } else if (type === 'reAuth') {
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        user = await firebase.auth().currentUser.reauthenticateWithCredential(credential);
      } else if (type === 'register') {
        user = await firebase.auth().createUserWithEmailAndPassword(email, password);
      } else {
        user = await firebase.auth().signInWithEmailAndPassword(email, password);
      }

      if (onSuccess) onSuccess(user, name);
    } catch (error) {
      if (type === 'link' && error.code === 'auth/requires-recent-login') {
        // If we're supporting re-authentication and the error indicates that re-authentication
        // is required, then show the ReAuthModal
        navigation.navigate('ReAuth');
      } else {
        // If there is an error, pass it back to `redux-form`
        throw new SubmissionError({ _error: error });
      }
    }
  }
}

// withNavigation ensures that the component has access to the navigation object
// reduxForm allows `redux-form` to manage the underlying form and its fields
export default withNavigation(reduxForm({
  form: 'EmailAuth',
})(EmailAuth));
