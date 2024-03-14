import React, { FC, useState } from 'react';
import clsx from 'clsx';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  RECOVERY_PHRASE,
  COPIED,
  COPY_CLIPBOARD,
  DONE,
  CONTINUE,
  REVEAL_PHRASE,
  CANCEL,
} from './constants';
import styles from './RecoveryPhrase.scss';
import { IRecoveryPhrase } from './types';

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
  const primaryButtonStyles = isRemoveWallet ? styles.button : styles.doneButton;
  // const extraContainerStyles = !isRemoveWallet && styles.extraButtonContainer;
  const phraseContainerStyles = clsx(
    styles.phraseContainer,
    !showPhrase && styles.extraPhraseContainer
  );
  const buttonsContainerStyles = clsx(
    styles.buttonContainer,
    isRemoveWallet && styles.extraButtonContainer
  );

  return (
    <div className={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {RECOVERY_PHRASE}
      </TextV3.CaptionStrong>
      <div
        onClick={showPhrase ? () => copyText(walletPhrase) : null}
        className={phraseContainerStyles}
      >
        {!showPhrase && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.SMALL}
            label={REVEAL_PHRASE}
            onClick={() => setShowPhrase(true)}
          />
        )}
        {showPhrase &&
          phraseArray.map((phraseItem: string) => (
            <div key={phraseItem} className={styles.phraseItem}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
                {phraseItem}
              </TextV3.Caption>
            </div>
          ))}
      </div>
      {showPhrase && (
        <div onClick={() => copyText(walletPhrase)} className={styles.copyContainer}>
          <TextV3.CaptionStrong extraStyles={styles.copyText}>
            {isCopied ? COPIED : COPY_CLIPBOARD}
          </TextV3.CaptionStrong>
          {!isCopied && (
            <img src={`/${CopyIcon}`} height={20} width={32} alt="Copy icon" />
          )}
        </div>
      )}
      {!showPhrase && <div className={styles.copyContainerBlank} />}
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
          extraStyle={primaryButtonStyles}
          onClick={onPressDone}
        />
      </div>
    </div>
  );
};

export default RecoveryPhrase;
