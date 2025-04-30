import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import { Header } from '../Bitfi/components';
import ConnectView from './views/connect';
import { CypherockService } from '../../utils/cypherockBridge';
import 'assets/styles/global.scss';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 380,
    height: 570,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
});

const CypherockPage = () => {
  const [service] = useState<CypherockService>(() => new CypherockService());
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [address, setAddress] = useState(null);

  console.log(setSelectedWallet);

  const classes = useStyles();

  const onConnectClick = async () => {
    try {
      await service.connect();
      const wallets = await service.getWallets();
      setWallets(wallets);

      const publicKeys = await service.getWalletAddresses(wallets[1].id, 1);
      setAddress(publicKeys.addresses[0]);
    } catch (exc: any) {
      console.log('error', exc);
    }
  };

  const onSelectWalletClick = async () => {
    try {
      const selectedWallet = await service.selectWallet();
      setSelectedWallet(selectedWallet);
    } catch (exc: any) {
      console.log('error', exc);
    }
  };

  function RenderByWalletState() {
    return (
      <>
        <ConnectView
          wallets={wallets}
          selectedWallet={selectedWallet}
          address={address}
          onConnectClick={onConnectClick}
          onSelectWalletClick={onSelectWalletClick}
        />
      </>
    );
  }

  return (
    <div>
      <Card className={classes.root}>
        <Header />
        <RenderByWalletState />
      </Card>
    </div>
  );
};

export default CypherockPage;
