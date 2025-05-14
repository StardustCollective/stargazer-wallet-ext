import React, { useState, useEffect } from 'react';
import type { IWalletItem } from '@cypherock/sdk-app-manager';
import Layout from './components/Layout';
import ConnectView from './views/connect';
import LoadingView from './views/loading';
import WalletsView from './views/wallets';
import GenerateAddressView from './views/generate';
import ConfirmDetailsView from './views/confirm';
import ErrorView from './views/error';
import { CypherockError, CypherockService, ErrorCode } from '../../utils/cypherockBridge';
import 'assets/styles/global.scss';

enum WalletState {
  ConnectDevice = 'connect',
  Connecting = 'connecting',
  Searching = 'searching',
  SelectWallet = 'select-wallet',
  GenerateDagAddress = 'generate-dag-address',
  GeneratingDagAddress = 'generating-dag-address',
  GenerateEthAddress = 'generate-eth-address',
  GeneratingEthAddress = 'generating-eth-address',
  ConfirmDetails = 'confirm-details',
  Confirmed = 'confirmed',
  NoWalletsFound = 'no-wallets-found',
  NoDeviceFound = 'no-device-found',
  GeneralError = 'general-error',
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
  const [wallets, setWallets] = useState<IWalletItem[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<IWalletItem | null>(null);
  const [dagAddress, setDagAddress] = useState<string | null>(null);
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  const cleanUp = () => {
    setWalletState(WalletState.ConnectDevice);
    setWallets([]);
    setSelectedWallet(null);
    setDagAddress(null);
    setEthAddress(null);
    setErrorMessage('');
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

  const onConnect = async () => {
    try {
      setWalletState(WalletState.Connecting);
      await service.connect();
      setWalletState(WalletState.Searching);
      const wallets = await service.getWallets();
      setWallets(wallets);
      setWalletState(WalletState.SelectWallet);
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

  const onEthAddressCancel = async () => {
    try {
      changeState(WalletState.SelectWallet);
      await service.evmAbort();
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const generateDagAddress = async () => {
    try {
      setWalletState(WalletState.GenerateDagAddress);

      const dagPublicKeys = await service.getDagWalletAddresses(
        selectedWallet.id,
        onDagEventHandler
      );

      if (!dagPublicKeys?.addresses?.length) {
        throw new CypherockError('No DAG address found', ErrorCode.UNKNOWN);
      }

      setDagAddress(dagPublicKeys.addresses[0]);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const generateEthAddress = async () => {
    try {
      setWalletState(WalletState.GenerateEthAddress);

      const ethPublicKeys = await service.getEthWalletAddresses(
        selectedWallet.id,
        onEthEventHandler
      );

      if (!ethPublicKeys?.addresses?.length) {
        throw new CypherockError('No EVM address found', ErrorCode.UNKNOWN);
      }

      setEthAddress(ethPublicKeys.addresses[0]);
      setWalletState(WalletState.ConfirmDetails);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const onAddWallet = async () => {
    try {
      // await generateDagAddress();
      console.log('dagAddress', generateDagAddress);

      // if (dagAddress) {
      //   await generateEthAddress();
      // }
      await generateEthAddress();
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const changeState = (state: WalletState) => {
    setWalletState(state);
  };

  const onImportWallet = () => {
    console.log('onImportWallet', { ethAddress });
  };

  function RenderByWalletState() {
    switch (walletState) {
      case WalletState.ConnectDevice:
        return (
          <Layout
            title="Connect device"
            primaryButton={{ label: 'Connect Cypherock', handleClick: onConnect }}
          >
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
            <WalletsView
              wallets={wallets}
              selectedWallet={selectedWallet}
              onSelectWallet={onSelectWallet}
            />
          </Layout>
        );
      case WalletState.GenerateDagAddress:
        return (
          <Layout
            title="Generate address"
            secondaryButton={{
              label: 'Cancel',
              handleClick: () => changeState(WalletState.SelectWallet),
            }}
          >
            <GenerateAddressView text="Tap your card to the Cypherock device to generate your DAG address" />
          </Layout>
        );
      case WalletState.GeneratingDagAddress:
        return (
          <Layout title="Generate address">
            <LoadingView text="Generating your new DAG address..." />
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
            <LoadingView text="Generating your new EVM address..." />
          </Layout>
        );

      case WalletState.ConfirmDetails:
        return (
          <Layout
            title="Confirm details"
            secondaryButton={{
              label: 'Cancel',
              handleClick: cleanUp,
            }}
            primaryButton={{
              label: 'Import wallet',
              handleClick: onImportWallet,
            }}
          >
            <ConfirmDetailsView ethAddress={ethAddress} dagAddress={dagAddress} />
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
            <ErrorView
              title="Stargazer couldn’t detect your Cypherock device."
              description="Make sure your Cypherock device is plugged in, unlocked, and USB permissions are granted."
            />
          </Layout>
        );
      case WalletState.NoWalletsFound:
        return (
          <Layout
            title="Connect device"
            secondaryButton={{
              label: 'Cancel',
              handleClick: () => changeState(WalletState.SelectWallet),
            }}
            primaryButton={{
              label: 'Try again',
              handleClick: onConnect,
            }}
          >
            <ErrorView
              title="No wallets were detected"
              description="Please add a new wallet to your Cypherock device, and try again."
            />
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
  }

  return <RenderByWalletState />;
};

export default CypherockPage;
