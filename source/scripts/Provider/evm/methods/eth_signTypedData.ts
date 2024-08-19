import {
  EIPErrorCodes,
  EIPRpcError,
  StargazerChain,
  StargazerRequest,
  StargazerRequestMessage,
} from 'scripts/common';
import {
  KeyringNetwork,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';
import { TypedSignatureRequest } from 'scenes/external/TypedSignatureRequest';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainId, getNetworkId, getWalletInfo } from '../utils';

export const eth_signTypedData = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new EIPRpcError('There is no active wallet', EIPErrorCodes.Unauthorized);
  }

  const assetAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Ethereum
  );

  if (!assetAccount) {
    throw new EIPRpcError(
      'No active account for the request asset type',
      EIPErrorCodes.Unauthorized
    );
  }

  // Extension 3.6.0+
  // eslint-disable-next-line prefer-const
  let [address, data] = request.params as [string, Record<string, any>];

  if (typeof address !== 'string') {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new EIPRpcError(
        `Bad argument 'data' => ${String(e)}`,
        EIPErrorCodes.Unauthorized
      );
    }
  }

  if (typeof data !== 'object' || data === null) {
    throw new EIPRpcError("Bad argument 'data'", EIPErrorCodes.Unauthorized);
  }

  if (!ethers.utils.isAddress(address)) {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (assetAccount.address.toLocaleLowerCase() !== address.toLocaleLowerCase()) {
    throw new EIPRpcError(
      'The active account is not the requested',
      EIPErrorCodes.Unauthorized
    );
  }

  if ('EIP712Domain' in data.types) {
    // Ethers does not need EIP712Domain type
    delete data.types.EIP712Domain;
  }

  const activeChainId = getChainId();
  if (
    !!data?.domain?.chainId &&
    activeChainId &&
    parseInt(data.domain.chainId, 10) !== activeChainId
  ) {
    throw new EIPRpcError(
      'chainId does not match the active network chainId',
      EIPErrorCodes.ChainDisconnected
    );
  }

  try {
    ethers.utils._TypedDataEncoder.hash(data.domain, data.types, data.message);
  } catch (e) {
    throw new EIPRpcError(
      `Bad argument 'data' => ${String(e)}`,
      EIPErrorCodes.Unauthorized
    );
  }

  const signatureConsent: TypedSignatureRequest = {
    chain: getNetworkId() as StargazerChain,
    signer: address,
    content: JSON.stringify(data.message),
  };

  const signatureData = {
    origin,
    domain: JSON.stringify(data.domain),
    types: JSON.stringify(data.types),
    signatureConsent,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    publicKey: '',
  };

  // If the type of account is Ledger send back the public key so the
  // signature can be verified by the requester.
  const accounts: KeyringWalletAccountState[] = activeWallet?.accounts;
  if (
    activeWallet?.type === KeyringWalletType.LedgerAccountWallet &&
    accounts &&
    accounts[0]
  ) {
    signatureData.publicKey = accounts[0].publicKey;
  }

  await StargazerExternalPopups.executePopupWithRequestMessage(
    signatureData,
    message,
    sender.origin,
    'signTypedMessage',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
