/////////////////////////
// Module Imports
/////////////////////////

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { makeStyles } from '@material-ui/core/styles';
import BitfiBridgeUtil from '../../utils/bitfiBridge';
import queryString from 'query-string';
import _ from 'lodash';

/////////////////////////
// Component Imports
/////////////////////////

import Card from '@material-ui/core/Card';
import { Header, AlertBar } from './components';

/////////////////////////
// View Imports
/////////////////////////

import ConnectView, { ConnectBitfiView } from './views/connect';
import FetchingProgressView from './views/fetchingProgress';
import AccountsView from './views/accounts';
import SignView from './views/sign';
import ImportSuccess from './views/importSuccess';
import MessageSigning from './views/messageSigning';

/////////////////////////
// Styles
/////////////////////////

import 'assets/styles/global.scss';
import { Color } from '@material-ui/lab/Alert';
import { dag4 } from '@stardust-collective/dag4';

/////////////////////////
// Types
/////////////////////////

import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';
import { getWalletController } from 'utils/controllersUtils';

/////////////////////////
// Constants
/////////////////////////

// Strings
const ROUTES = {
  SIGN_TRANSACTION: 'signTransaction',
  SIGN_MESSAGE: 'signMessage',
};

const BITFI_ERROR_STRINGS = {
  INVLAID_DEVICE_ID: 'Invalid device ID',
  CANNOT_READ_PROPERTIES: 'Cannot read properties of undefined',
  INVALID_HEX_STRING: 'Invalid hex string',
  TIMEOUT: 'Timeout Error',
  BLOCKED: 'USER IS BLOCKING',
  BUSY: 'USER IS BUSY',
  REJECTED: 'REJECTED',
  ERROR_CODE_ZERO: '0',
};
const ALERT_MESSAGES_STRINGS = {
  DEFAULT: 'Error: Please contact support.',
  TIMEOUT: 'Error: Timeout, please, try again',
  INVLAID_DEVICE_ID: 'Error: Please input a valid device ID.',
  REJECTED: 'Error: Request has been rejected by user.',
  BUSY: 'Error: There is a pending request on device, please, cancel it',
  BLOCKED: 'Error: "Allow connect" toggle on the device is switched OFF',
};

// States
enum ALERT_SEVERITY_STATE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/////////////////////////
// ENUMS
/////////////////////////

enum WALLET_STATE_ENUM {
  LOCKED = 1,
  FETCHING,
  FETCHING_PAGE,
  VIEW_ACCOUNTS,
  SENDING,
  SUCCESS,
  SIGN,
  BITFI_SIGNIN,
  MESSAGE_SIGNING,
}

enum PAGING_ACTIONS_ENUM {
  INITIAL = 0,
  NEXT,
  PREVIOUS,
}

/////////////////////////
// Style Hooks
/////////////////////////

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

/////////////////////////
// Page
/////////////////////////

const BitfiPage = () => {
  /////////////////////////
  // Hooks
  /////////////////////////

  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const classes = useStyles();
  const [walletState, setWalletState] = useState<WALLET_STATE_ENUM>(
    WALLET_STATE_ENUM.LOCKED
  );
  const [accountData, setAccountData] = useState<LedgerAccount[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [selectedAccounts, setSelectedAccounts] = useState<LedgerAccount[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<Color>('success');
  const [accountsLoadProgress, setAccountsLoadProgress] = useState<number>(0);
  const [checkBoxesState, setCheckBoxesState] = useState<boolean[]>([]);
  const [fetchingPage, setFetchingPage] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [waitingForBitfi, setWaitingForBitfi] = useState<boolean>(false);
  const [transactionSigned, setTransactionSigned] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string | string[]>('');
  const [waitingMessage, setWaitingMessage] = useState<string>('Waiting For Bitfi');
  const [message, setMessage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [error] = useState<string>('');
  const walletController = getWalletController();

  useEffect(() => {
    if (['main2'].includes(activeNetwork.Constellation)) {
      BitfiBridgeUtil.switchDagNetwork(activeNetwork.Constellation);
    }
  }, [activeNetwork.Constellation]);

  useEffect(() => {
    const { route, deviceId: id } = queryString.parse(location.search);

    if (id) {
      setDeviceId(id);
    }

    if (route === ROUTES.SIGN_TRANSACTION) {
      setWalletState(WALLET_STATE_ENUM.SIGN);
    } else if (route === ROUTES.SIGN_MESSAGE) {
      setWalletState(WALLET_STATE_ENUM.MESSAGE_SIGNING);
    }
  }, []);

  useEffect(() => {
    if (accountData.length) {
      setSelectedAccounts(() => {
        return [
          {
            id: 0,
            type: KeyringWalletType.BitfiAccountWallet,
            publicKey: accountData[0].publicKey,
            address: accountData[0].address,
            balance: '',
          },
        ];
      });
    }
  }, [accountData]);

  /////////////////////////
  // Helper
  /////////////////////////

  const getAccountData = async (pagingAction: PAGING_ACTIONS_ENUM) => {
    let accountData: LedgerAccount[];
    // Get Ledger account data

    setFetchingPage(true);

    try {
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        accountData = await BitfiBridgeUtil.getInitialPage();
        setAccountData(accountData);
        setWalletState(WALLET_STATE_ENUM.VIEW_ACCOUNTS);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.NEXT) {
        accountData = await BitfiBridgeUtil.getNextPage();
        setAccountData(accountData);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.PREVIOUS) {
        accountData = await BitfiBridgeUtil.getPreviousPage();
        setAccountData(accountData);
      }
      setStartIndex(BitfiBridgeUtil.startIndex);
    } catch (error: any) {
      console.log('error', error);
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        setWalletState(WALLET_STATE_ENUM.LOCKED);
      } else {
        setFetchingPage(false);
      }
      showAlert(error);
    }
    setFetchingPage(false);
    setAccountsLoadProgress(0);
  };

  const showAlert = (error: string): void => {
    console.log('Error: ' + error);
    let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
    let errorSeverity = ALERT_SEVERITY_STATE.ERROR;

    if (error.includes(BITFI_ERROR_STRINGS.INVALID_HEX_STRING)) {
      errorMessage = ALERT_MESSAGES_STRINGS.INVLAID_DEVICE_ID;
    } else if (
      error.includes(BITFI_ERROR_STRINGS.INVLAID_DEVICE_ID) ||
      error.includes(BITFI_ERROR_STRINGS.CANNOT_READ_PROPERTIES)
    ) {
      errorMessage = ALERT_MESSAGES_STRINGS.INVLAID_DEVICE_ID;
    } else if (
      error.includes(BITFI_ERROR_STRINGS.REJECTED) ||
      error.includes(BITFI_ERROR_STRINGS.ERROR_CODE_ZERO)
    ) {
      errorMessage = ALERT_MESSAGES_STRINGS.REJECTED;
    } else if (error.includes(BITFI_ERROR_STRINGS.TIMEOUT)) {
      errorMessage = ALERT_MESSAGES_STRINGS.TIMEOUT;
    } else if (error.includes(BITFI_ERROR_STRINGS.BUSY)) {
      errorMessage = ALERT_MESSAGES_STRINGS.BUSY;
    } else if (error.includes(BITFI_ERROR_STRINGS.BLOCKED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.BLOCKED;
    }

    setAlertSeverity(errorSeverity);
    setAlertMessage(errorMessage);
    setOpenAlert(true);
  };

  /////////////////////////
  // Callbacks
  /////////////////////////

  const onConnectError = (error: string) => {
    showAlert(error);
  };

  // Handles the click to the Connect with Ledger Button

  const onConnectClick = async (deviceId: string) => {
    try {
      // Close any open alerts
      // Request permission to access the ledger device.
      setCode('');
      setWalletState(WALLET_STATE_ENUM.BITFI_SIGNIN);
      setDeviceId(deviceId);
      await BitfiBridgeUtil.requestPermissions(deviceId, setMessage, setCode);
      // Get the initial page of the account data
      await getAccountData(PAGING_ACTIONS_ENUM.INITIAL);
    } catch (exc: any) {
      showAlert(exc.message || exc.toString());

      setWalletState(WALLET_STATE_ENUM.LOCKED);
      BitfiBridgeUtil.closeConnection();
    }
  };

  // Updates the alert bar state
  const onAlertBarClose = () => {
    setOpenAlert(false);
  };

  // const onPreviousClick = async () => {
  //   await getAccountData(PAGING_ACTIONS_ENUM.PREVIOUS);
  // }

  // const onNextClick = async () => {
  //   await getAccountData(PAGING_ACTIONS_ENUM.NEXT);
  // }

  const onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (checked) {
      console.log('Key: ');
      console.log(key);
      setSelectedAccounts((state) => {
        return [
          ...state,
          {
            deviceIndex: key - 1,
            type: KeyringWalletType.BitfiAccountWallet,
            publicKey: account.publicKey,
            address: account.address,
            balance: '',
          },
        ];
      });
      console.log('Selected Accounts: ');
      console.log(selectedAccounts);
    } else {
      setSelectedAccounts((state) => {
        _.remove(state, { address: account.address });
        return [...state];
      });
    }
    setCheckBoxesState((state: boolean[]) => {
      state[key] = checked;
      return [...state];
    });
  };

  const onImportClick = async () => {
    setFetchingPage(true);

    await walletController.importHardwareWalletAccounts(
      selectedAccounts as any,
      deviceId as string
    );

    setWalletState(WALLET_STATE_ENUM.SUCCESS);
    setFetchingPage(false);
    BitfiBridgeUtil.closeConnection();
  };

  const onSignMessagePress = async () => {
    const { data } = queryString.parse(location.search) as any;

    const jsonData = JSON.parse(data);
    const message = jsonData.signatureRequestEncoded;

    try {
      setWaitingForBitfi(true);
      setCode('');
      await BitfiBridgeUtil.requestPermissions(
        deviceId as string,
        (message) => {
          setWaitingMessage(message);
        },
        setCode
      );
      const signature = await BitfiBridgeUtil.signMessage(message);
      console.log('signature', signature);
      BitfiBridgeUtil.closeConnection();
      window.close();
    } catch (error: any) {
      showAlert(error.message || error.toString());
      setWaitingForBitfi(false);
      BitfiBridgeUtil.closeConnection();
    }
  };

  const onCancelClick = () => {
    // Close any existing connections
    BitfiBridgeUtil.closeConnection();
    // Reset the progress
    setAccountsLoadProgress(0);
    // Transition to the locked state
    setWalletState(WALLET_STATE_ENUM.LOCKED);
  };

  const onSignPress = async () => {
    const { amount, from, to, fee } = queryString.parse(location.search) as any;

    try {
      setWaitingForBitfi(true);
      setCode('');
      await BitfiBridgeUtil.requestPermissions(
        deviceId as string,
        (message) => {
          setWaitingMessage(message);
        },
        setCode
      );
      // TODO-421: Update buildTransaction to support PostTransaction and PostTransactionV2 (remove as any)
      const signedTX = await BitfiBridgeUtil.buildTransaction(amount, from, to, fee);
      const hash = await dag4.account.networkInstance.postTransaction(signedTX);
      console.log('tx hash', hash);
      setWaitingForBitfi(false);
      setTransactionSigned(true);
      BitfiBridgeUtil.closeConnection();
    } catch (error: any) {
      showAlert(error.message || error.toString());
      setWaitingForBitfi(false);
      BitfiBridgeUtil.closeConnection();
    }
  };

  /////////////////////////
  // Renders
  /////////////////////////

  function RenderByWalletState() {
    if (walletState === WALLET_STATE_ENUM.BITFI_SIGNIN) {
      return (
        <>
          <ConnectBitfiView
            message={message}
            error={error}
            code={code}
            onBack={() => setWalletState(WALLET_STATE_ENUM.LOCKED)}
          />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.LOCKED) {
      return (
        <>
          <ConnectView onConnectClick={onConnectClick} onConnectError={onConnectError} />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.FETCHING) {
      return (
        <>
          <FetchingProgressView accountsLoadProgress={accountsLoadProgress} />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.VIEW_ACCOUNTS) {
      return (
        <>
          <AccountsView
            onCancelClick={onCancelClick}
            onImportClick={onImportClick}
            // onNextClick={onNextClick}
            // onPreviousClick={onPreviousClick}
            onCheckboxChange={onCheckboxChange}
            accountData={accountData}
            checkBoxesState={checkBoxesState}
            fetchingPage={fetchingPage}
            startIndex={startIndex}
          />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.SUCCESS) {
      return (
        <>
          <ImportSuccess />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.SIGN) {
      const { amount, fee, from, to } = queryString.parse(location.search) as any;

      return (
        <>
          <SignView
            code={code}
            amount={amount}
            fee={fee}
            deviceId={deviceId as string}
            fromAddress={from}
            toAddress={to}
            waiting={waitingForBitfi}
            onSignPress={onSignPress}
            transactionSigned={transactionSigned}
            waitingMessage={waitingMessage}
          />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.MESSAGE_SIGNING) {
      const { data } = queryString.parse(location.search) as any;

      const parsedData = JSON.parse(data);
      const message = JSON.parse(atob(parsedData.signatureRequestEncoded));
      const deviceId = parsedData.deviceId;
      setDeviceId(deviceId);

      return (
        <>
          <MessageSigning
            code={code}
            waitingMessage={waitingMessage}
            walletLabel={parsedData.walletLabel}
            deviceId={deviceId}
            message={message}
            waiting={waitingForBitfi}
            onSignMessagePress={onSignMessagePress}
            messageSigned={transactionSigned}
          />
        </>
      );
    }

    return null;
  }

  return (
    <div>
      <Card className={classes.root}>
        <Header />
        <RenderByWalletState />
      </Card>
      <AlertBar
        openAlert={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={onAlertBarClose}
      />
    </div>
  );
};

export default BitfiPage;
