///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import AssetsPanel from './AssetsPanel';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import IProcessState from 'state/process/types';
import { ProcessStates } from 'state/process/enums';

///////////////////////////
// Constants
///////////////////////////

import {BUY_DAG_URL} from 'constants/index';

const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = '#FFF';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({ activeWallet, balanceObject, balance }) => {


  const { balances }: IVaultState = useSelector((state: RootState) => state.vault);
  const { login: LoginProcessState, fetchDagBalance }: IProcessState = useSelector((state: RootState) => state.process);

  const onHowToBuyDagPressed = () => {
    Linking.openURL(BUY_DAG_URL);
  }

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
              { !(fetchDagBalance === ProcessStates.IN_PROGRESS 
                && LoginProcessState === ProcessStates.IN_PROGRESS) 
                && balances.constellation === 0
                && (
                <>
                  <ButtonV3
                    title="How to Buy DAG"
                    size={BUTTON_SIZES_ENUM.LARGE}
                    type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
                    onPress={onHowToBuyDagPressed}
                    extraStyles={styles.buyDagButton}
                  />
                </>
              )}
            </View>
            <AssetsPanel />
          </>
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} color={ACTIVITY_INDICATOR_COLOR} />
          </View>
        )}
      </ScrollView>
    </View >
  );
};

export default Home;
