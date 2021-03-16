import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import AssetSelect from 'components/AssetSelect';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import IAssetListState from 'state/assets/types';

import TxsPanel from './TxsPanel';

import styles from './Asset.scss';
import { formatNumber } from '../helpers';

const AssetDetail = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  const handleSelectAsset = (assetId: string) => {
    controller.wallet.account.updateAccountActiveAsset(
      activeAccountId,
      assetId
    );
  };

  return (
    <div className={styles.wrapper}>
      {account ? (
        <>
          <Header backLink="/home" />
          <section className={styles.account}>
            <AssetSelect
              assetList={Object.values(account.assets).map(
                (asset) => assets[asset.id]
              )}
              onChange={(asset) => handleSelectAsset(asset.id)}
              tokenName={assets[account.activeAssetId].name}
              tokenAddress={account.assets[account.activeAssetId].address}
            />
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(account.assets[account.activeAssetId].balance)}{' '}
              <small>{assets[account.activeAssetId].symbol}</small>
            </h3>
            <small>≈ {getFiatAmount(0)}</small>
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
            address={account.assets[account.activeAssetId].address}
            transactions={account.assets[account.activeAssetId].transactions}
          />
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: accounts[activeAccountId],
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default AssetDetail;
