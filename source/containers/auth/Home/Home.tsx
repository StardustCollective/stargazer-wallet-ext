import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Header from 'containers/common/Header';
import { useController } from 'hooks/index';
import { useTotalBalance } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import AssetsPanel from './AssetsPanel';
import styles from './Home.scss';

const Home = () => {
  const controller = useController();
  const totalBalance = useTotalBalance();
  const { wallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    // controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  return (
    <div className={styles.wrapper}>
      {wallet ? (
        <>
          <Header showLogo />
          {
            <>
              {/*<section className={styles.wallet}>{wallet.label}</section>*/}
              <section className={styles.center}>
                <h3 style={{paddingBottom: '4px'}}>{totalBalance[0]}</h3>
                <small>{wallet.label}</small>
                {/*<small>{`≈ ₿${totalBalance[1]}`}</small>*/}
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
            [styles.hide]: wallet,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default Home;
