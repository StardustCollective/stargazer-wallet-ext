import React, { useLayoutEffect } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useController } from 'hooks/index';
import { useTotalBalance } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import AssetsPanel from './AssetsPanel';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import homeHeader from 'navigation/headers/home';

import styles from './Home.scss';

interface IHome {
  navigation: any,
  route: any,
}

const Home = ({ navigation, route }: IHome) => {
  const controller = useController();
  const { wallets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const hasMainAccount =
    wallets.length &&
    wallets.some((w) => w.type === KeyringWalletType.MultiChainWallet);

  // const getFiatAmount = useFiat();
  // const dapp: IDAppState = useSelector((state: RootState) => state.dapp);
  // const [connected, setConnected] = useState(false);
  // const { accounts, activeAccountId }: IWalletState = useSelector(
  //   (state: RootState) => state.wallet
  const totalBalance = useTotalBalance();
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  
  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions(homeHeader({navigation, route, hasMainAccount}));
  }, []);

  const handleRefresh = () => {
    controller.wallet.account.assetsBalanceMonitor.refreshDagBalance();
    controller.stateUpdater();
  };

  // const handleOpenBuyDag = () => {
  //   window.open('https://portal.stargazer.network/buy-dag', '_blank');
  // };

  // useEffect(() => {
  //   const { origin } = controller.dapp.getCurrent();
  //   //console.log('tab: ' + origin, logo, title);
  //   if (origin && dapp[origin]) {
  //     setConnected(true);
  //   }
  //
  // }, []);

  return (
    <div className={styles.wrapper}>
      {activeWallet ? (
        <>
          {
            <>
              <section className={styles.account}>
                {/*<div*/}
                {/*  className={clsx(styles.status, { [styles.connected]: connected })}*/}
                {/*>*/}
                {/*  {connected ? (*/}
                {/*    <CircleIcon fontSize="small" />*/}
                {/*  ) : (*/}
                {/*    <BlankCircleIcon fontSize="small" />*/}
                {/*  )}*/}
                {/*  {connected ? 'Connected' : 'Not connected'}*/}
                {/*</div>*/}
                {activeWallet.label}
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
            [styles.hide]: activeWallet,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default Home;
