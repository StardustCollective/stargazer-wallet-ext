/////////////////////////
// Module Imports
/////////////////////////

import React, { FC, useState, useEffect } from 'react';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { makeStyles } from '@material-ui/core/styles'
import { LedgerBridgeUtil } from './utils/ledgerBridge';
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

/////////////////////////
// Styles
/////////////////////////


// import './styles';
import 'assets/styles/global.scss';
import { Color } from '@material-ui/lab/Alert';

/////////////////////////
// Constants
/////////////////////////

// Strings
const LEDGER_ERROR_STRINGS = {
  CONNECTION_CANCELED: 'Cannot read property',
  APP_CLOSED: '6E01',
  PIN_OR_NOT_CONNECTED: 'No USB device found',
}
const ALERT_MESSAGES_STRINGS = {
  DEFAULT: 'Error: Please contact support',
  CONNECTION_CANCELED: 'Connection Canceled: Please connect to unlock wallet with Ledger.',
  OPEN_CONSTELLATION_APP: 'Open App: Please open the Constellation App on your Ledger',
  PIN_OR_CONNECTION: 'Connection or Pin: Ledger device USB is disconnected or is awaiting pin input',
}

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
    minWidth: 400,
    backgroundColor: '#f1f1f1',
  },
});

/////////////////////////
// Page
/////////////////////////

const LedgerPage: FC = () => {

  /////////////////////////
  // Hooks
  /////////////////////////

  const classes = useStyles();
  const [walletState, setWalletState] = useState<WALLET_STATE_ENUM>(WALLET_STATE_ENUM.LOCKED);
  const [accountData, setAccountData] = useState<LedgerAccount[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [selectedAccounts, setSelectedAccounts] = useState<LedgerAccount[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<Color>('success');
  const [accountsLoadProgress, setAccountsLoadProgress] = useState<number>(0);
  const [checkBoxesState, setCheckBoxesState] = useState<boolean[]>([]);
  const [fetchingPage, setFetchingPage] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);


  useEffect(() => {
    console.log(selectedAccounts);
  }, [selectedAccounts])

  useEffect(() => {
    LedgerBridgeUtil.setOnProgressUpdate(onProgressUpdate);
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
    } catch (error: any) {
      console.log(error);
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL){
        setWalletState(WALLET_STATE_ENUM.LOCKED);
      } else {
        setFetchingPage(false);
      }
      showAlert(error);
    }
    setFetchingPage(false);
    setAccountsLoadProgress(0);
  }

  const showAlert = (error: any): void => {
    let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
    let errorSeverity = ALERT_SEVERITY_STATE.ERROR;
    if (error.message.includes(LEDGER_ERROR_STRINGS.CONNECTION_CANCELED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.CONNECTION_CANCELED
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.APP_CLOSED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.OPEN_CONSTELLATION_APP
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.PIN_OR_NOT_CONNECTED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.PIN_OR_CONNECTION
    }
    setAlertSeverity(errorSeverity);
    setAlertMessage(errorMessage);
    setOpenAlert(true);
  }

  /////////////////////////
  // Callbacks
  /////////////////////////

  // Updates the state when the progress is updated.
  const onProgressUpdate = (loadProgress: number) => {
    let progress = loadProgress * 100;
    setAccountsLoadProgress(progress);
  }

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
  }

  // Updates the alert bar state
  const onAlertBarClose = () => {
    setOpenAlert(false);
  }

  const onPreviousClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.PREVIOUS);
  }

  const onNextClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.NEXT);
  }

  const onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (checked) {
      setSelectedAccounts((state) => {
        return [...state, account];
      })
    } else {
      setSelectedAccounts((state) => {
        _.remove(state, { address: account.address })
        return [...state];
      })
    }
    setCheckBoxesState((state: boolean[]) => {
      state[key] = checked;
      return [...state];
    })
  }

  const onImportClick = () => {
    console.log('Import Click');
  }

  const onCancelClick = () => {
    // Close any existing connections
    LedgerBridgeUtil.closeConnection();
    // Reset the progress
    setAccountsLoadProgress(0);
    // Transition to the locked state
    setWalletState(WALLET_STATE_ENUM.LOCKED);
  }

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
    }
    return null;
  }

  return (
    <div id="confirm-page">
      <header>
        <Card className={classes.root}>
          <Header />
          <RenderByWalletState />
        </Card>
      </header>
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