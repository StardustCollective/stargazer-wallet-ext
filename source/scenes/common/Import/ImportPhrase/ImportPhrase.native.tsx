import React, { FC } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';
import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import PhraseInput from './PhraseInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import IImportPhrase from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

const EXTRA_SCROLL_HEIGHT = scale(25);

const ImportPhrase: FC<IImportPhrase> = ({
  title,
  buttonTitle,
  isDisabled,
  isInvalidPhrase,
  phraseOptions,
  phraseValues,
  showPasswordArray,
  handleInputChange,
  togglePassword,
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
                <View key={index} style={styles.phraseInputContainer}>
                  <PhraseInput
                    index={index}
                    value={value}
                    hasError={isInvalidPhrase}
                    onChangeText={handleInputChange}
                    showPassword={showPasswordArray[index]}
                    togglePassword={togglePassword}
                  />
                </View>
              );
            })}
        </View>
        <View>
          {isInvalidPhrase && (
            <TextV3.Caption color={COLORS_ENUMS.RED}>Invalid phrase</TextV3.Caption>
          )}
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

export default ImportPhrase;
