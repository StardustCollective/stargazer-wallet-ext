import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { ExternalRoute } from 'web/pages/External/types';

import { getChainId, getNetworkId, getWalletInfo, WINDOW_TYPES } from '../utils';

type EIP712Domain = {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
  salt?: string;
};

type TypedProperty = {
  name: string;
  type: string;
};

export type MessagePayload = {
  domain: EIP712Domain;
  types: { EIP712Domain: EIP712Domain } & Record<string, TypedProperty[]>;
  primaryType: string;
  message: any;
};

export interface SignTypedDataParams {
  payload: string;
}

export const eth_signTypedData = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new EIPRpcError('There is no active wallet', EIPErrorCodes.Unauthorized);
  }

  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Ethereum);

  if (!assetAccount) {
    throw new EIPRpcError('No active account for the request asset type', EIPErrorCodes.Unauthorized);
  }

  // Get current chain information
  const chain = getNetworkId() as StargazerChain;

  validateHardwareMethod({ walletType: activeWallet.type, method: request.method });

  // Extension 3.6.0+
  // eslint-disable-next-line prefer-const
  let [address, data] = request.params as [string, Record<string, any>];

  if (typeof address !== 'string') {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (!data) {
    throw new EIPRpcError("Bad argument 'data'", EIPErrorCodes.Unauthorized);
  }

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new EIPRpcError(`Bad argument 'data' => ${String(e)}`, EIPErrorCodes.Unauthorized);
    }
  }

  if (typeof data !== 'object' || data === null) {
    throw new EIPRpcError("Bad argument 'data'", EIPErrorCodes.Unauthorized);
  }

  if (!ethers.utils.isAddress(address)) {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (assetAccount.address.toLocaleLowerCase() !== address.toLocaleLowerCase()) {
    throw new EIPRpcError('The active account is not the requested', EIPErrorCodes.Unauthorized);
  }

  const activeChainId = getChainId();
  if (!!data?.domain?.chainId && activeChainId && parseInt(data.domain.chainId, 10) !== getChainId()) {
    throw new EIPRpcError('chainId does not match the active network chainId', EIPErrorCodes.ChainDisconnected);
  }

  try {
    const eip712types = { ...data.types };
    if ('EIP712Domain' in eip712types) {
      // Ethers does not need EIP712Domain type
      delete eip712types.EIP712Domain;
    }
    ethers.utils._TypedDataEncoder.hash(data.domain, eip712types, data.message);
  } catch (e) {
    throw new EIPRpcError(`Bad argument 'data' => ${String(e)}`, EIPErrorCodes.Unauthorized);
  }

  const signTypedDataParams: SignTypedDataParams = {
    payload: JSON.stringify(data),
  };

  if (windowType === WINDOW_TYPES.popup) {
    windowSize.height = 740;
  }

  await StargazerExternalPopups.executePopup({
    params: {
      data: signTypedDataParams,
      message,
      origin: sender.origin,
      route: ExternalRoute.SignTypedData,
      wallet: {
        chain,
        chainId: activeChainId,
        address,
      },
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  return StargazerWSMessageBroker.NoResponseEmitted;
};
