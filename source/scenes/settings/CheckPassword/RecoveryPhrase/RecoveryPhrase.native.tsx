import React, { FC, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IRecoveryPhrase } from './types';
import {
  CANCEL,
  CONTINUE,
  COPIED,
  COPY_CLIPBOARD,
  DONE,
  RECOVERY_PHRASE,
  REVEAL_PHRASE,
} from './constants';
import styles from './styles';

const RecoveryPhrase: FC<IRecoveryPhrase> = ({
  walletPhrase,
  isCopied,
  isRemoveWallet,
  copyText,
  onPressDone,
  onPressCancel,
}) => {
  const [showPhrase, setShowPhrase] = useState(false);
  const phraseArray = walletPhrase.split(' ');
  const primaryButtonType = isRemoveWallet
    ? BUTTON_TYPES_ENUM.ERROR_SOLID
    : BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID;
  const primaryButtonTitle = isRemoveWallet ? CONTINUE : DONE;
  const primaryButtonStyles = StyleSheet.flatten([isRemoveWallet && styles.primary]);
  const extraContainerStyles = !isRemoveWallet
    ? styles.extraButtonContainer
    : styles.buttonContainer;

  const phraseContainerStyles = StyleSheet.flatten([
    styles.phraseContainer,
    !showPhrase && styles.extraPhraseContainer,
  ]);

  return (
    <View style={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {RECOVERY_PHRASE}
      </TextV3.CaptionStrong>
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!showPhrase}
        onPress={() => copyText(walletPhrase)}
        style={phraseContainerStyles}
      >
        {!showPhrase && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            title={REVEAL_PHRASE}
            onPress={() => setShowPhrase(true)}
          />
        )}
        {showPhrase &&
          phraseArray.map((phraseItem: string) => (
            <View key={phraseItem} style={styles.phraseItem}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
                {phraseItem}
              </TextV3.Caption>
            </View>
          ))}
      </TouchableOpacity>
      {showPhrase && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => copyText(walletPhrase)}
          style={styles.copyContainer}
        >
          <TextV3.CaptionStrong extraStyles={styles.copyText}>
            {isCopied ? COPIED : COPY_CLIPBOARD}
          </TextV3.CaptionStrong>
          {!isCopied && <CopyIcon height={20} width={32} />}
        </TouchableOpacity>
      )}
      <View style={styles.buttonsContainer}>
        {isRemoveWallet && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.GRAY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            extraContainerStyles={styles.buttonContainer}
            extraStyles={styles.cancel}
            title={CANCEL}
            onPress={onPressCancel}
          />
        )}
        <ButtonV3
          type={primaryButtonType}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={primaryButtonTitle}
          extraContainerStyles={extraContainerStyles}
          submit
          extraStyles={primaryButtonStyles}
          onPress={onPressDone}
        />
      </View>
    </View>
  );
};

export default RecoveryPhrase;
