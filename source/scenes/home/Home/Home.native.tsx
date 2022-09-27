///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator, ScrollView, Modal } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';

///////////////////////////
// Utils
///////////////////////////

import { getAccountController } from 'utils/controllersUtils';

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

///////////////////////////
// Constants
///////////////////////////

const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = '#FFF';
let lastIsConnected: boolean = true;
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({ activeWallet, balanceObject, balance, onBuyPressed }) => {

  const accountController = getAccountController();
  {/* TODO-421: Remove when Mainnet 2.0 is available */}
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const isModalVisible = activeNetwork.Constellation === 'main';
  const [modalOpen, setModalOpen] = useState(isModalVisible);

  // Subscribe to NetInfo
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && !lastIsConnected) {
        lastIsConnected = true;
        await accountController.assetsBalanceMonitor.start();
      } else {
        lastIsConnected = false;
      }
    });
  
    return () => {
      unsubscribeNetInfo();
    }
  }, []);
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        {activeWallet ? (
          <>
            <View style={styles.fiatBalanceContainer}>
              <View style={styles.fiatBalance}>
                <TextV3.Body extraStyles={styles.fiatType}>{balanceObject.symbol}</TextV3.Body>
                <TextV3.HeaderDisplay dynamic extraStyles={styles.fiatBalanceLabel}>
                  {balanceObject.balance}
                </TextV3.HeaderDisplay>
                <TextV3.Body extraStyles={styles.fiatType}>{balanceObject.name}</TextV3.Body>
              </View>
              <View style={styles.bitcoinBalance}>
                <TextV3.Body extraStyles={styles.balanceText}>{`≈ ₿${balance}`}</TextV3.Body>
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
            {/* TODO-421: Remove this modal when Mainnet 2.0 is available */}
            <View style={styles.centeredView}>
              <Modal animationType='fade' transparent={true} visible={modalOpen}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>Notice</TextV3.BodyStrong>
                    <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK} extraStyles={styles.modalText}>Constellation mainnet will upgrade to v2.0 at 12:00 UTC on September 28th. At that time mainnet 1.0 will become obsolete. You will need to go to Settings -{'>'} Networks and switch to the 2.0 network in order to connect to the new network and interact with your Constellation assets.</TextV3.CaptionRegular>
                    <ButtonV3
                      title="Ok"
                      extraStyles={{ backgroundColor: '#4F3A9C' }}
                      onPress={() => setModalOpen(false)}
                    />
                  </View>
                </View>
              </Modal>
            </View>
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
