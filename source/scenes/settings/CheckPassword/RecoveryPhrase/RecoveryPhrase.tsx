import React, { FC } from 'react';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { RECOVERY_PHRASE, COPIED, COPY_CLIPBOARD, DONE } from './constants';
import styles from './RecoveryPhrase.scss';
import { IRecoveryPhrase } from './types';

const RecoveryPhrase: FC<IRecoveryPhrase> = ({
  walletPhrase,
  isCopied,
  copyText,
  onPressDone,
}) => {
  const phraseArray = walletPhrase.split(' ');
  return (
    <div className={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {RECOVERY_PHRASE}
      </TextV3.CaptionStrong>
      <div onClick={() => copyText(walletPhrase)} className={styles.phraseContainer}>
        {phraseArray.map((phraseItem: string) => (
          <div key={phraseItem} className={styles.phraseItem}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
              {phraseItem}
            </TextV3.Caption>
          </div>
        ))}
      </div>
      <div onClick={() => copyText(walletPhrase)} className={styles.copyContainer}>
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

export default RecoveryPhrase;
