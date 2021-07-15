import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircleIcon from '@material-ui/icons/RadioButtonChecked';
import BlankCircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import FullSelect from 'components/FullSelect';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IWalletState from 'state/wallet/types';
import TxsPanel from './TxsPanel';

import styles from './Home.scss';
import { formatNumber } from '../helpers';
import { IDAppState } from 'state/dapp/types';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const dapp: IDAppState = useSelector((state: RootState) => state.dapp);
  const [connected, setConnected] = useState(false);
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleRefresh = async () => {
    await controller.wallet.account.getLatestUpdate();
    controller.wallet.account.watchMemPool();
    controller.stateUpdater();
  };

  const handleOpenBuyDag = () => {
    window.open('https://portal.stargazer.network/buy-dag', '_blank');
  };

  useEffect(() => {
    const { origin } = controller.dapp.getCurrent();
    //console.log('tab: ' + origin, logo, title);
    if (origin && dapp[origin]) {
      setConnected(true);
    }

  }, []);

  return (
    <div className={styles.wrapper}>
      {accounts[activeAccountId] ? (
        <>
          <Header showLogo />
          <section className={styles.account}>
            {Object.keys(accounts).length > 1 ? (
              <FullSelect
                value={activeAccountId}
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

export default Home;
