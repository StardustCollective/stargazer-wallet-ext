/**
 * Types for the Cypherock hardware wallet integration
 */

import { IWalletItem } from '@cypherock/sdk-app-manager';

/**
 * WebUSB API and USBDevice declaration for TypeScript
 */
declare global {
  interface USBDevice {
    productName?: string;
    manufacturerName?: string;
    vendorId: number;
    productId: number;
    serialNumber?: string;
  }

  interface Navigator {
    usb: {
      getDevices(): Promise<USBDevice[]>;
      requestDevice(options: { filters: { vendorId: number }[] }): Promise<USBDevice>;
    };
  }
}

/**
 * Status of the Cypherock device connection
 */
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

/**
 * Custom error type for Cypherock-related errors
 */
export class CypherockError extends Error {
  /** Error code */
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'CypherockError';
    this.code = code;
  }
}

/**
 * Interface for hardware wallet adapters
 * This allows for future extensions to other hardware wallets
 */
export interface IHardwareWalletAdapter {
  /** List available devices */
  listDevices(): Promise<USBDevice[]>;

  /** Connect to a specific device */
  connect(): Promise<void>;

  /** Disconnect from the current device */
  disconnect(): Promise<void>;

  /** Get wallets from the device */
  getWallets(): Promise<IWalletItem[]>;

  /** Get the connection status */
  getStatus(): ConnectionStatus;
}
