import React, { useEffect } from 'react';
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

const AssetDetail = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { activeWallet, activeAsset, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  // const account = accounts[activeAccountId];

  useEffect(() => {
    controller.wallet.account.updateTempTx({
      fromAddress: '',
      toAddress: '',
      amount: 0,
    });
  }, []);

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    // controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  const fetchTxs = () => {
    if (activeAsset.type === AssetType.Constellation) {
      return activeAsset.transactions;
    }
    return controller.wallet.account.getFullETHTxs();
  };

  return (
    <div className={styles.wrapper}>
      {activeWallet ? (
        <>
          <Header backLink="/home" />
          <section className={styles.account}>
            <AssetHeader
              asset={assets[activeAsset.id]}
              address={activeAsset.address}
              addressUrl={getAddressURL(activeAsset.address, activeAsset.type, activeNetwork[activeAsset.type])}
            />
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(activeAsset.balance)}{' '}
              <small>{assets[activeAsset.id].symbol}</small>
            </h3>
            <small>
              ≈ {getFiatAmount(activeAsset.balance)}
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
