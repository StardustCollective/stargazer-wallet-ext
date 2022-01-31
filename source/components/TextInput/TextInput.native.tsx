import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import { Input as RNEInput } from 'react-native-elements';
import { KeyboardType } from 'react-native';
import { Controller } from 'react-hook-form';

import styles from './styles';

interface ITextInput {
  name: string;
  placeholder: string;
  type?: 'text' | 'password' | 'number';
  label?: string;
  control: any;
  inputContainerStyle: {};
  multiline: boolean;
}

const TextInput: FC<ITextInput> = ({
  type = 'text',
  placeholder = '',
  label = '',
  name = '',
  control,
  inputContainerStyle,
  multiline = false,
  ...otherProps
}) => {
  let keyboardType: KeyboardType = 'default';

  if (type === 'number') {
    keyboardType = 'numeric';
  }

  return (
    <Controller
      control={control}
      as={
        <RNEInput
          placeholder={placeholder}
          secureTextEntry={type === 'password'}
          inputStyle={styles.input}
          inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
          labelStyle={styles.label}
          label={label}
          keyboardType={keyboardType}
          multiline={multiline}
          {...otherProps}
        />
      }
      onChange={([text]) => {
        return text;
      }}
      name={name}
      onChangeName={'onChangeText'}
    />
  );
};

export default TextInput;
