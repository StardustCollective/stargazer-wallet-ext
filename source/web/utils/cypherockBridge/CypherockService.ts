/**
 * Service for interacting with Cypherock hardware wallet
 * @module CypherockService
 */

import {
  ConnectionStatus,
  CypherockError,
  ErrorCode,
  IHardwareWalletAdapter,
  ISignDagMsgParams,
} from './types';
import type {
  EvmApp,
  IGetPublicKeysResult,
  ISignMsgResult,
  ISignPersonalMsgParams,
  ISignTxnParams,
  ISignTxnResult,
  ISignTypedParams,
} from '@cypherock/sdk-app-evm';
import type {
  IWalletItem,
  IGetWalletsResultResponse,
  ISelectWalletResultResponse,
  ManagerApp,
} from '@cypherock/sdk-app-manager';
import * as dag4 from '@stardust-collective/dag4';
import {
  CYPHEROCK_USB_IDS,
  CYPHEROCK_CHAIN_IDS,
  CYPHEROCK_DERIVATION_PATHS,
} from './constants';
import { ConstellationApp } from '@cypherock/sdk-app-constellation';
import type {
  ISignMsgResult as ISignDagMsgResult,
  ISignTxnParams as ISignDagTxnParams,
} from '@cypherock/sdk-app-constellation';

/**
 * Wrapper service for Cypherock SDK with lazy loading
 * @class CypherockService
 * @implements {IHardwareWalletAdapter}
 */
export class CypherockService implements IHardwareWalletAdapter {
  private deviceConnection: any = null; // Type will be set after dynamic import
  private evmApp: any = null; // Type will be set after dynamic import
  private constellationApp: any = null; // Type will be set after dynamic import
  private managerApp: any = null; // Type will be set after dynamic import
  private status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private device: USBDevice | null = null;
  private sdkInitialized = false;

  /**
   * Checks if WebUSB is supported in the current browser
   * @returns {boolean} True if WebUSB is supported
   */
  public static isWebUSBSupported(): boolean {
    return typeof navigator !== 'undefined' && navigator.usb !== undefined;
  }

  /**
   * Initializes the SDK and its dependencies
   * @private
   */
  private async initializeSDK(): Promise<void> {
    if (this.sdkInitialized) return;

    try {
      // Dynamically import all dependencies
      const [
        { DeviceConnection },
        { ManagerApp },
        { EvmApp, setEthersLib, setEip712Lib },
        { ConstellationApp, setDag4Lib },
        { ethers },
        eip712,
      ] = await Promise.all([
        import('@cypherock/sdk-hw-webusb'),
        import('@cypherock/sdk-app-manager'),
        import('@cypherock/sdk-app-evm'),
        import('@cypherock/sdk-app-constellation'),
        import('ethers-v6'),
        import('eip-712'),
      ]);

      // Inject ethers and EIP-712 libs
      setEthersLib(ethers as any);
      setEip712Lib(eip712);

      // Inject dag4.js lib
      setDag4Lib(dag4);

      // Store types for type safety
      this.deviceConnection = DeviceConnection;
      this.managerApp = ManagerApp;
      this.evmApp = EvmApp;
      this.constellationApp = ConstellationApp;
      this.sdkInitialized = true;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to initialize Cypherock SDK');
    }
  }

  /**
   * Checks if WebUSB is supported in the current browser
   * @throws {CypherockError} If WebUSB is not supported
   */
  private checkWebUSBSupport(): void {
    if (!CypherockService.isWebUSBSupported()) {
      throw new CypherockError(
        'WebUSB API is not supported in this browser. Please use Chrome or Edge.',
        ErrorCode.WEBUSB_NOT_SUPPORTED
      );
    }
  }

  /**
   * Requests a Cypherock USB device
   * @returns {Promise<USBDevice>} USB device
   * @throws {CypherockError} If WebUSB is not supported or permission request fails
   */
  public async requestDevice(): Promise<USBDevice> {
    this.checkWebUSBSupport();

    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: CYPHEROCK_USB_IDS.vendorId }],
      });

      return device;
    } catch (error: unknown) {
      throw new CypherockError(
        'Failed to request device',
        ErrorCode.DEVICE_NOT_CONNECTED
      );
    }
  }

  /**
   * Lists available Cypherock devices
   * @returns {Promise<USBDevice[]>} Array of available USB devices
   * @throws {CypherockError} If WebUSB is not supported or permission request fails
   */
  public async listDevices(): Promise<USBDevice[]> {
    this.checkWebUSBSupport();

    try {
      // Get all pairedUSB devices
      const devices = await navigator.usb.getDevices();

      return devices;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to list devices');
    }
  }

  /**
   * Opens the connect device popup and creates a connection to the device
   * @returns {Promise<void>}
   * @throws {CypherockError} If connection fails
   */
  public async connect(): Promise<void> {
    try {
      this.status = ConnectionStatus.CONNECTING;

      // Initialize SDK if not already done
      await this.initializeSDK();

      this.device = await this.requestDevice();

      if (!!this?.deviceConnection?.connect) {
        // Create connection
        this.deviceConnection = await this.deviceConnection.connect(this.device);

        // Create manager app to interact with device
        this.managerApp = await this.managerApp.create(this.deviceConnection);

        // Create EVM app for Ethereum chain operations
        this.evmApp = await this.evmApp.create(this.deviceConnection);

        // Create Constellation app for DAG chain operations
        this.constellationApp = await this.constellationApp.create(this.deviceConnection);
      }

      this.status = ConnectionStatus.CONNECTED;
    } catch (error: unknown) {
      this.status = ConnectionStatus.ERROR;
      throw this.handleError(error, 'Failed to connect to device');
    }
  }

  /**
   * Asks the user to select a wallet from the device
   * @returns {Promise<IWalletItem>} Selected wallet
   * @throws {CypherockError} If not connected or wallet selection fails
   */
  public async selectWallet(): Promise<IWalletItem> {
    try {
      this.ensureConnected();

      const walletResponse: ISelectWalletResultResponse =
        await this.managerApp.selectWallet();

      return walletResponse.wallet;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to select wallet');
    }
  }

  /**
   * Gets all wallets from the device
   * @returns {Promise<IWalletItem[]>} Array of wallets
   * @throws {CypherockError} If not connected or wallet retrieval fails
   */
  public async getWallets(): Promise<IWalletItem[]> {
    try {
      this.ensureConnected();

      const wallets: IGetWalletsResultResponse = await this.managerApp.getWallets();

      if (!wallets?.walletList?.length) {
        throw new CypherockError(
          'No wallets found on the device',
          ErrorCode.WALLETS_NOT_FOUND
        );
      }

      return wallets?.walletList ?? [];
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to get wallets');
    }
  }

  /**
   * Gets the ETH address for a given wallet
   * @param walletId - The ID of the wallet to get the address for
   * @param onEvent - Optional callback function to handle events
   * @returns {Promise<IGetPublicKeysResult>} The ETH address for the given wallet
   * @throws {CypherockError} If not connected or address retrieval fails
   */

  public async getEthWalletAddresses(
    walletId: IWalletItem['id'],
    onEvent?: (event: number) => void
  ): Promise<IGetPublicKeysResult> {
    try {
      this.ensureConnected();

      const publicKeys: IGetPublicKeysResult = await this.evmApp.getPublicKeys({
        walletId,
        derivationPaths: [{ path: CYPHEROCK_DERIVATION_PATHS.ETH_MAINNET }],
        chainId: CYPHEROCK_CHAIN_IDS.ETH_MAINNET,
        onEvent,
      });

      return publicKeys;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to get ETH address');
    }
  }

  /**
   * Gets the DAG address for a given wallet
   * @param walletId - The ID of the wallet to get the address for
   * @param onEvent - Optional callback function to handle events
   * @returns {Promise<IGetPublicKeysResult>} The DAG address for the given wallet
   * @throws {CypherockError} If not connected or address retrieval fails
   */
  public async getDagWalletAddresses(
    walletId: IWalletItem['id'],
    onEvent?: (event: number) => void
  ): Promise<IGetPublicKeysResult> {
    try {
      this.ensureConnected();

      const publicKeys: IGetPublicKeysResult = await this.constellationApp.getPublicKeys({
        walletId,
        derivationPaths: [{ path: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET }],
        onEvent,
      });

      return publicKeys;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to get DAG address');
    }
  }

  /**
   * Signs a message with the Constellation App
   * @param props - The parameters for the sign message operation
   * @returns The result of the sign message operation
   * @throws {CypherockError} If not connected or sign message fails
   */
  public async signDagMessage(props: ISignDagMsgParams): Promise<ISignDagMsgResult> {
    try {
      this.ensureConnected();

      return await (this.constellationApp as ConstellationApp).signMsg(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign DAG message');
    }
  }

  /**
   * Signs a data message with the Constellation App
   * @param props - The parameters for the sign data operation
   * @returns The result of the sign data operation
   * @throws {CypherockError} If not connected or sign data message fails
   */
  public async signDagData(props: ISignDagMsgParams): Promise<ISignDagMsgResult> {
    try {
      this.ensureConnected();

      return await (this.constellationApp as ConstellationApp).signData(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign DAG data');
    }
  }

  /**
   * Signs a transaction with the Constellation App
   * @param props - The parameters for the sign transaction operation
   * @returns The result of the sign transaction operation
   * @throws {CypherockError} If not connected or sign transaction fails
   */
  public async signDagTransaction(props: ISignDagTxnParams): Promise<ISignDagMsgResult> {
    try {
      this.ensureConnected();

      return await (this.constellationApp as ConstellationApp).signTxn(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign the DAG transaction');
    }
  }

  /**
   * Signs a transaction with the EVM App
   * @param props - The parameters for the sign transaction operation
   * @returns The result of the sign transaction operation
   * @throws {CypherockError} If not connected or sign transaction fails
   */
  public async signEVMTransaction(props: ISignTxnParams): Promise<ISignTxnResult> {
    try {
      this.ensureConnected();

      return await (this.evmApp as EvmApp).signTxn(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign the EVM transaction');
    }
  }

  /**
   * Signs a personal message with the EVM App
   * @param props - The parameters for the sign personal message operation
   * @returns The result of the sign personal message operation
   * @throws {CypherockError} If not connected or sign personal message fails
   */
  public async signPersonalMessage(
    props: ISignPersonalMsgParams
  ): Promise<ISignMsgResult> {
    try {
      this.ensureConnected();

      return await (this.evmApp as EvmApp).signPersonalMsg(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign personal message');
    }
  }

  /**
   * Signs a message with the EVM App
   * @param props - The parameters for the sign message operation
   * @returns The result of the sign message operation
   * @throws {CypherockError} If not connected or sign message fails
   */
  public async signEthMessage(props: ISignPersonalMsgParams): Promise<ISignMsgResult> {
    try {
      this.ensureConnected();

      return await (this.evmApp as EvmApp).signEthMsg(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign ETH message');
    }
  }

  /**
   * Signs a typed message with the EVM App
   * @param props - The parameters for the sign typed message operation
   * @returns The result of the sign typed message operation
   * @throws {CypherockError} If not connected or sign typed message fails
   */
  public async signTypedMessage(props: ISignTypedParams): Promise<ISignMsgResult> {
    try {
      this.ensureConnected();

      return await (this.evmApp as EvmApp).signTypedMsg(props);
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to sign typed message');
    }
  }

  /**
   * Disconnects from the current device
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    try {
      this.device = null;
      this.evmApp = null;
      this.constellationApp = null;
      this.managerApp = null;
      this.deviceConnection = null;
      this.sdkInitialized = false;
      this.status = ConnectionStatus.DISCONNECTED;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to disconnect from device');
    }
  }

  /**
   * Gets the current connection status
   * @returns {ConnectionStatus} Current connection status
   */
  public getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Aborts an operation on the EVM app
   * @returns {Promise<void>}
   * @throws {CypherockError} If abort fails
   */
  public async evmAbort(): Promise<void> {
    try {
      if (this.evmApp) {
        await this.evmApp.abort();
      }
    } catch (err: unknown) {
      throw this.handleError(err, 'Failed to abort EVM');
    }
  }

  /**
   * Aborts an operation on the DAG app
   * @returns {Promise<void>}
   * @throws {CypherockError} If abort fails
   */
  public async constellationAbort(): Promise<void> {
    try {
      if (this.constellationApp) {
        await this.constellationApp.abort();
      }
    } catch (err: unknown) {
      throw this.handleError(err, 'Failed to abort Constellation');
    }
  }

  /**
   * Aborts an operation on the Manager app
   * @returns {Promise<void>}
   * @throws {CypherockError} If abort fails
   */
  public async abortOperation(): Promise<void> {
    try {
      if (this.managerApp) {
        await (this.managerApp as ManagerApp).abort();
      }
    } catch (err: unknown) {
      throw this.handleError(err, 'Failed to abort Manager operation');
    }
  }

  /**
   * Ensures the device is connected
   * @private
   * @throws {CypherockError} If not connected
   */
  private ensureConnected(): void {
    if (
      this.status !== ConnectionStatus.CONNECTED ||
      !this.evmApp ||
      !this.constellationApp ||
      !this.managerApp
    ) {
      throw new CypherockError('Device not connected', ErrorCode.DEVICE_NOT_CONNECTED);
    }
  }

  /**
   * Handles errors and converts them to CypherockError
   * @private
   * @param {unknown} error - The original error
   * @param {string} defaultMessage - Default error message
   * @returns {CypherockError} A formatted CypherockError
   */
  private handleError(error: unknown, defaultMessage: string): CypherockError {
    // If it's already a CypherockError, return it
    if (error instanceof CypherockError) {
      return error;
    }

    let message = defaultMessage;

    if (error instanceof Error) {
      message = error.message;
    }

    return new CypherockError(message, ErrorCode.UNKNOWN);
  }
}
