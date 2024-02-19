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

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './NetworksModal.scss';

///////////////////////////
// Types
///////////////////////////

import { INetworksModal } from './types';

///////////////////////////
// Constants
///////////////////////////

import { ALL_MAINNET_CHAINS, ALL_TESTNETS_CHAINS } from 'constants/index';

///////////////////////////
// Scene
///////////////////////////

const NetworksModal: FC<INetworksModal> = ({
  currentNetwork,
  handleSwitchActiveNetwork,
}) => {
  const renderCheckIcon = (chainId: string, currentNetworkId: string) => {
    if (chainId !== currentNetworkId) {
      return null;
    }

    return (
      <div className={styles.checkIconContainer}>
        <img src={`/${CheckIcon}`} className={styles.checkIcon} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
        Mainnets
      </TextV3.Caption>
      {ALL_MAINNET_CHAINS.map((chain, i) => {
        const chainStyles = clsx(
          styles.chainWrapper,
          i === 0 ? styles.firstChild : {},
          i === ALL_MAINNET_CHAINS.length - 1 ? styles.lastChild : {}
        );

        return (
          <div
            key={chain.id}
            className={chainStyles}
            onClick={() => handleSwitchActiveNetwork(chain.id)}
          >
            <div className={styles.logoContainer}>
              <img src={chain.logo} className={styles.logo} />
            </div>
            <div className={styles.chainInfoContainer}>
              <div className={styles.chainLabelContainer}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {chain.network}
                </TextV3.CaptionStrong>
              </div>
              {renderCheckIcon(chain.id, currentNetwork)}
            </div>
          </div>
        );
      })}
      <div className={styles.testnetsContainer}>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
          Testnets
        </TextV3.Caption>
        {ALL_TESTNETS_CHAINS.map((chain, i) => {
          const chainStyles = clsx(
            styles.chainWrapper,
            i === 0 ? styles.firstChild : {},
            i === ALL_TESTNETS_CHAINS.length - 1 ? styles.lastChild : {}
          );

          return (
            <div
              key={chain.id}
              className={chainStyles}
              onClick={() => handleSwitchActiveNetwork(chain.id)}
            >
              <div className={styles.logoContainer}>
                <img src={chain.logo} className={styles.logo} />
              </div>
              <div className={styles.chainInfoContainer}>
                <div className={styles.chainLabelContainer}>
                  <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                    {chain.label}
                  </TextV3.CaptionStrong>
                </div>
                {renderCheckIcon(chain.id, currentNetwork)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetworksModal;
