/////////////////////////
// Module Imports
/////////////////////////

import React, { useState, useEffect } from 'react';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { makeStyles } from '@material-ui/core/styles';
import { LedgerBridgeUtil } from '../../utils/ledgerBridge';
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

import ConnectView from './views/connect';
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
import { decodeFromBase64 } from 'utils/encoding';
import { getWalletController } from 'utils/controllersUtils';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';

/////////////////////////
// Constants
/////////////////////////

// Strings
const ROUTES = {
  SIGN_TRANSACTION: 'signTransaction',
  SIGN_MESSAGE: 'signMessage',
};

const LEDGER_ERROR_STRINGS = {
  CONNECTION_CANCELED: 'Cannot read property',
  APP_CLOSED: '6E01',
  PIN_OR_NOT_CONNECTED: 'No USB device found',
};
const ALERT_MESSAGES_STRINGS = {
  DEFAULT: 'Error: Please contact support',
  CONNECTION_CANCELED:
    'Connection Canceled: Please connect to unlock wallet with Ledger.',
  OPEN_CONSTELLATION_APP: 'Open App: Please open the Constellation App on your Ledger',
  PIN_OR_CONNECTION:
    'Connection or Pin: Ledger device USB is disconnected or is awaiting pin input',
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

const LedgerPage = () => {
  /////////////////////////
  // Hooks
  /////////////////////////

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
  const [waitingForLedger, setWaitingForLedger] = useState<boolean>(false);
  const [transactionSigned, setTransactionSigned] = useState<boolean>(false);
  const walletController = getWalletController();

  useEffect(() => {
    LedgerBridgeUtil.setOnProgressUpdate(onProgressUpdate);
  }, []);

  useEffect(() => {
    const { route } = queryString.parse(location.search);

    if (route === ROUTES.SIGN_TRANSACTION) {
      setWalletState(WALLET_STATE_ENUM.SIGN);
    } else if (route === ROUTES.SIGN_MESSAGE) {
      setWalletState(WALLET_STATE_ENUM.MESSAGE_SIGNING);
    }
  }, []);

  /////////////////////////
  // Helper
  /////////////////////////

  const getAccountData = async (pagingAction: PAGING_ACTIONS_ENUM) => {
    let accountData: LedgerAccount[];
    // Get Ledger account data

    setFetchingPage(true);

    try {
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        accountData = await LedgerBridgeUtil.getInitialPage();
        setAccountData(accountData);
        setWalletState(WALLET_STATE_ENUM.VIEW_ACCOUNTS);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.NEXT) {
        accountData = await LedgerBridgeUtil.getNextPage();
        setAccountData(accountData);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.PREVIOUS) {
        accountData = await LedgerBridgeUtil.getPreviousPage();
        setAccountData(accountData);
      }
      setStartIndex(LedgerBridgeUtil.startIndex);
    } catch (error) {
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

  const showAlert = (error: any): void => {
    let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
    let errorSeverity = ALERT_SEVERITY_STATE.ERROR;
    if (error.message.includes(LEDGER_ERROR_STRINGS.CONNECTION_CANCELED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.CONNECTION_CANCELED;
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.APP_CLOSED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.OPEN_CONSTELLATION_APP;
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.PIN_OR_NOT_CONNECTED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.PIN_OR_CONNECTION;
    }
    setAlertSeverity(errorSeverity);
    setAlertMessage(errorMessage);
    setOpenAlert(true);
  };

  /////////////////////////
  // Callbacks
  /////////////////////////

  // Updates the state when the progress is updated.
  const onProgressUpdate = (loadProgress: number) => {
    let progress = loadProgress * 100;
    setAccountsLoadProgress(progress);
  };

  // Handles the click to the Connect with Ledger Button
  const onConnectClick = async () => {
    // Close any open alerts
    setOpenAlert(false);

    // Request permission to access the ledger device.
    await LedgerBridgeUtil.requestPermissions();

    // Update the view state to fetching accounts
    setWalletState(WALLET_STATE_ENUM.FETCHING);

    // Get the initial page of the account data
    await getAccountData(PAGING_ACTIONS_ENUM.INITIAL);
  };

  // Updates the alert bar state
  const onAlertBarClose = () => {
    setOpenAlert(false);
  };

  const onPreviousClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.PREVIOUS);
  };

  const onNextClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.NEXT);
  };

  const onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (checked) {
      setSelectedAccounts((state) => {
        return [
          ...state,
          {
            bipIndex: key - 1,
            type: KeyringWalletType.LedgerAccountWallet,
            publicKey: account.publicKey,
            address: account.address,
            balance: '',
          },
        ];
      });
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
    await walletController.importHardwareWalletAccounts(selectedAccounts as any);
    console.log(selectedAccounts);
    setWalletState(WALLET_STATE_ENUM.SUCCESS);
    setFetchingPage(false);
    LedgerBridgeUtil.closeConnection();
  };

  const onCancelClick = () => {
    // Close any existing connections
    LedgerBridgeUtil.closeConnection();
    // Reset the progress
    setAccountsLoadProgress(0);
    // Transition to the locked state
    setWalletState(WALLET_STATE_ENUM.LOCKED);
  };

  const onSignPress = async () => {
    const { data, message: requestMessage } =
      StargazerExternalPopups.decodeRequestMessageLocationParams<{
        amount: string;
        publicKey: string;
        from: string;
        to: string;
        bipIndex: string;
      }>(location.href);

    const { amount, publicKey, from, to, bipIndex } = data;

    try {
      setWaitingForLedger(true);
      await LedgerBridgeUtil.requestPermissions();
      // TODO-421: Update buildTransaction to support PostTransaction and PostTransactionV2
      const signedTX = await LedgerBridgeUtil.buildTransaction(
        Number(amount),
        publicKey,
        Number(bipIndex),
        from,
        to
      );
      const hash = await dag4.network.postTransaction(signedTX);
      if (hash) {
        StargazerWSMessageBroker.sendResponseResult(hash, requestMessage);
      }
      setWaitingForLedger(false);
      setTransactionSigned(true);
      LedgerBridgeUtil.closeConnection();
    } catch (e) {
      console.log('error', JSON.stringify(e, null, 2));
      setWaitingForLedger(false);
      LedgerBridgeUtil.closeConnection();
    }
  };

  const onSignMessagePress = async () => {
    const { data, message: requestMessage } =
      StargazerExternalPopups.decodeRequestMessageLocationParams<{
        signatureRequestEncoded: string;
        asset: string;
        provider: string;
        chainLabel: string;
        walletLabel: string;
        bipIndex: string;
      }>(location.href);

    const message = data.signatureRequestEncoded;
    const bipIndex = Number(data.bipIndex);

    try {
      setWaitingForLedger(true);
      await LedgerBridgeUtil.requestPermissions();
      const signature = await LedgerBridgeUtil.signMessage(message, bipIndex);
      LedgerBridgeUtil.closeConnection();

      StargazerWSMessageBroker.sendResponseResult(signature, requestMessage);
      window.close();
    } catch (e) {
      setWaitingForLedger(false);
      LedgerBridgeUtil.closeConnection();
    }
  };

  /////////////////////////
  // Renders
  /////////////////////////

  function RenderByWalletState() {
    if (walletState === WALLET_STATE_ENUM.LOCKED) {
      return (
        <>
          <ConnectView onConnectClick={onConnectClick} />
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
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
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
            amount={amount}
            fee={fee}
            fromAddress={from}
            toAddress={to}
            waiting={waitingForLedger}
            onSignPress={onSignPress}
            transactionSigned={transactionSigned}
          />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.MESSAGE_SIGNING) {
      const { data } = queryString.parse(location.search) as any;

      const parsedData = JSON.parse(data);
      const message = JSON.parse(decodeFromBase64(parsedData.signatureRequestEncoded));

      return (
        <>
          <MessageSigning
            walletLabel={parsedData.walletLabel}
            message={message}
            waiting={waitingForLedger}
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

export default LedgerPage;
