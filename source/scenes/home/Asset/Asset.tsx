///////////////////////
// Modules
///////////////////////

import React, { useEffect, useMemo, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { formatNumber, getAddressURL } from '../helpers';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

///////////////////////
// Components
///////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import TxsPanel from './TxsPanel';

///////////////////////
// Hooks
///////////////////////

import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';

///////////////////////
// State
///////////////////////

import { RootState } from 'state/store';

///////////////////////
// Navigation
///////////////////////

import assetHeader from 'navigation/headers/asset';
import { useLinkTo } from '@react-navigation/native';

///////////////////////
// Styles
///////////////////////

import styles from './Asset.scss';

///////////////////////
// Types
///////////////////////

import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';

type IAssetDetail = {
  navigation: any;
}

///////////////////////
// Component
///////////////////////

const AssetDetail = ({ navigation }: IAssetDetail) => {


  ///////////////////////
  // Hooks
  ///////////////////////

  const linkTo = useLinkTo();
  const controller = useController();
  const getFiatAmount = useFiat();
  const { activeWallet, activeAsset, activeNetwork, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  const balance = useMemo(() => {
    return Number((activeAsset && balances[activeAsset.id]) || 0)
  }, [activeAsset, balances]);

  // Sets the header for the asset screen.
  useLayoutEffect(() => {
    navigation.setOptions(
      assetHeader({
        navigation,
        asset: assets[activeAsset.id],
        address: activeAsset.address,
        addressUrl: getAddressURL(activeAsset.address, activeAsset.contractAddress, activeAsset.type, activeNetwork[networkId]),
      }));
  }, []);

  useEffect(() => {
    controller.wallet.account.updateTempTx({
      timestamp: Date.now(),
      fromAddress: '',
      toAddress: '',
      amount: '0',
    });
  }, []);


  ///////////////////////
  // Callbacks
  ///////////////////////

  const fetchTxs = () => {
    if (activeAsset.type === AssetType.Constellation) {
      return activeAsset.transactions;
    }
    return controller.wallet.account.getFullETHTxs().sort((a, b) => b.timestamp - a.timestamp);
  };

  const networkId = activeAsset?.type === AssetType.Constellation ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum;

  const onSendClick = () => {
    linkTo('/send');
  }

  ///////////////////////
  // Renders
  ///////////////////////

  return (
    <div className={styles.wrapper}>
      {activeWallet && activeAsset ? (
        <>
          <section className={styles.center}>
            <div className={styles.balance}>
              <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                {formatNumber(balance, 2, 4)}{' '}
              </TextV3.HeaderDisplay>
              <TextV3.Body>
                {assets[activeAsset.id].symbol}
              </TextV3.Body>
            </div>
            <div className={styles.fiatBalance}>
              <TextV3.Body>
                ≈ {getFiatAmount(balance, (balance >= 0.01) ? 2 : 4)}
              </TextV3.Body>
            </div>
            <div className={styles.actions}>
              <ButtonV3
                label={'Send'}
                size={BUTTON_SIZES_ENUM.LARGE}
                type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
                onClick={onSendClick}
              />
            </div>
          </section>
          <TxsPanel
            address={activeAsset.address}
            transactions={fetchTxs()}
          />
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: activeAsset,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default AssetDetail;
