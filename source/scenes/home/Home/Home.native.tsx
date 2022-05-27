///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';

///////////////////////////
// Constants
///////////////////////////

const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = '#FFF';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({ activeWallet, balanceObject, balance, onBuyPressed }) => {

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        {activeWallet ? (
          <>
            <View style={styles.fiatBalanceContainer}>
              <View style={styles.fiatBalance}>
                <TextV3.Body>{balanceObject.symbol}</TextV3.Body>
                <TextV3.HeaderDisplay dynamic extraStyles={styles.fiatBalanceLabel}>
                  {balanceObject.balance}
                </TextV3.HeaderDisplay>
                <TextV3.Body>{balanceObject.name}</TextV3.Body>
              </View>
              <View style={styles.bitcoinBalance}>
                <TextV3.Body>{`≈ ₿${balance}`}</TextV3.Body>
              </View>
              <ButtonV3
                title="Buy"
                size={BUTTON_SIZES_ENUM.LARGE}
                type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                onPress={onBuyPressed}
                extraStyles={styles.buyButton}
              />
            </View>
            <AssetsPanel />
          </>
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} color={ACTIVITY_INDICATOR_COLOR} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
