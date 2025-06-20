/* eslint-disable react/no-unstable-nested-components */
import 'assets/styles/global.scss';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { Color } from '@material-ui/lab/Alert';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringAssetType, KeyringNetwork, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';

import { getWalletController } from 'utils/controllersUtils';
import { HardwareWallet } from 'utils/hardware';
import { toDag } from 'utils/number';

import BitfiBridgeUtil from '../../utils/bitfiBridge';

import AccountsView from './views/accounts';
import ConnectView, { ConnectBitfiView } from './views/connect';
import FetchingProgressView from './views/fetchingProgress';
import ImportSuccess from './views/importSuccess';
import MessageSigning from './views/messageSigning';
import SignView from './views/sign';
import { AlertBar, Header } from './components';

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

enum WALLET_STATE_ENUM {
  LOCKED = 1,
  FETCHING,
  FETCHING_PAGE,
  VIEW_ACCOUNTS,
  SENDING,
  SUCCESS,
  SIGN_TRANSACTION,
  BITFI_SIGNIN,
  MESSAGE_SIGNING,
}

enum PAGING_ACTIONS_ENUM {
  INITIAL = 0,
  NEXT,
  PREVIOUS,
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 380,
    minHeight: 570,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
});

const BitfiPage = () => {
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const classes = useStyles();
  const [walletState, setWalletState] = useState<WALLET_STATE_ENUM>(WALLET_STATE_ENUM.LOCKED);
  const [accountData, setAccountData] = useState<LedgerAccount[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [selectedAccounts, setSelectedAccounts] = useState<HardwareWallet[]>([]);
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
    if (location.href.includes('route')) {
      const { route } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

      if (route === ROUTES.SIGN_TRANSACTION) {
        setWalletState(WALLET_STATE_ENUM.SIGN_TRANSACTION);
      } else if (route === ROUTES.SIGN_MESSAGE) {
        setWalletState(WALLET_STATE_ENUM.MESSAGE_SIGNING);
      } else {
        window.close();
      }
    }
  }, []);

  useEffect(() => {
    if (accountData.length) {
      setSelectedAccounts(() => {
        return [
          {
            id: 0,
            type: KeyringWalletType.BitfiAccountWallet,
            accounts: [
              {
                address: accountData[0].address,
                publicKey: accountData[0].publicKey,
                network: KeyringNetwork.Constellation,
                deviceId: deviceId as string,
              },
            ],
            supportedAssets: [KeyringAssetType.DAG],
          },
        ];
      });
    }
  }, [accountData]);

  /////////////////////////
  // Helper
  /////////////////////////

  const getAccountData = async (pagingAction: PAGING_ACTIONS_ENUM) => {
    let accountDataArray: LedgerAccount[];
    // Get Ledger account data

    setFetchingPage(true);

    try {
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        accountDataArray = await BitfiBridgeUtil.getInitialPage();
        setAccountData(accountDataArray);
        setWalletState(WALLET_STATE_ENUM.VIEW_ACCOUNTS);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.NEXT) {
        accountDataArray = await BitfiBridgeUtil.getNextPage();
        setAccountData(accountDataArray);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.PREVIOUS) {
        accountDataArray = await BitfiBridgeUtil.getPreviousPage();
        setAccountData(accountDataArray);
      }
      setStartIndex(BitfiBridgeUtil.startIndex);
    } catch (err: any) {
      console.log('error', err);
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        setWalletState(WALLET_STATE_ENUM.LOCKED);
      } else {
        setFetchingPage(false);
      }
      showAlert(err);
    }
    setFetchingPage(false);
    setAccountsLoadProgress(0);
  };

  const showAlert = (err: string): void => {
    console.log(`Error: ${err}`);
    let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
    const errorSeverity = ALERT_SEVERITY_STATE.ERROR;

    if (err.includes(BITFI_ERROR_STRINGS.INVALID_HEX_STRING)) {
      errorMessage = ALERT_MESSAGES_STRINGS.INVLAID_DEVICE_ID;
    } else if (err.includes(BITFI_ERROR_STRINGS.INVLAID_DEVICE_ID) || err.includes(BITFI_ERROR_STRINGS.CANNOT_READ_PROPERTIES)) {
      errorMessage = ALERT_MESSAGES_STRINGS.INVLAID_DEVICE_ID;
    } else if (err.includes(BITFI_ERROR_STRINGS.REJECTED) || err.includes(BITFI_ERROR_STRINGS.ERROR_CODE_ZERO)) {
      errorMessage = ALERT_MESSAGES_STRINGS.REJECTED;
    } else if (err.includes(BITFI_ERROR_STRINGS.TIMEOUT)) {
      errorMessage = ALERT_MESSAGES_STRINGS.TIMEOUT;
    } else if (err.includes(BITFI_ERROR_STRINGS.BUSY)) {
      errorMessage = ALERT_MESSAGES_STRINGS.BUSY;
    } else if (err.includes(BITFI_ERROR_STRINGS.BLOCKED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.BLOCKED;
    }

    setAlertSeverity(errorSeverity);
    setAlertMessage(errorMessage);
    setOpenAlert(true);
  };

  /////////////////////////
  // Callbacks
  /////////////////////////

  const onConnectError = (err: string) => {
    showAlert(err);
  };

  // Handles the click to the Connect with Ledger Button

  const onConnectClick = async (devId: string) => {
    try {
      // Close any open alerts
      // Request permission to access the ledger device.
      setCode('');
      setWalletState(WALLET_STATE_ENUM.BITFI_SIGNIN);
      setDeviceId(devId);
      await BitfiBridgeUtil.requestPermissions(devId, setMessage, setCode);
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

  const onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (checked) {
      console.log('Key: ');
      console.log(key);
      setSelectedAccounts(state => {
        return [
          ...state,
          {
            deviceIndex: key - 1,
            type: KeyringWalletType.BitfiAccountWallet,
            accounts: [
              {
                address: account.address,
                publicKey: account.publicKey,
                network: KeyringNetwork.Constellation,
                deviceId: deviceId as string,
              },
            ],
            supportedAssets: [KeyringAssetType.DAG],
          },
        ];
      });
      console.log('Selected Accounts: ');
      console.log(selectedAccounts);
    } else {
      setSelectedAccounts(state => {
        _.remove(state, item => item.accounts[0].address === account.address);
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

    setWalletState(WALLET_STATE_ENUM.SUCCESS);
    setFetchingPage(false);
    BitfiBridgeUtil.closeConnection();
  };

  const onSignMessagePress = async (devId: string, payload: string) => {
    const { message: messageRequest } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

    try {
      setWaitingForBitfi(true);
      setCode('');

      await BitfiBridgeUtil.requestPermissions(
        devId,
        msg => {
          setWaitingMessage(msg);
        },
        setCode
      );

      const signature = await BitfiBridgeUtil.signMessage(payload);

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(signature, messageRequest);

      BitfiBridgeUtil.closeConnection();
      window.close();
    } catch (err: any) {
      showAlert(err.message || err.toString());
      setWaitingForBitfi(false);
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(new EIPRpcError(err.message, EIPErrorCodes.Unknown), messageRequest);
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

  const onSignPress = async (devId: string, amount: number, from: string, to: string, fee: string) => {
    const { message: messageRequest } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

    try {
      setWaitingForBitfi(true);
      setCode('');
      await BitfiBridgeUtil.requestPermissions(
        devId,
        msg => {
          setWaitingMessage(msg);
        },
        setCode
      );

      const amountInDag = toDag(amount).toString();
      // TODO-421: Update buildTransaction to support PostTransaction and PostTransactionV2 (remove as any)
      const signedTX = await BitfiBridgeUtil.buildTransaction(amountInDag, from, to, fee);
      const hash = await dag4.account.networkInstance.postTransaction(signedTX);

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(hash, messageRequest);

      setWaitingForBitfi(false);
      setTransactionSigned(true);
      BitfiBridgeUtil.closeConnection();
      window.close();
    } catch (err: any) {
      showAlert(err.message || err.toString());
      setWaitingForBitfi(false);

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(new EIPRpcError(err.message, EIPErrorCodes.Unknown), messageRequest);

      BitfiBridgeUtil.closeConnection();
    }
  };

  const RenderByWalletState = () => {
    if (walletState === WALLET_STATE_ENUM.BITFI_SIGNIN) {
      return <ConnectBitfiView message={message} error={error} code={code} onBack={() => setWalletState(WALLET_STATE_ENUM.LOCKED)} />;
    }
    if (walletState === WALLET_STATE_ENUM.LOCKED) {
      return <ConnectView onConnectClick={onConnectClick} onConnectError={onConnectError} />;
    }
    if (walletState === WALLET_STATE_ENUM.FETCHING) {
      return <FetchingProgressView accountsLoadProgress={accountsLoadProgress} />;
    }
    if (walletState === WALLET_STATE_ENUM.VIEW_ACCOUNTS) {
      return <AccountsView onCancelClick={onCancelClick} onImportClick={onImportClick} onCheckboxChange={onCheckboxChange} accountData={accountData} checkBoxesState={checkBoxesState} fetchingPage={fetchingPage} startIndex={startIndex} />;
    }
    if (walletState === WALLET_STATE_ENUM.SUCCESS) {
      return <ImportSuccess />;
    }
    if (walletState === WALLET_STATE_ENUM.SIGN_TRANSACTION) {
      return <SignView code={code} waiting={waitingForBitfi} onSignPress={onSignPress} transactionSigned={transactionSigned} waitingMessage={waitingMessage} />;
    }
    if (walletState === WALLET_STATE_ENUM.MESSAGE_SIGNING) {
      return <MessageSigning code={code} waitingMessage={waitingMessage} waiting={waitingForBitfi} onSignMessagePress={onSignMessagePress} messageSigned={transactionSigned} />;
    }

    return null;
  };

  if ([WALLET_STATE_ENUM.MESSAGE_SIGNING, WALLET_STATE_ENUM.SIGN_TRANSACTION].includes(walletState)) {
    return (
      <div>
        <Card className={classes.root}>
          <RenderByWalletState />
        </Card>
        <AlertBar openAlert={openAlert} message={alertMessage} severity={alertSeverity} onClose={onAlertBarClose} />
      </div>
    );
  }

  return (
    <div>
      <Card className={classes.root}>
        <Header />
        <RenderByWalletState />
      </Card>
      <AlertBar openAlert={openAlert} message={alertMessage} severity={alertSeverity} onClose={onAlertBarClose} />
    </div>
  );
};

export default BitfiPage;
