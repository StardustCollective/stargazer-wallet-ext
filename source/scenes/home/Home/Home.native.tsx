///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import { View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

///////////////////////////
// Components
///////////////////////////

import WalletsModal from './WalletsModal';
import NetworksModal from './NetworksModal';
import Sheet from 'components/Sheet';
import NetworkPicker from 'components/NetworkPicker';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down.svg';

///////////////////////////
// Utils
///////////////////////////

import { getAccountController, getWalletController } from 'utils/controllersUtils';
import homeHeader from 'navigation/headers/home';
import { truncateString } from 'scenes/home/helpers';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';
import { KeyringWalletAccountState } from '@stardust-collective/dag4-keyring';

///////////////////////////
// Constants
///////////////////////////

import {
  BUY_STRING,
  SWAP_STRING
} from './constants';
import { ALL_MAINNET_CHAINS, ALL_TESTNETS_CHAINS, ALL_CHAINS } from 'constants/index';

const ACTIVITY_INDICATOR_SIZE = 'large';
const ACTIVITY_INDICATOR_COLOR = '#FFF';
const ICON_SIZE = 14;
let lastIsConnected: boolean = true;

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({ 
  navigation,
  route,
  activeWallet,
  balanceObject,
  isDagOnlyWallet,
  multiChainWallets,
  privateKeyWallets,
  currentNetwork,
  onBuyPressed,
  onSwapPressed
}) => {

  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false);

  const accountController = getAccountController();
  const walletController = getWalletController();

  const handleSwitchWallet = async (walletId: string, walletAccounts: KeyringWalletAccountState[]) => {
    setIsWalletSelectorOpen(false);
    await walletController.switchWallet(walletId);
    const accounts = walletAccounts.map((account) => account.address);
    await walletController.notifyWalletChange(accounts);
  };

  const handleSwitchActiveNetwork = async (chainId: string) => {
    setIsNetworkSelectorOpen(false);
    await walletController.switchActiveNetwork(chainId);
  }

  const renderHeaderTitle = () => {
    const ArrowIcon = isWalletSelectorOpen ? ArrowUpIcon : ArrowDownIcon;
    return (
      <TouchableOpacity style={styles.headerTitleContainer} onPress={() => setIsWalletSelectorOpen(true)}>
        <TextV3.BodyStrong extraStyles={styles.headerTitle}>{activeWallet ? truncateString(activeWallet.label) : ""}</TextV3.BodyStrong>
        <ArrowIcon width={ICON_SIZE} height={ICON_SIZE} color="white" />
      </TouchableOpacity>
    );
  }

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route }),
      headerTitle: renderHeaderTitle,
    });
  }, [activeWallet, isWalletSelectorOpen]);

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

  const networkTitle = ALL_MAINNET_CHAINS?.find((chain) => chain.id === currentNetwork)?.network || ALL_TESTNETS_CHAINS?.find((chain) => chain.id === currentNetwork)?.label;
  const networkLogo = ALL_CHAINS.find((chain) => chain.id === currentNetwork)?.logo;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
        {activeWallet ? (
          <>
            <View style={styles.networkPickerContainer}>
              <NetworkPicker 
                title={networkTitle}
                icon={networkLogo}
                onPress={() => setIsNetworkSelectorOpen(true)}
                isOpen={isNetworkSelectorOpen}
              />
            </View>
            <View style={styles.fiatBalanceContainer}>
              <View style={styles.fiatBalance}>
                <TextV3.Body extraStyles={styles.fiatType}>{balanceObject.symbol}</TextV3.Body>
                <TextV3.HeaderDisplay dynamic extraStyles={styles.fiatBalanceLabel}>
                  {balanceObject.balance}
                </TextV3.HeaderDisplay>
                <TextV3.Body extraStyles={styles.fiatType}>{balanceObject.name}</TextV3.Body>
              </View>
              <View style={styles.buttons}>
                <ButtonV3
                  title={BUY_STRING}
                  size={BUTTON_SIZES_ENUM.LARGE}
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  onPress={onBuyPressed}
                  extraStyles={styles.buttonNormal}
                />
                {!isDagOnlyWallet && (
                  <>
                    <ButtonV3
                      title={SWAP_STRING}
                      size={BUTTON_SIZES_ENUM.LARGE}
                      type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                      onPress={onSwapPressed}
                      extraStyles={styles.buttonNormal}
                    />
                  </>
                )}
              </View>
            </View>
            <AssetsPanel />
          </>
        ) : (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} color={ACTIVITY_INDICATOR_COLOR} />
          </View>
        )}
      </ScrollView>
      <Sheet 
        isVisible={isWalletSelectorOpen}
        onClosePress={() => setIsWalletSelectorOpen(false)}
        height='65%'
        title={{
          label: 'Wallets',
          align: 'left',
        }}
      >
        <WalletsModal 
          multiChainWallets={multiChainWallets}
          privateKeyWallets={privateKeyWallets}
          activeWallet={activeWallet}
          handleSwitchWallet={handleSwitchWallet}
        />
      </Sheet>
      <Sheet 
        isVisible={isNetworkSelectorOpen}
        onClosePress={() => setIsNetworkSelectorOpen(false)}
        height='65%'
        title={{
          label: 'Switch network',
          align: 'left',
        }}
      >
        <NetworksModal 
          currentNetwork={currentNetwork}
          handleSwitchActiveNetwork={handleSwitchActiveNetwork}
        />
      </Sheet>
    </View>
  );
};

export default Home;
