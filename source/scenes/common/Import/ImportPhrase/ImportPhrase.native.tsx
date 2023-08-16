///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import ViewOn from 'assets/images/svg/view-on.svg';
import ViewOff from 'assets/images/svg/view-off.svg';

///////////////////////////
// Types
///////////////////////////

import IImportPhrase from './types';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables';
import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

const EXTRA_SCROLL_HEIGHT = scale(25);

const ImportPhrase: FC<IImportPhrase> = ({
  title,
  buttonTitle,
  isDisabled,
  phraseOptions,
  phraseValues,
  handleInputChange,
  onSubmit,
}) => {
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={EXTRA_SCROLL_HEIGHT}
        showsVerticalScrollIndicator={true}
      >
        <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {title}
        </TextV3.Header>
        <View style={styles.dropdownContainer}>
          <Dropdown options={phraseOptions} />
        </View>
        <View style={styles.itemContainer}>
          {!!phraseValues &&
            phraseValues.length &&
            phraseValues.map((value, index) => {
              return (
                <View key={index} style={{ marginBottom: 8 }}>
                  <PhraseInput
                    index={index}
                    value={value}
                    onChangeText={handleInputChange}
                  />
                </View>
              );
            })}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={buttonTitle}
          extraStyles={styles.button}
          disabled={isDisabled}
          onPress={() => onSubmit(phraseValues)}
        />
      </View>
    </>
  );
};

const PhraseInput = ({ value, index, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusedStyles = isFocused && styles.inputFocused;
  const inputContainerStyle = StyleSheet.flatten([styles.inputContainer, focusedStyles]);
  const ViewIcon = showPassword ? ViewOn : ViewOff;

  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

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
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
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

export default ImportPhrase;
