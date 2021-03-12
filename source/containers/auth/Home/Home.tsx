import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import FullSelect from 'components/FullSelect';
import AddAsset from 'components/AddAsset';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import AssetsPanel from './AssetsPanel';
import styles from './Home.scss';
import { formatNumber } from '../helpers';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const { accounts, activeAccountId, activeAsset }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  const [showAddAsset, setShowAddAsset] = useState(false);

  return (
    <div className={styles.wrapper}>
      {accounts[activeAccountId] ? (
        <>
          <Header showLogo />
          {showAddAsset ? (
            <>
              <section className={styles.account}>Add Asset</section>
              <AddAsset />
            </>
          ) : (
            <>
              <section className={styles.account}>
                {Object.keys(accounts).length > 1 ? (
                  <FullSelect
                    value={String(activeAccountId)}
                    options={accounts}
                    onChange={async (val: string) => {
                      await controller.wallet.switchWallet(val);
                      controller.wallet.account.watchMemPool();
                    }}
                  />
                ) : (
                  accounts[activeAccountId].label
                )}
              </section>
              <section className={styles.center}>
                <h3>
                  {formatNumber(
                    accounts[activeAccountId].balance[activeAsset.id]
                  )}{' '}
                  <small>DAG</small>
                </h3>
                <small>
                  ≈{' '}
                  {getFiatAmount(
                    accounts[activeAccountId].balance[activeAsset.id]
                  )}
                </small>
                <IconButton className={styles.refresh} onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </section>
              <AssetsPanel setShowAddAsset={() => setShowAddAsset(true)} />
            </>
          )}
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

export default Home;
