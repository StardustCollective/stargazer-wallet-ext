///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'assets/images/svg/check-transparent.svg';
import StargazerIcon from 'assets/images/logo-s.svg';
import LockIcon from 'assets/images/svg/lock-icon.svg';

///////////////////////////
// Utils
///////////////////////////

import { truncateString, ellipsis } from 'scenes/home/helpers';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';
import styles from './WalletsModal.scss';

///////////////////////////
// Types
///////////////////////////

import { IWalletsModal } from './types';

///////////////////////////
// Constants
///////////////////////////

const WalletsModal: FC<IWalletsModal> = ({
  multiChainWallets,
  privateKeyWallets,
  hardwareWallets,
  activeWallet,
  handleSwitchWallet,
}) => {
  const renderStargazerIcon = () => {
    return (
      <div className={styles.stargazerIconWrapper}>
        <img src={`/${StargazerIcon}`} className={styles.stargazerIcon} />
      </div>
    );
  };

  const renderEthereumIcon = () => {
    return (
      <div className={styles.assetIconWrapper}>
        <img src={ETHEREUM_LOGO} className={styles.assetIcon} />
      </div>
    );
  };

  const renderConstellationIcon = () => {
    return (
      <div className={styles.assetIconWrapper}>
        <img src={CONSTELLATION_LOGO} className={styles.assetIcon} />
      </div>
    );
  };

  const renderHardwareIcon = () => {
    return (
      <div className={styles.hardwareIconWrapper}>
        <img src={`/${LockIcon}`} className={styles.hardwareIcon} />
      </div>
    );
  };

  const renderCheckIcon = (walletId: string, activeWalletId: string) => {
    if (walletId !== activeWalletId) {
      return null;
    }

    return (
      <div className={styles.checkContainer}>
        <img src={`/${CheckIcon}`} className={styles.checkIcon} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {!!multiChainWallets.length && (
        <>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
            Multi-Chain Wallets
          </TextV3.Caption>
          {multiChainWallets.map((wallet, i) => {
            const walletStyles = clsx(
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === multiChainWallets.length - 1 ? styles.lastChild : {}
            );

            return (
              <div
                key={wallet.id}
                className={walletStyles}
                onClick={() => handleSwitchWallet(wallet.id, wallet.accounts)}
              >
                {renderStargazerIcon()}
                <div className={styles.walletInfoContainer}>
                  <div className={styles.walletLabelContainer}>
                    <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                      {truncateString(wallet.label)}
                    </TextV3.CaptionStrong>
                    <TextV3.Caption dynamic color={COLORS_ENUMS.GRAY_100}>
                      Multi-Chain Wallet
                    </TextV3.Caption>
                  </div>
                  {renderCheckIcon(wallet.id, activeWallet.id)}
                </div>
              </div>
            );
          })}
        </>
      )}
      {!!privateKeyWallets.length && (
        <div className={styles.privateWalletsContainer}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
            Private Key Wallets
          </TextV3.Caption>
          {privateKeyWallets.map((wallet, i) => {
            const walletStyles = clsx(
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === privateKeyWallets.length - 1 ? styles.lastChild : {}
            );

            return (
              <div
                key={wallet.id}
                className={walletStyles}
                onClick={() => handleSwitchWallet(wallet.id, wallet.accounts)}
              >
                {wallet.supportedAssets.includes(KeyringAssetType.ETH)
                  ? renderEthereumIcon()
                  : renderConstellationIcon()}
                <div className={styles.walletInfoContainer}>
                  <div className={styles.walletLabelContainer}>
                    <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                      {truncateString(wallet.label)}
                    </TextV3.CaptionStrong>
                    <TextV3.Caption dynamic color={COLORS_ENUMS.GRAY_100}>
                      {ellipsis(wallet.accounts[0].address)}
                    </TextV3.Caption>
                  </div>
                  {renderCheckIcon(wallet.id, activeWallet.id)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!!hardwareWallets.length && (
        <div className={styles.privateWalletsContainer}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
            Hardware Wallets
          </TextV3.Caption>
          {hardwareWallets.map((wallet, i) => {
            const walletStyles = clsx(
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === hardwareWallets.length - 1 ? styles.lastChild : {}
            );

            return (
              <div
                key={wallet.id}
                className={walletStyles}
                onClick={() => handleSwitchWallet(wallet.id, wallet.accounts)}
              >
                {renderHardwareIcon()}
                <div className={styles.walletInfoContainer}>
                  <div className={styles.walletLabelContainer}>
                    <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                      {truncateString(wallet.label)}
                    </TextV3.CaptionStrong>
                    <TextV3.Caption dynamic color={COLORS_ENUMS.GRAY_100}>
                      {ellipsis(wallet.accounts[0].address)}
                    </TextV3.Caption>
                  </div>
                  {renderCheckIcon(wallet.id, activeWallet.id)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WalletsModal;
