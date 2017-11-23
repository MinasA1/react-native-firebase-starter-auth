/**
 * @flow
 *
 * The Button component acts as a standard button with optional text and icon
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import Icon from './Icon';
import * as Theme from '../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The optional style for the button container
  containerStyle?: StyleObj,
  // Whether the button is disabled
  disabled?: boolean,
  // The optional icon to show as part of the button
  icon?: string,
  // The optional style for the button icon
  iconStyle?: StyleObj,
  // The action to call when the button is pressed
  onPress: () => any,
  // The optional text to show as part of the button
  text?: string,
  // The optional style for the button text
  textStyle?: StyleObj,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Theme.BUTTON,
    borderRadius: 22.5,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    margin: 4,
  },
  disabled: {
    backgroundColor: Theme.BUTTON_DISABLED,
  },
  icon: {
    color: '#fff',
    margin: 4,
    width: 45,
  },
  text: {
    color: '#fff',
    marginLeft: 8,
  },
});

export default (props: Props) => {
  const {
    containerStyle,
    disabled,
    icon,
    iconStyle,
    onPress,
    text,
    textStyle,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, disabled && styles.disabled, containerStyle]}
      {...restProps}>
      {icon && <Icon active name={icon} style={[styles.icon, iconStyle]} />}
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </TouchableOpacity>
  );
};
