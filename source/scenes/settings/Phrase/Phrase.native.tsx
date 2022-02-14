import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import IPhraseSettings from './types';

const Phrase: FC<IPhraseSettings> = ({
  handleSubmit,
  register,
  control,
  onSubmit,
  checked,
  phrase,
  isCopied,
  handleCopySeed,
}) => {
  const seedClass = StyleSheet.flatten([styles.seed, isCopied ? styles.copied : {}, !checked ? styles.notAllowed : {}]);

  return (
    <View style={styles.phrase}>
      <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
        Please input your wallet password and press enter:
      </TextV3.Description>
      <View>
        <TextInput
          control={control}
          id="phrase-password"
          type="password"
          name="password"
          visiblePassword
          fullWidth
          inputRef={register}
          inputStyles={styles.phraseText}
          onSubmitEditing={handleSubmit((data) => onSubmit(data))}
        />
      </View>
      <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
        Click to copy your seed phrase:
      </TextV3.Description>
      <TouchableOpacity testID="phrase-recoveryPhrase" onPress={handleCopySeed}>
        <View style={seedClass}>
          <TextV3.Body color={COLORS_ENUMS.DARK_GRAY} selectable extraStyles={styles.seedText}>
            {phrase}
          </TextV3.Body>
        </View>
      </TouchableOpacity>
      <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.text}>
        Warning: Keep your seed phrase secret! Anyone with your seed phrase can access any account connected to this
        wallet and steal your assets.
      </TextV3.Description>
    </View>
  );
};

export default Phrase;
