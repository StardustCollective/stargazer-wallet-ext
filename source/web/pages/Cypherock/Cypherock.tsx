import 'assets/styles/global.scss';

import type { IGetPublicKeysResult } from '@cypherock/sdk-app-evm';
import type { IWalletItem } from '@cypherock/sdk-app-manager';
import { KeyringAssetType, KeyringNetwork, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import React, { useEffect, useState } from 'react';

import { BUTTON_TYPES_ENUM } from 'components/ButtonV3';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';

import { usePlatformAlert } from 'utils/alertUtil';
import { getWalletController } from 'utils/controllersUtils';
import { HardwareWallet } from 'utils/hardware';

import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { addBeforeUnloadListener } from 'web/utils/windowListeners';

import Layout from './components/Layout';
import ConfirmDetailsView from './views/confirm';
import ConnectView from './views/connect';
import DelegatedStakeView from './views/delegated-stake';
import ErrorView from './views/error';
import GenerateAddressView from './views/generate';
import LoadingView from './views/loading';
// import SignTypedMessageView from './views/sign-typed-message';
import SignDataView from './views/sign-data';
import SignMsgView from './views/sign-message';
import SignTransactionView from './views/sign-transaction';
import SuccessView from './views/success';
import TokenLockView from './views/token-lock';
import WalletsView from './views/wallets';
import { encodeArrayToBase64 } from './utils';

export enum WalletState {
  // Connect device
  ConnectDevice = 'connect',
  Connecting = 'connecting',

  // Import wallet
  Searching = 'searching',
  SelectWallet = 'select-wallet',
  GenerateDagAddress = 'generate-dag-address',
  GeneratingDagAddress = 'generating-dag-address',
  GenerateEthAddress = 'generate-eth-address',
  GeneratingEthAddress = 'generating-eth-address',
  ConfirmDetails = 'confirm-details',
  Confirmed = 'confirmed',

  // Transactions
  SignMessage = 'sign-message',
  SignTypedMessage = 'sign-typed-message',
  SignDataMessage = 'sign-data-message',
  SignDagTransaction = 'sign-dag-transaction',
  TokenLock = 'token-lock',
  DelegatedStake = 'delegated-stake',

  // Signed states
  SignedSuccess = 'signed-success',
  SignedError = 'signed-error',

  // Verify
  VerifyTransaction = 'verify-transaction',

  // Errors
  NoWalletsFound = 'no-wallets-found',
  NoDeviceFound = 'no-device-found',
  GeneralError = 'general-error',
}

enum WalletRoute {
  SignMessage = 'signMessage',
  SignDataMessage = 'signData',
  SignTypedMessage = 'signTypedMessage',
  SignDagTransaction = 'signTransaction',
  TokenLock = 'tokenLock',
  DelegatedStake = 'delegatedStake',
}

enum GetPublicKeysEvent {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN_CARD = 3,
  VERIFY = 4,
}

const CypherockPage = () => {
  const [service] = useState<CypherockService>(() => new CypherockService());

  const [walletState, setWalletState] = useState<WalletState>(WalletState.ConnectDevice);
  const [nextRoute, setNextRoute] = useState<WalletState>(null);
  const [wallets, setWallets] = useState<IWalletItem[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<IWalletItem | null>(null);
  const [dagPublicKeys, setDagPublicKeys] = useState<IGetPublicKeysResult | null>(null);
  const [ethPublicKeys, setEthPublicKeys] = useState<IGetPublicKeysResult | null>(null);
  const [walletName, setWalletName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [importLoading, setImportLoading] = useState<boolean>(false);

  const walletController = getWalletController();
  const showAlert = usePlatformAlert();

  useEffect(() => {
    // Add before unload listener to abort any running operation on the Cypherock device
    addBeforeUnloadListener(service);

    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    if (location.href.includes('route')) {
      const { route } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

      if (route === WalletRoute.SignMessage) {
        setNextRoute(WalletState.SignMessage);
      } else if (route === WalletRoute.SignTypedMessage) {
        setNextRoute(WalletState.SignTypedMessage);
      } else if (route === WalletRoute.SignDataMessage) {
        setNextRoute(WalletState.SignDataMessage);
      } else if (route === WalletRoute.SignDagTransaction) {
        setNextRoute(WalletState.SignDagTransaction);
      } else if (route === WalletRoute.TokenLock) {
        setNextRoute(WalletState.TokenLock);
      } else if (route === WalletRoute.DelegatedStake) {
        setNextRoute(WalletState.DelegatedStake);
      }
    }
  }, []);

  const cleanUp = () => {
    setWalletState(WalletState.ConnectDevice);
    setWallets([]);
    setSelectedWallet(null);
    setWalletName('');
    setDagPublicKeys(null);
    setEthPublicKeys(null);
    setImportLoading(false);
    setErrorMessage('');
  };

  const withDelay = async (promise: Promise<any>, minDuration = 2000) => {
    const delay = new Promise(resolve => setTimeout(resolve, minDuration));
    const [result] = await Promise.all([promise, delay]);
    return result;
  };

  const handleError = (err: unknown) => {
    console.error('Cypherock error:', err);

    if (err instanceof CypherockError) {
      const { code, message } = err;

      if (message.includes('aborted')) return;

      const CODE_TO_STATE_MAP = {
        [ErrorCode.WEBUSB_NOT_SUPPORTED]: WalletState.GeneralError,
        [ErrorCode.DEVICE_NOT_CONNECTED]: WalletState.NoDeviceFound,
        [ErrorCode.WALLETS_NOT_FOUND]: WalletState.NoWalletsFound,
        [ErrorCode.UNKNOWN]: WalletState.GeneralError,
      };

      const newWalletState = CODE_TO_STATE_MAP[code];
      setErrorMessage(message);
      setWalletState(newWalletState);
      return;
    }

    setErrorMessage('An unknown error occurred');
    setWalletState(WalletState.GeneralError);
  };

  const handleSuccessResponse = async (result: any, messageRequest: StargazerRequestMessage): Promise<void> => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseResult(result, messageRequest);
  };

  const handleErrorResponse = async (err: unknown, messageRequest: StargazerRequestMessage): Promise<void> => {
    let message = 'An unknown error occurred';
    let code = EIPErrorCodes.Unknown;

    if (err instanceof Error) {
      if (err.message.includes('rejected')) {
        message = 'User Rejected Request';
        code = EIPErrorCodes.Rejected;
      }

      if (err.message.includes('InsufficientBalance')) {
        message = 'Insufficient balance';
        code = EIPErrorCodes.Rejected;
      }
    }

    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(new EIPRpcError(message, code), messageRequest);
  };

  const onConnect = async () => {
    try {
      setWalletState(WalletState.Connecting);
      await withDelay(service.connect());
      if (nextRoute) {
        setWalletState(nextRoute);
      } else {
        setWalletState(WalletState.Searching);
        const allWallets = await withDelay(service.getWallets());
        setWallets(allWallets);
        setWalletState(WalletState.SelectWallet);
      }
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const onCancel = async () => {
    await service.disconnect();
    changeState(WalletState.ConnectDevice);
  };

  const onSelectWallet = (wallet: IWalletItem) => {
    setSelectedWallet(wallet);
    setWalletName(wallet.name);
  };

  const onEthEventHandler = (event: number) => {
    if (event === GetPublicKeysEvent.PASSPHRASE) {
      setWalletState(WalletState.GeneratingEthAddress);
    }
  };

  const onDagEventHandler = (event: number) => {
    if (event === GetPublicKeysEvent.PASSPHRASE) {
      setWalletState(WalletState.GeneratingDagAddress);
    }
  };

  const clearWalletState = () => {
    setDagPublicKeys(null);
    setEthPublicKeys(null);
    setWalletName('');
  };

  const onEthAddressCancel = async () => {
    try {
      clearWalletState();
      changeState(WalletState.SelectWallet);
      await service.evmAbort();
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const onVerifyTransactionCancel = async () => {
    try {
      setWalletState(WalletState.ConnectDevice);
      await service.abortOperation();
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const onDagAddressCancel = async () => {
    try {
      clearWalletState();
      changeState(WalletState.SelectWallet);
      await service.constellationAbort();
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const generateDagAddress = async () => {
    try {
      setWalletState(WalletState.GenerateDagAddress);

      const publicKeys = await service.getDagWalletAddresses(selectedWallet.id, onDagEventHandler);

      if (!publicKeys?.addresses?.length) {
        throw new CypherockError('No DAG address found', ErrorCode.UNKNOWN);
      }

      setDagPublicKeys(publicKeys);

      return publicKeys;
    } catch (err: unknown) {
      handleError(err);
      return null;
    }
  };

  const generateEthAddress = async () => {
    try {
      setWalletState(WalletState.GenerateEthAddress);

      const publicKeys = await service.getEthWalletAddresses(selectedWallet.id, onEthEventHandler);

      if (!publicKeys?.addresses?.length) {
        throw new CypherockError('No EVM address found', ErrorCode.UNKNOWN);
      }

      setEthPublicKeys(publicKeys);
      setWalletState(WalletState.ConfirmDetails);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const onAddWallet = async () => {
    try {
      const publicKeys = await generateDagAddress();

      if (publicKeys?.addresses?.length) {
        await generateEthAddress();
      }
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const changeState = (state: WalletState) => {
    setWalletState(state);
  };

  const onImportWallet = async () => {
    setImportLoading(true);

    const newWallet: HardwareWallet[] = [
      {
        label: walletName,
        cypherockId: encodeArrayToBase64(selectedWallet.id),
        type: KeyringWalletType.CypherockAccountWallet,
        accounts: [
          {
            address: dagPublicKeys?.addresses[0],
            publicKey: dagPublicKeys?.publicKeys[0],
            network: KeyringNetwork.Constellation,
          },
          {
            address: ethPublicKeys?.addresses[0],
            publicKey: ethPublicKeys?.publicKeys[0],
            network: KeyringNetwork.Ethereum,
          },
        ],
        supportedAssets: [KeyringAssetType.DAG, KeyringAssetType.ETH, KeyringAssetType.ERC20],
      },
    ];

    try {
      await walletController.importHardwareWalletAccounts(newWallet);
    } catch (err) {
      if (err instanceof Error) {
        const message = err?.message ?? 'Error importing wallets';
        showAlert(message, 'danger');
      } else {
        handleError(err);
      }
      setImportLoading(false);
      return;
    }

    setWalletState(WalletState.Confirmed);
  };

  const RenderByWalletState = () => {
    switch (walletState) {
      case WalletState.ConnectDevice:
        return (
          <Layout title="Connect device" primaryButton={{ label: 'Connect Cypherock', handleClick: onConnect }}>
            <ConnectView />
          </Layout>
        );
      case WalletState.Connecting:
        return (
          <Layout title="Connect device">
            <LoadingView text="Connecting to your Cypherock device..." />
          </Layout>
        );
      case WalletState.Searching:
        return (
          <Layout title="Connect device">
            <LoadingView text="Searching Cypherock for available wallets..." />
          </Layout>
        );
      case WalletState.SelectWallet:
        return (
          <Layout
            title="Select a wallet"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onCancel,
            }}
            primaryButton={{
              label: 'Add wallet',
              handleClick: onAddWallet,
              disabled: !selectedWallet,
            }}
          >
            <WalletsView wallets={wallets} selectedWallet={selectedWallet} onSelectWallet={onSelectWallet} />
          </Layout>
        );
      case WalletState.GenerateDagAddress:
        return (
          <Layout
            title="Generate address"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onDagAddressCancel,
            }}
          >
            <GenerateAddressView text="Tap your card to the Cypherock device to generate your DAG address" />
          </Layout>
        );
      case WalletState.GeneratingDagAddress:
        return (
          <Layout title="Generate address">
            <LoadingView text="Generating your DAG address..." />
          </Layout>
        );
      case WalletState.GenerateEthAddress:
        return (
          <Layout
            title="Generate address"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onEthAddressCancel,
            }}
          >
            <GenerateAddressView text="Tap your card to the Cypherock device to generate your EVM address" />
          </Layout>
        );
      case WalletState.GeneratingEthAddress:
        return (
          <Layout title="Generate address">
            <LoadingView text="Generating your EVM address..." />
          </Layout>
        );
      case WalletState.ConfirmDetails:
        return (
          <Layout
            title="Confirm details"
            secondaryButton={{
              label: 'Cancel',
              handleClick: () => {
                cleanUp();
                onCancel();
              },
            }}
            primaryButton={{
              label: 'Import wallet',
              loading: importLoading,
              handleClick: onImportWallet,
            }}
          >
            <ConfirmDetailsView ethPublicKeys={ethPublicKeys} dagPublicKeys={dagPublicKeys} walletName={walletName} setWalletName={setWalletName} />
          </Layout>
        );
      case WalletState.Confirmed:
        return (
          <Layout
            title="Confirmed"
            primaryButton={{
              type: BUTTON_TYPES_ENUM.PRIMARY_OUTLINE,
              label: 'Close window',
              handleClick: () => window.close(),
            }}
          >
            <SuccessView text="Your Cypherock wallet was successfully imported!" />
          </Layout>
        );
      case WalletState.SignedSuccess:
        return (
          <Layout
            title="Signed Successfully"
            primaryButton={{
              type: BUTTON_TYPES_ENUM.PRIMARY_OUTLINE,
              label: 'Close window',
              handleClick: () => window.close(),
            }}
          >
            <SuccessView text="Your signing request was completed successfully." />
          </Layout>
        );
      case WalletState.SignedError:
        return (
          <Layout
            title="Signature Failed"
            secondaryButton={{
              label: 'Close window',
              handleClick: () => window.close(),
            }}
          >
            <ErrorView title="Signing was unsuccessful" description="Something went wrong during the signing process. Please try again." />
          </Layout>
        );
      case WalletState.SignMessage:
        return <SignMsgView service={service} changeState={changeState} handleSuccessResponse={handleSuccessResponse} handleErrorResponse={handleErrorResponse} />;
      case WalletState.SignDagTransaction:
        return <SignTransactionView service={service} changeState={changeState} handleSuccessResponse={handleSuccessResponse} handleErrorResponse={handleErrorResponse} />;
      case WalletState.SignDataMessage:
        return <SignDataView service={service} changeState={changeState} handleSuccessResponse={handleSuccessResponse} handleErrorResponse={handleErrorResponse} />;
      case WalletState.TokenLock:
        return <TokenLockView service={service} changeState={changeState} handleSuccessResponse={handleSuccessResponse} handleErrorResponse={handleErrorResponse} />;
      case WalletState.DelegatedStake:
        return <DelegatedStakeView service={service} changeState={changeState} handleSuccessResponse={handleSuccessResponse} handleErrorResponse={handleErrorResponse} />;
      case WalletState.VerifyTransaction:
        return (
          <Layout
            title="Verify transaction"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onVerifyTransactionCancel,
            }}
          >
            <GenerateAddressView text="Verify the transaction and tap your card to the Cypherock device to confirm" />
          </Layout>
        );
      case WalletState.NoDeviceFound:
        return (
          <Layout
            title="Connect device"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onCancel,
            }}
            primaryButton={{
              label: 'Try again',
              handleClick: onConnect,
            }}
          >
            <ErrorView title="Stargazer couldn’t detect your Cypherock device." description="Make sure your Cypherock device is plugged in, unlocked, and USB permissions are granted." />
          </Layout>
        );
      case WalletState.NoWalletsFound:
        return (
          <Layout
            title="Connect device"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onCancel,
            }}
            primaryButton={{
              label: 'Try again',
              handleClick: onConnect,
            }}
          >
            <ErrorView title="No wallets were detected" description="Please add a new wallet to your Cypherock device, and try again." />
          </Layout>
        );
      case WalletState.GeneralError:
        return (
          <Layout
            title="Error detected"
            secondaryButton={{
              label: 'Cancel',
              handleClick: onCancel,
            }}
          >
            <ErrorView title="There was an error" description={errorMessage} />
          </Layout>
        );

      default:
        return null;
    }
  };

  return RenderByWalletState();
};

export default CypherockPage;
