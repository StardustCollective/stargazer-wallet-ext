import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import { Input as RNEInput } from 'react-native-elements';
import { KeyboardType, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { COLORS } from 'assets/styles/_variables';

import styles from './styles';

interface ITextInput {
  name: string;
  placeholder: string;
  type: 'text' | 'password' | 'number';
  label: string;
  control: any;
  inputContainerStyle: object;
  inputStyle: object;
  labelStyle: object;
  multiline: boolean;
  fullWidth: boolean;
  visiblePassword: boolean;
  defaultValue: any;
  returnKeyType: string;
  blurOnSubmit: boolean;
  error: boolean;
  onChange: (text: any) => void;
  onSubmit: (ev: any) => void;
}

const TextInput: FC<ITextInput> = ({
  fullWidth = true,
  error = false,
  type = 'text',
  placeholder = '',
  label = '',
  name = '',
  control,
  visiblePassword = false,
  inputContainerStyle = {},
  inputStyle = {},
  labelStyle = {},
  multiline = false,
  defaultValue = '',
  returnKeyType = 'done',
  blurOnSubmit = true,
  onChange,
  ...otherProps
}) => {
  let keyboardType: KeyboardType = 'default';

  if (type === 'number') {
    keyboardType = 'numeric';
  }
  const [focused, setFocused] = useState(false);

  const inputContainerStyles = StyleSheet.flatten([
    styles.inputContainer,
    fullWidth ? styles.fullWidth : null,
    error ? styles.error : null,
    focused ? styles.inputFocused : null,
    inputContainerStyle,
  ]);
  const inputComposedStyles = StyleSheet.flatten([styles.input, inputStyle]);
  const labelComposedStyles = StyleSheet.flatten([styles.label, labelStyle]);

  const [showed, setShowed] = useState(false);

  const handleClickShowPassword = () => {
    setShowed(!showed);
  };

  const handleOnFocus = () => {
    setFocused(true);
  };

  const handleOnBlur = () => {
    setFocused(false);
  };

  const passwordProps =
    type === 'password' && visiblePassword
      ? {
          rightIcon: {
            name: showed ? 'visibility-off' : 'visibility',
            size: 20,
            onPress: handleClickShowPassword,
          },
          rightIconContainerStyle: {
            paddingRight: 15,
          },
        }
      : {};

  const secureTextEntry = type === 'password' && !showed;
  return (
    <Controller
      control={control}
      onBlur={handleOnBlur}
      as={
        <RNEInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          inputStyle={inputComposedStyles}
          inputContainerStyle={inputContainerStyles}
          labelStyle={labelComposedStyles}
          label={label}
          keyboardType={keyboardType}
          multiline={multiline}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          selectionColor={COLORS.primary_lighter_1}
          onFocus={handleOnFocus}
          {...passwordProps} // eslint-disable-line
          {...otherProps} // eslint-disable-line
        />
      }
      onChange={([text]) => {
        if (onChange) {
          onChange(text);
        }
        return text;
      }}
      name={name}
      defaultValue={defaultValue}
      onChangeName="onChangeText"
    />
  );
};

export default TextInput;
