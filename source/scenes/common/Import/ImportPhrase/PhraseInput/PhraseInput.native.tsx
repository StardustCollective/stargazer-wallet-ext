import React, { FC, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import TextV3 from 'components/TextV3';
import ViewOn from 'assets/images/svg/view-on.svg';
import ViewOff from 'assets/images/svg/view-off.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables';
import { IPhraseInput } from './types';
import styles from './styles';

const PhraseInput: FC<IPhraseInput> = ({ value, index, hasError, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusedStyles = isFocused && styles.inputFocused;
  const errorStyles = hasError && styles.inputError;
  const inputContainerStyle = StyleSheet.flatten([
    styles.inputContainer,
    focusedStyles,
    errorStyles,
  ]);
  const ViewIcon = showPassword ? ViewOn : ViewOff;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={inputContainerStyle}>
      <TextV3.CaptionRegular extraStyles={styles.indexText} color={COLORS_ENUMS.BLACK}>
        {index + 1}.
      </TextV3.CaptionRegular>
      <TextInput
        secureTextEntry={!showPassword}
        style={styles.phraseInput}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        selectionColor={COLORS.primary_lighter_1}
        value={value}
        onChangeText={(text) => {
          onChangeText(text, index);
        }}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.passwordIcon} onPress={toggleShowPassword}>
        <ViewIcon />
      </TouchableOpacity>
    </View>
  );
};

export default PhraseInput;
