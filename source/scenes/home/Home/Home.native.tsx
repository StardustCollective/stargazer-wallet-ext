///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import AssetsPanel from './AssetsPanel';
import TextV3 from 'components/TextV3';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

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

const Home: FC<IHome> = ({
  activeWallet,
  balanceObject,
  balance,
}) => {

  return (
    <ScrollView contentContainerStyle={styles.home}>
      {activeWallet ? (
        <>
          <View style={styles.fiatBalanceContainer}>
            <View style={styles.fiatBalance}>
              <TextV3.Body>
                {balanceObject.symbol}
              </TextV3.Body>
              <TextV3.HeaderDisplay dynamic extraStyles={styles.fiatBalanceLabel}>
                {balanceObject.balance}
              </TextV3.HeaderDisplay>
              <TextV3.Body>
                {balanceObject.name}
              </TextV3.Body>
            </View>
            <View style={styles.bitcoinBalance}>
              <TextV3.Body>
                {`≈ ₿${balance}`}
              </TextV3.Body>
            </View>
          </View>
          {/* <AssetsPanel /> */}
        </>
      ) : (

        <View style={styles.activityIndicator}>
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} color={ACTIVITY_INDICATOR_COLOR} />
        </View>
      )
      }
    </ScrollView >
  );
}

export default Home;

