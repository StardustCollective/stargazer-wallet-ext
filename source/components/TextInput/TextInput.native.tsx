import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import { Input as RNEInput } from 'react-native-elements';
import { KeyboardType } from 'react-native';
import { Controller } from "react-hook-form";

import styles from './styles';

interface ITextInput {
  name: string;
  placeholder: string;
  type?: 'text' | 'password' | 'number';
  label?: string;
  control: any;
}

const TextInput: FC<ITextInput> = ({
  type = 'text',
  placeholder = '',
  label = '',
  name = '',
  control,
}) => {

  let keyboardType: KeyboardType = 'default';

  if (type === 'number') {
    keyboardType = 'numeric'
  }

  return (
    <>
      <Controller
        control={control}
        as={
          <RNEInput
            placeholder={placeholder}
            secureTextEntry={type === 'password'}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            label={label}
            keyboardType={keyboardType}
          />
        }
        onChange={([text]) => {
          return text;
        }}
        name={name}
        onChangeName={'onChangeText'}
      />
    </>
  );

};

export default TextInput;
