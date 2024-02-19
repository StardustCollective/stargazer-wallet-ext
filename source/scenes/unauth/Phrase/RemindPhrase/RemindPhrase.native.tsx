///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Layout from 'scenes/common/Layout';
import TextV3 from 'components/TextV3';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Types
///////////////////////////

import IRemindPhrase from './types';

///////////////////////////
// Scenes
///////////////////////////

const RemindPhrase: FC<IRemindPhrase> = ({ nextHandler }) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Layout title={`Let's create your\nrecovery phrase`}>
      <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
        A recovery phrase is a series of 12 words in a specific order. This word
        combination is unique to your wallet. Make sure to have pen and paper ready so you
        can write it down.
      </TextV3.BodyStrong>
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={'Next'}
          onPress={nextHandler}
        />
      </View>
    </Layout>
  );
};

export default RemindPhrase;
