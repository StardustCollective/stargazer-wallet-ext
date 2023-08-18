import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IRecoveryPhrase } from './types';
import { COPIED, COPY_CLIPBOARD, DONE, RECOVERY_PHRASE } from './constants';
import styles from './styles';

const RecoveryPhrase: FC<IRecoveryPhrase> = ({
  walletPhrase,
  isCopied,
  copyText,
  onPressDone,
}) => {
  const phraseArray = walletPhrase.split(' ');
  return (
    <View style={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        {RECOVERY_PHRASE}
      </TextV3.CaptionStrong>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyText(walletPhrase)}
        style={styles.phraseContainer}
      >
        {phraseArray.map((phraseItem: string) => (
          <View key={phraseItem} style={styles.phraseItem}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
              {phraseItem}
            </TextV3.Caption>
          </View>
        ))}
      </TouchableOpacity>
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
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={DONE}
          submit
          extraStyles={styles.doneButton}
          onPress={onPressDone}
        />
      </View>
    </View>
  );
};

export default RecoveryPhrase;
