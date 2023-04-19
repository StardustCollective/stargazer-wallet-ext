///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState, useLayoutEffect } from 'react';
import clsx from 'clsx';

///////////////////////////
// Utils
///////////////////////////

import homeHeader from 'navigation/headers/home';
import { truncateString } from 'scenes/home/helpers';
import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Components
///////////////////////////

import WalletsModal from './WalletsModal';
import NetworksModal from './NetworksModal';
import Sheet from 'components/Sheet';
import NetworkPicker from 'components/NetworkPicker';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up-white.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down-white.svg';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';

///////////////////////////
// Styles
///////////////////////////

import styles from './Home.scss';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';
import { KeyringWalletAccountState } from '@stardust-collective/dag4-keyring';

///////////////////////////
// constants
///////////////////////////

import {
  BUY_STRING,
  SWAP_STRING
} from './constants';
import { ALL_MAINNET_CHAINS, ALL_TESTNETS_CHAINS, ALL_CHAINS } from 'constants/index';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({
  navigation,
  route,
  activeWallet,
  balanceObject,
  multiChainWallets,
  privateKeyWallets,
  currentNetwork,
  onBuyPressed,
  onSwapPressed,
  isDagOnlyWallet,
}) => {

  const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState(false);
  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false);

  const walletController = getWalletController();

  const renderHeaderTitle = () => {
    const ArrowIcon = isWalletSelectorOpen ? ArrowUpIcon : ArrowDownIcon;
    return (
      <div className={styles.titleContainer} onClick={() => setIsWalletSelectorOpen(true)}>
        <TextV3.BodyStrong extraStyles={styles.titleText}>{activeWallet ? truncateString(activeWallet.label) : ""}</TextV3.BodyStrong>
        <img src={`/${ArrowIcon}`} />
      </div>
    );
  }

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

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route }),
      headerTitle: renderHeaderTitle,
    });
  }, [activeWallet, isWalletSelectorOpen]);

  ///////////////////////////
  // Render
  ///////////////////////////

  const networkTitle = ALL_MAINNET_CHAINS?.find((chain) => chain.id === currentNetwork)?.network || ALL_TESTNETS_CHAINS?.find((chain) => chain.id === currentNetwork)?.label;
  const networkLogo = ALL_CHAINS.find((chain) => chain.id === currentNetwork)?.logo;

  return (
    <div id={'home-scene'} className={styles.wrapper}>
      {activeWallet ? (
        <>
          {
            <>
              <div className={styles.networkPickerContainer}>
                <NetworkPicker 
                  title={networkTitle}
                  icon={networkLogo}
                  onPress={() => setIsNetworkSelectorOpen(true)}
                  isOpen={isNetworkSelectorOpen}
                />
              </div>
              <section className={styles.center}>
                <div className={styles.price}>
                  <div className={styles.symbol}>
                    <TextV3.Body extraStyles={styles.fiatType}>
                      {balanceObject.symbol}
                    </TextV3.Body>
                  </div>
                  <div className={styles.balance}>
                    <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                      {balanceObject.balance}
                    </TextV3.HeaderDisplay>
                  </div>
                  <div className={styles.name}>
                    <TextV3.Body extraStyles={styles.fiatType}>
                      {balanceObject.name}
                    </TextV3.Body>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <ButtonV3
                    label={BUY_STRING}
                    size={BUTTON_SIZES_ENUM.MEDIUM}
                    type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                    onClick={onBuyPressed}
                  />
                  {!isDagOnlyWallet && (
                    <>
                      <ButtonV3
                        label={SWAP_STRING}
                        size={BUTTON_SIZES_ENUM.MEDIUM}
                        type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                        onClick={onSwapPressed}
                      />
                    </>
                  )}
                </div>
              </section>
              <AssetsPanel />
            </>
          }
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: activeWallet,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
      <Sheet 
        title={{
          label: 'Wallets',
          align: 'left'
        }}
        isVisible={isWalletSelectorOpen}
        onClosePress={() => setIsWalletSelectorOpen(false)}
      >
        <WalletsModal 
          multiChainWallets={multiChainWallets}
          privateKeyWallets={privateKeyWallets}
          activeWallet={activeWallet}
          handleSwitchWallet={handleSwitchWallet}
        />
      </Sheet>
      <Sheet 
        title={{
          label: 'Switch network',
          align: 'left'
        }}
        isVisible={isNetworkSelectorOpen}
        onClosePress={() => setIsNetworkSelectorOpen(false)}
      >
        <NetworksModal 
          currentNetwork={currentNetwork}
          handleSwitchActiveNetwork={handleSwitchActiveNetwork}
        />
      </Sheet>
    </div>
  );
};

export default Home;
