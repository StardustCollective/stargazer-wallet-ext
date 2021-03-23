import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import FullSelect from 'components/FullSelect';
import { useController } from 'hooks/index';
import { useTotalBalance } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import AssetsPanel from './AssetsPanel';
import styles from './Home.scss';
// import { formatNumber } from '../helpers';

const Home = () => {
  const controller = useController();
  const totalBalance = useTotalBalance();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const account = accounts[activeAccountId];

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  return (
    <div className={styles.wrapper}>
      {account && account.activeAssetId ? (
        <>
          <Header showLogo />
          {
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
                  account.label
                )}
              </section>
              <section className={styles.center}>
                <h3>{totalBalance[0]}</h3>
                <small>{`≈ ₿${totalBalance[1]}`}</small>
                <IconButton className={styles.refresh} onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </section>
              <AssetsPanel />
            </>
          }
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: account,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default Home;
