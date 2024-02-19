///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import { View, ScrollView } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import Layout from 'scenes/common/Layout';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////////
// Scene
///////////////////////////

const CreatePhrase = ({ title, description, nextHandler, phrases, passed }) => {
  const phrasesArray = phrases?.split(' ');
  const firstColumn = phrasesArray?.slice(0, 6);
  const secondColumn = phrasesArray?.slice(6, 12);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Layout title={title}>
        <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
          {description}
        </TextV3.BodyStrong>
        {!passed && phrases && (
          <View style={styles.phraseContainer}>
            <View style={styles.firstColumnContainer}>
              {firstColumn.map((phrase: string, index: number) => (
                <View key={phrase} style={styles.phrase}>
                  <TextV3.CaptionStrong color={COLORS_ENUMS.GRAY_100}>
                    {String(index + 1).padStart(2, '0')}.{'  '}
                    <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY}>
                      {phrase}
                    </TextV3.CaptionStrong>
                  </TextV3.CaptionStrong>
                </View>
              ))}
            </View>
            <View style={styles.secondColumnContainer}>
              {secondColumn.map((phrase: string, index: number) => (
                <View key={phrase} style={styles.phrase}>
                  <TextV3.CaptionStrong color={COLORS_ENUMS.GRAY_100}>
                    {String(index + 7).padStart(2, '0')}.{'  '}
                    <TextV3.CaptionStrong color={COLORS_ENUMS.DARK_GRAY}>
                      {phrase}
                    </TextV3.CaptionStrong>
                  </TextV3.CaptionStrong>
                </View>
              ))}
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY}
            size={BUTTON_SIZES_ENUM.LARGE}
            title={passed ? "Let's do it" : "I've written it down"}
            onPress={nextHandler}
            extraStyles={styles.nextButton}
          />
        </View>
      </Layout>
    </ScrollView>
  );
};

export default CreatePhrase;
