import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import { Input as RNEInput } from 'react-native-elements';
import { KeyboardType, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

import styles from './styles';

interface ITextInput {
  name: string;
  placeholder: string;
  type: 'text' | 'password' | 'number';
  label: string;
  control: any;
  inputContainerStyle: object;
  inputStyle: object;
  multiline: boolean;
  fullWidth: boolean;
  visiblePassword: boolean;
  defaultValue: string;
  onChange: (text: any) => void;
  onSubmit: (ev: any) => void;
}

const TextInput: FC<ITextInput> = ({
  fullWidth = true,
  type = 'text',
  placeholder = '',
  label = '',
  name = '',
  control,
  visiblePassword = false,
  inputContainerStyle = {},
  inputStyle = {},
  multiline = false,
  defaultValue = '',
  onChange,
  ...otherProps
}) => {
  let keyboardType: KeyboardType = 'default';

  if (type === 'number') {
    keyboardType = 'numeric';
  }

  const inputContainerStyles = StyleSheet.flatten([
    styles.inputContainer,
    fullWidth ? styles.fullWidth : null,
    inputContainerStyle,
  ]);
  const inputComposedStyles = StyleSheet.flatten([styles.input, inputStyle]);

  const [showed, setShowed] = useState(false);

  const handleClickShowPassword = () => {
    setShowed(!showed);
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
      as={
        <RNEInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          inputStyle={inputComposedStyles}
          inputContainerStyle={inputContainerStyles}
          labelStyle={styles.label}
          label={label}
          keyboardType={keyboardType}
          multiline={multiline}
          {...passwordProps} // eslint-disable-line
          {...otherProps} // eslint-disable-line
        />
      }
      onChange={([text]) => {
        if(onChange){
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
