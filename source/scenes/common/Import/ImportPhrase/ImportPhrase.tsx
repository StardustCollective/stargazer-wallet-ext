import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';
import Checkbox from 'components/Checkbox';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import IImportPhrase from './types';
import PhraseInput from './PhraseInput';
import styles from './ImportPhrase.scss';
import { CANCEL, MODAL_CHECKBOX_TEXT, MODAL_TITLE } from './constants';

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
      <div className={styles.container}>
        <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {title}
        </TextV3.Header>
        <div className={styles.dropdownContainer}>
          <Dropdown options={phraseOptions} />
        </div>
        <div className={styles.itemContainer}>
          {!!phraseValues &&
            phraseValues.length &&
            phraseValues.map((value, index) => {
              return (
                <div key={index} className={styles.phraseInputContainer}>
                  <PhraseInput
                    index={index}
                    value={value}
                    showPassword={showPasswordArray[index]}
                    togglePassword={togglePassword}
                    onChangeText={handleInputChange}
                  />
                </div>
              );
            })}
        </div>
        <div className={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label={buttonTitle}
            extraStyle={styles.button}
            disabled={isDisabled}
            loading={isLoading}
            onClick={() => onSubmit(phraseValues)}
          />
        </div>
      </div>
      <Modal visible={showPhraseModal} onBackdropPress={closePhraseModal}>
        <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.modalTitle}>
          {MODAL_TITLE}
        </TextV3.BodyStrong>
        <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
          {modalDescription}
        </TextV3.CaptionRegular>
        <div onClick={toggleCheckbox} className={styles.checkboxContainer}>
          <Checkbox active={isCheckboxActive} onPress={toggleCheckbox} />
          <div className={styles.checkboxTextContainer}>
            <TextV3.Caption extraStyles={styles.checkboxText} color={COLORS_ENUMS.BLACK}>
              {MODAL_CHECKBOX_TEXT}
            </TextV3.Caption>
          </div>
        </div>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.ERROR_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={buttonTitle}
          extraStyle={styles.modalButton}
          disabled={!isCheckboxActive}
          loading={isModalLoading}
          onClick={() => onSubmitConfirm(phraseValues)}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={CANCEL}
          extraStyle={styles.modalButton}
          onClick={closePhraseModal}
        />
      </Modal>
    </>
  );
};

export default ImportPhrase;
