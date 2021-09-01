import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTotalBalance } from 'hooks/usePrice';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import AssetsPanel from './AssetsPanel';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import homeHeader from 'navigation/headers/home';
import TextV3 from 'components/TextV3';

import styles from './Home.scss';

interface IHome {
  navigation: any,
  route: any,
}

const Home = ({ navigation, route }: IHome) => {
  // const controller = useController();
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
  const [balanceObject, balance] = useTotalBalance();
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions({
      ...homeHeader({ navigation, route, hasMainAccount }),
      title: activeWallet ? activeWallet.label : "",
    });
  }, [activeWallet]);

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
              <section className={styles.center}>
                <div className={styles.price}>
                  <div className={styles.symbol}>
                    <TextV3.Body>
                      {balanceObject.symbol}
                    </TextV3.Body>
                  </div>
                  <div className={styles.balance}>
                    <TextV3.HeaderDisplay dynamic>
                      {balanceObject.balance}
                    </TextV3.HeaderDisplay>
                  </div>
                  <div className={styles.name}>
                  <TextV3.Body>
                    {balanceObject.name}
                  </TextV3.Body>
                  </div>
                </div>
                <div className={styles.bitcoinBalance}>
                  <TextV3.Body>
                    {`≈ ₿${balance}`}
                  </TextV3.Body>
                </div>
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
