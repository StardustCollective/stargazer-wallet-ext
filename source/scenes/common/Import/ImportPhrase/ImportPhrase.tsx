import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import PhraseInput from './PhraseInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import IImportPhrase from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './ImportPhrase.scss';

const ImportPhrase: FC<IImportPhrase> = ({
  title,
  buttonTitle,
  isDisabled,
  isInvalidPhrase,
  phraseOptions,
  phraseValues,
  handleInputChange,
  onSubmit,
}) => {
  return (
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
                  hasError={isInvalidPhrase}
                  onChangeText={handleInputChange}
                />
              </div>
            );
          })}
      </div>
      <div>
        {isInvalidPhrase && (
          <TextV3.Caption color={COLORS_ENUMS.RED}>Invalid phrase</TextV3.Caption>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={buttonTitle}
          extraStyle={styles.button}
          disabled={isDisabled}
          onClick={() => onSubmit(phraseValues)}
        />
      </div>
    </div>
  );
};

export default ImportPhrase;
