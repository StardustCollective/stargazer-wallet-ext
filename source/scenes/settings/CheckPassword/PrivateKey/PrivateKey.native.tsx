import React, { FC, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TextV3 from 'components/TextV3';
import Dropdown from 'components/Dropdown';
import CopyIcon from 'assets/images/svg/copy.svg';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  CANCEL,
  CONTINUE,
  COPIED,
  COPY_CLIPBOARD,
  DONE,
  NETWORK_TYPE,
  PRIVATE_KEY,
  REVEAL_PRIVATE_KEY,
} from './constants';
import { IPrivateKey } from './types';
import styles from './styles';

const PrivateKey: FC<IPrivateKey> = ({
  privateKey,
  isRemoveWallet,
  isCopied,
  networkOptions,
  copyText,
  onPressDone,
  onPressCancel,
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const primaryButtonType = isRemoveWallet
    ? BUTTON_TYPES_ENUM.ERROR_SOLID
    : BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID;
  const primaryButtonTitle = isRemoveWallet ? CONTINUE : DONE;
  const primaryButtonStyles = StyleSheet.flatten([isRemoveWallet && styles.primary]);
  const extraContainerStyles = !isRemoveWallet
    ? styles.extraButtonContainer
    : styles.buttonContainer;

  return (
    <View style={styles.privateKeyContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {NETWORK_TYPE}
      </TextV3.CaptionStrong>
      <View style={[styles.dropdownContainer, networkOptions.containerStyle]}>
        <Dropdown options={networkOptions} />
      </View>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {PRIVATE_KEY}
      </TextV3.CaptionStrong>
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!showPrivateKey}
        onPress={() => copyText(privateKey)}
        style={styles.phraseContainer}
      >
        {!showPrivateKey && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            title={REVEAL_PRIVATE_KEY}
            onPress={() => setShowPrivateKey(true)}
          />
        )}
        {showPrivateKey && (
          <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
            {privateKey}
          </TextV3.CaptionRegular>
        )}
      </TouchableOpacity>
      {showPrivateKey && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => copyText(privateKey)}
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
          submit
          extraContainerStyles={extraContainerStyles}
          extraStyles={primaryButtonStyles}
          onPress={onPressDone}
        />
      </View>
    </View>
  );
};

export default PrivateKey;
