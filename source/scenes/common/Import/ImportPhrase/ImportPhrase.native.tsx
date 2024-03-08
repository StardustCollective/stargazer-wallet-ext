import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';
import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import Checkbox from 'components/Checkbox';
import PhraseInput from './PhraseInput';
import IImportPhrase from './types';
import { MODAL_TITLE, MODAL_CHECKBOX_TEXT, CANCEL } from './constants';
import styles from './styles';

const EXTRA_SCROLL_HEIGHT = scale(25);

const ImportPhrase: FC<IImportPhrase> = ({
  title,
  buttonTitle,
  modalDescription,
  isDisabled,
  isLoading,
  isModalLoading,
  showPhraseModal,
  phraseOptions,
  phraseValues,
  showPasswordArray,
  isCheckboxActive,
  toggleCheckbox,
  closePhraseModal,
  onSubmitConfirm,
  handleInputChange,
  togglePassword,
  onSubmit,
}) => {
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={EXTRA_SCROLL_HEIGHT}
        showsVerticalScrollIndicator
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
                    onChangeText={handleInputChange}
                    showPassword={showPasswordArray[index]}
                    togglePassword={togglePassword}
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
          loading={isLoading}
          onPress={() => onSubmit(phraseValues)}
        />
      </View>
      <Modal visible={showPhraseModal} onBackdropPress={closePhraseModal}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.modalTitle}>
          {MODAL_TITLE}
        </TextV3.BodyStrong>
        <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
          {modalDescription}
        </TextV3.CaptionRegular>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleCheckbox}
          style={styles.checkboxContainer}
        >
          <Checkbox active={isCheckboxActive} onPress={toggleCheckbox} />
          <View style={styles.checkboxTextContainer}>
            <TextV3.Caption extraStyles={styles.checkboxText} color={COLORS_ENUMS.BLACK}>
              {MODAL_CHECKBOX_TEXT}
            </TextV3.Caption>
          </View>
        </TouchableOpacity>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.ERROR_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={buttonTitle}
          extraStyles={styles.modalButton}
          disabled={!isCheckboxActive}
          loading={isModalLoading}
          onPress={() => onSubmitConfirm(phraseValues)}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={CANCEL}
          extraStyles={styles.modalButton}
          onPress={closePhraseModal}
        />
      </Modal>
    </>
  );
};

export default ImportPhrase;
