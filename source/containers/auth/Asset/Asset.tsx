import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import Button from 'components/Button';
import AssetSelect from 'components/AssetSelect';
import TxsPanel from './TxsPanel';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IWalletState, { AssetType } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';
import { formatNumber, getAddressURL } from '../helpers';

import styles from './Asset.scss';

const AssetDetail = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const {
    accounts,
    activeAccountId,
    activeNetwork,
  }: IWalletState = useSelector((state: RootState) => state.wallet);
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];

  console.log(account.activeAssetId);

  useEffect(() => {
    controller.wallet.account.updateTempTx({
      fromAddress: '',
      toAddress: '',
      amount: 0,
    });
  }, []);

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

  const fetchTxs = () => {
    if (account.activeAssetId === AssetType.Constellation)
      return account.assets[account.activeAssetId].transactions;
    return controller.wallet.account.getFullETHTxs();
  };

  return (
    <div className={styles.wrapper}>
      {account ? (
        <>
          <Header backLink="/home" />
          <section className={styles.account}>
            <AssetSelect
              assetList={Object.values(account.assets)
                .filter(
                  (asset) =>
                    assets[asset.id].network === 'both' ||
                    assets[asset.id].network ===
                      activeNetwork[
                        asset.id === AssetType.Constellation
                          ? AssetType.Constellation
                          : AssetType.Ethereum
                      ]
                )
                .map((asset) => assets[asset.id])}
              onChange={(asset) => handleSelectAsset(asset.id)}
              tokenName={assets[account.activeAssetId].name}
              tokenAddress={account.assets[account.activeAssetId].address}
              addressUrl={getAddressURL(
                account.assets[account.activeAssetId].address,
                assets[account.activeAssetId].type,
                activeNetwork[
                  account.activeAssetId === AssetType.Constellation
                    ? AssetType.Constellation
                    : AssetType.Ethereum
                ]
              )}
            />
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(account.assets[account.activeAssetId].balance)}{' '}
              <small>{assets[account.activeAssetId].symbol}</small>
            </h3>
            <small>
              ≈ {getFiatAmount(account.assets[account.activeAssetId].balance)}
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
            address={account.assets[account.activeAssetId].address}
            transactions={fetchTxs()}
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
