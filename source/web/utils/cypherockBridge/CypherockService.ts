/**
 * Service for interacting with Cypherock hardware wallet
 * @module CypherockService
 */

import { ConnectionStatus, CypherockError, IHardwareWalletAdapter } from './types';
import type { IGetPublicKeysResult } from '@cypherock/sdk-app-evm';
import type {
  IWalletItem,
  IGetWalletsResultResponse,
  ISelectWalletResultResponse,
} from '@cypherock/sdk-app-manager';

/**
 * Cypherock device USB identifiers
 */
export const CYPHEROCK_USB_IDS = {
  vendorId: 0x3503,
  productId: 0x0103,
};

/**
 * Wrapper service for Cypherock SDK with lazy loading
 * @class CypherockService
 * @implements {IHardwareWalletAdapter}
 */
export class CypherockService implements IHardwareWalletAdapter {
  private deviceConnection: any = null; // Type will be set after dynamic import
  private evmApp: any = null; // Type will be set after dynamic import
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
        { ethers },
        eip712,
      ] = await Promise.all([
        import('@cypherock/sdk-hw-webusb'),
        import('@cypherock/sdk-app-manager'),
        import('@cypherock/sdk-app-evm'),
        import('ethers-v6'),
        import('eip-712'),
      ]);

      // Inject ethers and EIP-712 libs
      setEthersLib(ethers as any);
      setEip712Lib(eip712);

      // Store types for type safety
      this.deviceConnection = DeviceConnection;
      this.managerApp = ManagerApp;
      this.evmApp = EvmApp;

      this.sdkInitialized = true;
    } catch (error) {
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
        'WEBUSB_NOT_SUPPORTED'
      );
    }
  }

  /**
   * Requests a Cypherock USB device
   * @returns {Promise<USBDevice>} USB device
   * @throws {CypherockError} If WebUSB is not supported or permission request fails
   */
  public async requestDevice(): Promise<USBDevice> {
    try {
      this.checkWebUSBSupport();

      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: CYPHEROCK_USB_IDS.vendorId }],
      });

      console.log('requestDevice - device', device);

      return device;
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to request device');
    }
  }

  /**
   * Lists available Cypherock devices
   * @returns {Promise<USBDevice[]>} Array of available USB devices
   * @throws {CypherockError} If WebUSB is not supported or permission request fails
   */
  public async listDevices(): Promise<USBDevice[]> {
    try {
      this.checkWebUSBSupport();

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

      // Create connection
      this.deviceConnection = await this.deviceConnection.connect(this.device);

      // Create manager app to interact with device
      this.managerApp = await this.managerApp.create(this.deviceConnection);

      // Create EVM app for Ethereum chain operations
      this.evmApp = await this.evmApp.create(this.deviceConnection);

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
      console.log('selectWallet - error', error);
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

      return wallets?.walletList ?? [];
    } catch (error: unknown) {
      throw this.handleError(error, 'Failed to get wallets');
    }
  }

  public async getWalletAddresses(
    walletId: IWalletItem['id'],
    chainId: number
  ): Promise<IGetPublicKeysResult> {
    try {
      this.ensureConnected();

      console.log('getWalletAddresses - getPublicKeys', chainId);

      const publicKeys: IGetPublicKeysResult = await this.evmApp.getPublicKeys({
        walletId,
        // derivationPaths: [{ path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0] }],
        derivationPaths: [{ path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0] }],
        chainId,
      });

      return publicKeys;
    } catch (error: unknown) {
      console.log('getWalletAddresses - error', error);
      throw this.handleError(error, 'Failed to get wallet addresses');
    }
  }

  /**
   * Disconnects from the current device
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.evmApp) {
        await this.evmApp.destroy();
        this.evmApp = null;
      }

      if (this.managerApp) {
        await this.managerApp.destroy();
        this.managerApp = null;
      }

      if (this.deviceConnection) {
        await this.deviceConnection.destroy();
        this.deviceConnection = null;
      }

      this.device = null;
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
   * Ensures the device is connected
   * @private
   * @throws {CypherockError} If not connected
   */
  private ensureConnected(): void {
    if (this.status !== ConnectionStatus.CONNECTED || !this.evmApp || !this.managerApp) {
      throw new CypherockError('Device not connected', 'NOT_CONNECTED');
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

    // Extract error message and code
    let message = defaultMessage;
    let code = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      message = error.message || message;

      // Try to extract error code from known patterns
      if (error.name === 'TransportError') {
        code = 'TRANSPORT_ERROR';
      } else if (error.name === 'DeviceNotConnectedError') {
        code = 'DEVICE_NOT_CONNECTED';
      } else if (error.message.includes('timeout')) {
        code = 'TIMEOUT_ERROR';
      } else if (error.message.includes('permission')) {
        code = 'PERMISSION_DENIED';
      }
    }

    return new CypherockError(message, code);
  }
}
