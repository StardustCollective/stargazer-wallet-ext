/**
 * Types for the Cypherock hardware wallet integration
 */

import type { ISignMsgParams } from '@cypherock/sdk-app-constellation';
import type { IWalletItem } from '@cypherock/sdk-app-manager';

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

export type ISignDagMsgParams = Omit<ISignMsgParams, 'messageType'>;

/**
 * Status of the Cypherock device connection
 */
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export enum ErrorCode {
  UNKNOWN = 'unknown',
  DEVICE_NOT_CONNECTED = 'device-not-connected',
  WEBUSB_NOT_SUPPORTED = 'webusb-not-supported',
  WALLETS_NOT_FOUND = 'wallets-not-found',
}

/**
 * Custom error type for Cypherock-related errors
 */
export class CypherockError extends Error {
  /** Error code */
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
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
