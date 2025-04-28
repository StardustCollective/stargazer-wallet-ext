import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import { Header } from '../Bitfi/components';
import ConnectView from './views/connect';
import { CypherockService } from '../../utils/cypherockBridge';
import 'assets/styles/global.scss';

// Strings
// const ROUTES = {
//   SIGN_TRANSACTION: 'signTransaction',
//   SIGN_MESSAGE: 'signMessage',
// };

// const BITFI_ERROR_STRINGS = {
//   INVLAID_DEVICE_ID: 'Invalid device ID',
//   CANNOT_READ_PROPERTIES: 'Cannot read properties of undefined',
//   INVALID_HEX_STRING: 'Invalid hex string',
//   TIMEOUT: 'Timeout Error',
//   BLOCKED: 'USER IS BLOCKING',
//   BUSY: 'USER IS BUSY',
//   REJECTED: 'REJECTED',
//   ERROR_CODE_ZERO: '0',
// };
// const ALERT_MESSAGES_STRINGS = {
//   DEFAULT: 'Error: Please contact support.',
//   TIMEOUT: 'Error: Timeout, please, try again',
//   INVLAID_DEVICE_ID: 'Error: Please input a valid device ID.',
//   REJECTED: 'Error: Request has been rejected by user.',
//   BUSY: 'Error: There is a pending request on device, please, cancel it',
//   BLOCKED: 'Error: "Allow connect" toggle on the device is switched OFF',
// };

// enum ALERT_SEVERITY_STATE {
//   SUCCESS = 'success',
//   ERROR = 'error',
//   WARNING = 'warning',
//   INFO = 'info',
// }

// enum WALLET_STATE_ENUM {
//   LOCKED = 1,
//   FETCHING,
//   FETCHING_PAGE,
//   VIEW_ACCOUNTS,
//   SENDING,
//   SUCCESS,
//   SIGN,
//   BITFI_SIGNIN,
//   MESSAGE_SIGNING,
// }

// enum PAGING_ACTIONS_ENUM {
//   INITIAL = 0,
//   NEXT,
//   PREVIOUS,
// }

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
  // Create a singleton instance of CypherockService
  const [service] = useState<CypherockService>(() => new CypherockService());

  const classes = useStyles();

  const onConnectClick = async () => {
    try {
      console.log('antes connect');
      await service.connect();
      console.log('despues connect');
      const wallets = await service.getWallets();
      console.log('wallets', wallets);
    } catch (exc: any) {
      console.log('error', exc);
    }
  };

  const onSelectWalletClick = async () => {
    try {
      console.log('antes selectWallet');
      const selectedWallet = await service.selectWallet();
      console.log('despues selectWallet', selectedWallet);
      const publicKeys = await service.getWalletAddresses(selectedWallet.id, 137);
      console.log(`${selectedWallet.name} - public keys:`, publicKeys);
    } catch (exc: any) {
      console.log('error', exc);
    }
  };

  function RenderByWalletState() {
    return (
      <>
        <ConnectView
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
