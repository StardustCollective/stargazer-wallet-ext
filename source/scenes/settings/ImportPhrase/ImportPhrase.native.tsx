import React, { FC } from 'react';
import { View } from 'react-native';

import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import IImportPhraseSettings from './types';

const ImportPhrase: FC<IImportPhraseSettings> = ({
  loading,
  onCancelClick,
  handleSubmit,
  onSubmit,
  register,
  control,
}) => {
  return (
    <View style={styles.wrapper}>
      <View>
        <TextV3.Label color={COLORS_ENUMS.DARK_GRAY} uppercase extraStyles={styles.label}>
          Recovery Seed Phrase
        </TextV3.Label>
        <TextInput
          control={control}
          id="importPhrase-phraseInput"
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          inputRef={register}
          inputStyle={styles.inputTextArea}
        />
        <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.description}>
          Typically 12 (sometimes 24) words separated by single spaces
        </TextV3.Description>
        <TextV3.Label color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.label} uppercase>
          Name
        </TextV3.Label>
        <TextInput
          control={control}
          id="importPhrase-nameInput"
          fullWidth
          inputRef={register}
          name="label"
          disabled={loading}
          inputStyle={styles.inputName}
        />
      </View>
      <View style={styles.actions}>
        <ButtonV3
          title="Cancel"
          id="importPhrase-cancelButton"
          size={BUTTON_SIZES_ENUM.SMALL}
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
          theme="secondary"
          onPress={onCancelClick}
        />
        <ButtonV3
          title="Import"
          id="importPhrase-importButton"
          size={BUTTON_SIZES_ENUM.SMALL}
          type={BUTTON_TYPES_ENUM.PRIMARY}
          loading={loading}
          onPress={handleSubmit((data) => onSubmit(data))}
        />
      </View>
    </View>
  );
};

export default ImportPhrase;
