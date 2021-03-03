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
import mockAssets from 'containers/auth/Home/mockData';
import { ellipsis } from 'containers/auth/helpers';

import { Asset } from 'types/asset';
import TxsPanel from './TxsPanel';

import styles from './Asset.scss';
import { formatNumber } from '../helpers';

const AssetDetail = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  return (
    <div className={styles.wrapper}>
      {accounts[activeAccountId] ? (
        <>
          <Header showLogo />
          <section className={styles.account}>
            <AssetSelect
              assetList={mockAssets}
              onChange={(asset: Asset) => console.log('item clicked', asset)}
              tokenName={'DAG'}
              tokenAddress={ellipsis(
                accounts[activeAccountId]!.address['constellation']
              )}
            />
          </section>
          <section className={styles.center}>
            <h3>
              {formatNumber(accounts[activeAccountId].balance)}{' '}
              <small>DAG</small>
            </h3>
            <small>≈ {getFiatAmount(accounts[activeAccountId].balance)}</small>
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
              <Button
                type="button"
                theme="primary"
                variant={styles.button}
                linkTo="/receive"
              >
                Receive
              </Button>
            </div>
          </section>
          <TxsPanel
            address={accounts[activeAccountId].address.constellation}
            transactions={accounts[activeAccountId].transactions}
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
