import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import AssetHeader from './AssetHeader';
import TxsPanel from './TxsPanel';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { formatNumber, getAddressURL } from '../helpers';

import styles from './Asset.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

const AssetDetail = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { activeWallet, activeAsset, activeNetwork, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  const balance = useMemo(() => {
    return Number(balances[activeAsset.id] || 0)
  }, [balances]);

  useEffect(() => {
    controller.wallet.account.updateTempTx({
      fromAddress: '',
      toAddress: '',
      amount: '0',
    });
  }, []);

  const handleRefresh = () => {
    controller.wallet.account.getLatestTxUpdate();
    if (activeAsset.type === AssetType.Constellation) {
      controller.wallet.account.assetsBalanceMonitor.refreshDagBalance();
    }
    controller.stateUpdater();
  };

  const fetchTxs = () => {
    if (activeAsset.type === AssetType.Constellation) {
      return activeAsset.transactions;
    }
    return controller.wallet.account.getFullETHTxs();
  };

  const networkId = activeAsset?.type === AssetType.Constellation ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum;

  return (
    <div className={styles.wrapper}>
      {activeWallet && activeAsset? (
        <>
          <Header backLink="/home" />
          <section className={styles.account}>
            <AssetHeader
              asset={assets[activeAsset.id]}
              address={activeAsset.address}
              addressUrl={getAddressURL(activeAsset.address, activeAsset.contractAddress, activeAsset.type, activeNetwork[networkId])}
            />
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(balance, 2, 4)}{' '}
              <small>{assets[activeAsset.id].symbol}</small>
            </h3>
            <small>
              ≈ {getFiatAmount(balance, (balance >= 0.01) ? 2 : 4)}
            </small>
            <IconButton className={styles.refresh} onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
            <div className={styles.actions}>
              <Button
                type="button"
                theme="primary"
                variant={styles.button}
                linkTo="/send"
              >
                Send
              </Button>
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
