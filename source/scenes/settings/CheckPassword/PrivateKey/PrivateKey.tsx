import React, { FC } from 'react';
import clsx from 'clsx';
import Dropdown from 'components/Dropdown';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { NETWORK_TYPE, PRIVATE_KEY, COPIED, COPY_CLIPBOARD, DONE } from './constants';
import { IPrivateKey } from './types';
import styles from './PrivateKey.scss';

const PrivateKey: FC<IPrivateKey> = ({
  privateKey,
  isCopied,
  copyText,
  networkOptions,
  onPressDone,
}) => {
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
      <div onClick={() => copyText(privateKey)} className={styles.phraseContainer}>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.BLACK}
          extraStyles={styles.privateKeyText}
        >
          {privateKey}
        </TextV3.CaptionRegular>
      </div>
      <div onClick={() => copyText(privateKey)} className={styles.copyContainer}>
        <TextV3.CaptionStrong extraStyles={styles.copyText}>
          {isCopied ? COPIED : COPY_CLIPBOARD}
        </TextV3.CaptionStrong>
        {!isCopied && <img src={`/${CopyIcon}`} height={20} width={32} />}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={DONE}
          submit
          extraStyle={styles.doneButton}
          onClick={onPressDone}
        />
      </div>
    </div>
  );
};

export default PrivateKey;
