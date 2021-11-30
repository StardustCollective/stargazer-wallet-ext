import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import { Input as RNEInput } from 'react-native-elements';
import { View, KeyboardType } from 'react-native';

import styles from './styles';

interface ITextInput {
  id?: string;
  placeholder: string;
  type?: 'text' | 'password' | 'number';
  label?: string;
}

const TextInput: FC<ITextInput> = ({
  id,
  type = 'text',
  placeholder = '',
  label = '',
}) => {

  let keyboardType: KeyboardType = 'default';

  if(type === 'number'){
    keyboardType = 'numeric'
  }

  return (
    <>
      <RNEInput
        placeholder={placeholder}
        secureTextEntry={type === 'password'}
        inputContainerStyle={styles.inputContainer}
        labelStyle={styles.label}
        label={label}
        keyboardType={keyboardType}
      />
    </>
  );

};

export default TextInput;
