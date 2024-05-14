import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { EIPErrorCodes, EIPRpcError, StargazerProxyRequest } from 'scripts/common';
import {
  getChainId,
  getNetworkToken,
  getWalletInfo,
  normalizeSignatureRequest,
} from '../utils';
import {
  KeyringNetwork,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';
import { ALL_EVM_CHAINS } from 'constants/index';

export const personal_sign = async (
  request: StargazerProxyRequest & { type: 'rpc' },
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string[]> => {
  const { activeWallet, windowUrl, windowType, windowSize } = getWalletInfo();

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
  let [data, address] = request.params as [string, string];

  if (typeof data !== 'string') {
    throw new EIPRpcError("Bad argument 'data'", EIPErrorCodes.Unauthorized);
  }

  if (typeof address !== 'string') {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  /* -- Backwards Compatibility */
  // Extension pre 3.6.0
  if (data.length === 42 && address.length !== 42) {
    [data, address] = [address, data];
  }
  /* Backwards Compatibility -- */

  if (!ethers.utils.isAddress(address)) {
    throw new EIPRpcError("Bad argument 'address'", EIPErrorCodes.Unauthorized);
  }

  if (assetAccount.address.toLocaleLowerCase() !== address.toLocaleLowerCase()) {
    throw new EIPRpcError(
      'The active account is not the requested',
      EIPErrorCodes.Unauthorized
    );
  }

  const signatureRequestEncoded = normalizeSignatureRequest(data);

  const chainLabel = Object.values(ALL_EVM_CHAINS).find(
    (chain: any) => chain.chainId === getChainId()
  )?.label;

  const signatureData = {
    origin: dappProvider.origin,
    asset: getNetworkToken(),
    signatureRequestEncoded,
    walletId: activeWallet.id,
    walletLabel: activeWallet.label,
    publicKey: '',
    chainLabel,
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

  const signatureEvent = await dappProvider.createPopupAndWaitForMessage(
    port,
    ExternalMessageID.messageSigned,
    undefined,
    'signMessage',
    signatureData,
    windowType,
    windowUrl,
    windowSize
  );

  if (signatureEvent === null) {
    throw new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected);
  }

  if (!signatureEvent.detail.result) {
    throw new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected);
  }

  return signatureEvent.detail.signature.hex;
};
