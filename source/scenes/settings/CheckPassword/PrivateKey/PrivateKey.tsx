import React, { FC, useState } from 'react';
import clsx from 'clsx';
import Dropdown from 'components/Dropdown';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  NETWORK_TYPE,
  PRIVATE_KEY,
  COPIED,
  COPY_CLIPBOARD,
  DONE,
  REVEAL_PRIVATE_KEY,
  CANCEL,
  CONTINUE,
} from './constants';
import { IPrivateKey } from './types';
import styles from './PrivateKey.scss';

const PrivateKey: FC<IPrivateKey> = ({
  privateKey,
  isRemoveWallet,
  isCopied,
  copyText,
  networkOptions,
  onPressDone,
  onPressCancel,
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const primaryButtonType = isRemoveWallet
    ? BUTTON_TYPES_ENUM.ERROR_SOLID
    : BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID;
  const primaryButtonTitle = isRemoveWallet ? CONTINUE : DONE;
  const privateKeyContainerStyles = clsx(
    styles.keyContainer,
    !showPrivateKey && styles.extraKeyContainer
  );
  const buttonsContainerStyles = clsx(
    styles.buttonContainer,
    isRemoveWallet && styles.extraButtonContainer
  );

  return (
    <div className={styles.privateKeyContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {NETWORK_TYPE}
      </TextV3.CaptionStrong>
      <div
        className={clsx(styles.dropdownContainer, networkOptions.containerStyle, {
          [styles.showPointer]: !networkOptions.disabled,
        })}
      >
        <Dropdown options={networkOptions} />
      </div>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {PRIVATE_KEY}
      </TextV3.CaptionStrong>
      <div
        onClick={showPrivateKey ? () => copyText(privateKey) : null}
        className={privateKeyContainerStyles}
      >
        {!showPrivateKey && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            label={REVEAL_PRIVATE_KEY}
            onClick={() => setShowPrivateKey(true)}
          />
        )}
        {showPrivateKey && (
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.privateKeyText}
          >
            {privateKey}
          </TextV3.CaptionRegular>
        )}
      </div>
      {showPrivateKey && (
        <div onClick={() => copyText(privateKey)} className={styles.copyContainer}>
          <TextV3.CaptionStrong extraStyles={styles.copyText}>
            {isCopied ? COPIED : COPY_CLIPBOARD}
          </TextV3.CaptionStrong>
          {!isCopied && (
            <img src={`/${CopyIcon}`} height={20} width={32} alt="Copy icon" />
          )}
        </div>
      )}
      {!showPrivateKey && <div className={styles.copyContainerBlank} />}
      <div className={buttonsContainerStyles}>
        {isRemoveWallet && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.GRAY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            extraStyle={styles.button}
            label={CANCEL}
            onClick={onPressCancel}
          />
        )}
        <ButtonV3
          type={primaryButtonType}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={primaryButtonTitle}
          submit
          extraStyle={styles.button}
          onClick={onPressDone}
        />
      </div>
    </div>
  );
};

export default PrivateKey;
