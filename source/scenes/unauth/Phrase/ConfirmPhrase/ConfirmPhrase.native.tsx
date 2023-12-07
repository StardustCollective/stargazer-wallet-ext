///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import Layout from 'scenes/common/Layout';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import CheckIcon from 'components/CheckIcon';
import TextV3 from 'components/TextV3';

///////////////////////////
// Types
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import IConfirmPhrase from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Scene
///////////////////////////

const ConfirmPhrase: FC<IConfirmPhrase> = ({
  title,
  isButtonDisabled,
  passed,
  orgList,
  newList,
  checkList,
  handleOrgPhrase,
  handleNewPhrase,
  handleConfirm,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Layout title={title}>
        <View style={styles.readyContainer}>
          {passed && <View style={styles.checkIcon}>{passed && <CheckIcon />}</View>}
          <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY}>
            {passed
              ? 'You should now have your recovery phrase and your wallet password written down for future reference.'
              : 'Select the words in the correct order.'}
          </TextV3.CaptionStrong>
        </View>
        {!passed && (
          <>
            <View style={[styles.section, styles.sectionBorder]}>
              {newList.map((phrase: string, idx: number) => (
                <ButtonV3
                  id={phrase}
                  key={phrase}
                  title={phrase}
                  type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
                  extraStyles={[styles.wordButton, styles.wordButtonSelected]}
                  extraTitleStyles={styles.wordButtonSelectedTitle}
                  onPress={() => handleNewPhrase(idx)}
                />
              ))}
            </View>
            <View style={styles.section}>
              {orgList.map((phrase: string, idx: number) => (
                <ButtonV3
                  id={phrase}
                  key={phrase}
                  title={phrase}
                  extraStyles={[
                    styles.wordButton,
                    !checkList[idx] && styles.wordButtonPurpleLight,
                    checkList[idx] && styles.wordButtonPressed,
                  ]}
                  extraTitleStyles={[
                    !checkList[idx] ? styles.wordButtonTitle : styles.wordButtonTitleIdle,
                  ]}
                  onPress={() => handleOrgPhrase(idx)}
                />
              ))}
            </View>
          </>
        )}
        <View style={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY}
            size={BUTTON_SIZES_ENUM.LARGE}
            title={passed ? 'Next' : 'Validate'}
            disabled={isButtonDisabled}
            onPress={handleConfirm}
            extraStyles={styles.nextButton}
          />
        </View>
      </Layout>
    </ScrollView>
  );
};

export default ConfirmPhrase;
