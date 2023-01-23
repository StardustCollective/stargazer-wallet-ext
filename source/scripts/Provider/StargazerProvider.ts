import find from 'lodash/find';
import { dag4 } from '@stardust-collective/dag4';
import {
  KeyringNetwork,
  // KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';
import { Runtime, Windows } from 'webextension-polyfill-ts';

import store from 'state/store';
import { useController } from 'hooks';

import IVaultState, { AssetType, IAssetState } from '../../state/vault/types';
import { IDAppState } from '../../state/dapp/types';

import type { DappProvider } from '../Background/dappRegistry';
import {
  IRpcChainRequestHandler,
  StargazerProxyRequest,
  AvailableMethods,
  EIPRpcError,
  StargazerChain,
} from '../common';

export type StargazerSignatureRequest = {
  content: string;
  metadata: Record<string, any>;
};

export type StargazerTransactionRequest = {
  source: string;
  destination: string;
  amount: number; // In DATUM, 1 DATUM = 0.00000001 DAG
  fee?: number; // In DATUM, 100000000 DATUM = 1 DAG
};

// Constants
const LEDGER_URL = '/ledger.html';
const BITFI_URL = '/bitfi.html';
const EXTERNAL_URL = '/external.html';
const WINDOW_TYPES: Record<string, Windows.CreateType> = {
  popup: 'popup',
  normal: 'normal',
};
export class StargazerProvider implements IRpcChainRequestHandler {
  getNetwork() {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Constellation];
  }

  // TODO: how to handle chain IDs for DAG? Currently mapped to Eth mainnet + Ropsten
  getChainId() {
    const networkName = this.getNetwork();

    return networkName === 'main2' ? 1 : 3;
  }

  getAddress() {
    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && stargazerAsset.address;
  }

  getPublicKey() {
    const { dapp, vault } = store.getState();
    const { whitelist }: IDAppState = dapp;

    const controller = useController();
    const current = controller.dapp.getCurrent();
    const origin = current && current.origin;

    if (!origin) {
      throw new Error('StargazerProvider.getPublicKey: No origin');
    }

    const dappData = whitelist[origin];

    if (!dappData?.accounts?.Constellation) {
      throw new Error('StargazerProvider.getPublicKey: Not whitelisted');
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      throw new Error('StargazerProvider.getPublicKey: No active wallet');
    }

    return dag4.account.keyTrio.publicKey;
  }

  getAccounts(): Array<string> {
    const { dapp, vault } = store.getState();
    const { whitelist }: IDAppState = dapp;

    const controller = useController();
    const current = controller.dapp.getCurrent();
    const origin = current && current.origin;

    if (!origin) {
      return [];
    }

    const dappData = whitelist[origin];

    if (!dappData?.accounts?.Constellation) {
      return [];
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      return dappData.accounts.Constellation;
    }

    const dagAddresses = dappData.accounts.Constellation;
    const activeAddress = find(activeWallet.assets, { id: 'constellation' });

    return [
      activeAddress?.address,
      ...dagAddresses.filter((address) => address !== activeAddress?.address),
    ].filter(Boolean); // if no active address, remove
  }

  getBlockNumber() {
    // TODO
    return 1;
  }

  getGasEstimate() {
    // TODO
    return 0;
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && balances[AssetType.Constellation];
  }

  normalizeSignatureRequest(encodedSignatureRequest: string): string {
    let signatureRequest: StargazerSignatureRequest;
    try {
      signatureRequest = JSON.parse(window.atob(encodedSignatureRequest));
    } catch (e) {
      throw new Error('Unable to decode signatureRequest');
    }

    const test =
      typeof signatureRequest === 'object' &&
      signatureRequest !== null &&
      typeof signatureRequest.content === 'string' &&
      typeof signatureRequest.metadata === 'object' &&
      signatureRequest.metadata !== null;

    if (!test) {
      throw new Error('SignatureRequest does not match spec');
    }

    let parsedMetadata: Record<string, any> = {};
    for (const [key, value] of Object.entries(signatureRequest.metadata)) {
      if (['boolean', 'number', 'string'].includes(typeof value) || value === null) {
        parsedMetadata[key] = value;
      }
    }

    signatureRequest.metadata = parsedMetadata;

    const newEncodedSignatureRequest = window.btoa(JSON.stringify(signatureRequest));

    if (newEncodedSignatureRequest !== encodedSignatureRequest) {
      throw new Error('SignatureRequest does not match spec (unable to re-normalize)');
    }

    return newEncodedSignatureRequest;
  }

  signMessage(msg: string) {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const sig = dag4.keyStore.personalSign(privateKeyHex, msg);

    return sig;
  }

  getAssetByType(type: AssetType) {
    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset.type !== type) {
      stargazerAsset = activeWallet.assets.find((a) => a.type === type);
    }

    return stargazerAsset;
  }

  async handleProxiedRequest(
    _request: StargazerProxyRequest & { type: 'rpc' },
    _dappProvider: DappProvider,
    _port: Runtime.Port
  ) {
    throw new Error('handleProxiedRequest is not available on StargazerProvider');
  }

  async handleNonProxiedRequest(
    request: StargazerProxyRequest & { type: 'rpc' },
    dappProvider: DappProvider,
    port: Runtime.Port
  ) {

    const { vault } = store.getState();
    let windowUrl = EXTERNAL_URL;
    let deviceId = "";
    let bipIndex;
    const allWallets = [...vault.wallets.local, ...vault.wallets.ledger, ...vault.wallets.bitfi];
    const activeWallet = vault?.activeWallet
      ? allWallets.find((wallet: any) => wallet.id === vault.activeWallet.id)
      : null;

    if(activeWallet.type === KeyringWalletType.LedgerAccountWallet){
      windowUrl = LEDGER_URL;
      bipIndex =  activeWallet.bipIndex;
    }else if(activeWallet.type === KeyringWalletType.BitfiAccountWallet){
      windowUrl = BITFI_URL;
      deviceId =  activeWallet.accounts[0].deviceId;
    }
    const windowType =
      activeWallet.type === KeyringWalletType.LedgerAccountWallet ||
      activeWallet.type === KeyringWalletType.BitfiAccountWallet
        ? WINDOW_TYPES.normal
        : WINDOW_TYPES.popup;
    const windowSize =
      activeWallet.type === KeyringWalletType.LedgerAccountWallet||
      activeWallet.type === KeyringWalletType.BitfiAccountWallet
        ? { width: 600, height: 1000 }
        : { width: 372, height: 600 };

    if (request.method === AvailableMethods.dag_chainId) {
      return this.getChainId();
    }

    if (request.method === AvailableMethods.dag_accounts) {
      return this.getAccounts();
    }

    if (request.method === AvailableMethods.dag_getBalance) {
      return this.getBalance();
    }

    if (request.method === AvailableMethods.dag_signMessage) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Constellation
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      // Extension 3.6.0+
      let [address, signatureRequest] = request.params as [string, string];

      if (typeof signatureRequest !== 'string') {
        throw new Error("Bad argument 'signatureRequest'");
      }

      if (typeof address !== 'string') {
        throw new Error("Bad argument 'address'");
      }

      /* -- Backwards Compatibility */
      // Extension pre 3.6.0
      if (dag4.account.validateDagAddress(signatureRequest)) {
        [signatureRequest, address] = [address, signatureRequest];
      }
      /* Backwards Compatibility -- */

      if (!dag4.account.validateDagAddress(address)) {
        throw new Error("Bad argument 'address'");
      }

      if (assetAccount.address !== address) {
        throw new Error('The active account is not the requested');
      }

      const signatureRequestEncoded = this.normalizeSignatureRequest(signatureRequest);

      const signatureData = {
        origin: dappProvider.origin,
        asset: 'DAG',
        signatureRequestEncoded,
        walletId: activeWallet.id,
        walletLabel: activeWallet.label,
        deviceId,
        bipIndex,
      };

      const signatureEvent = await dappProvider.createPopupAndWaitForEvent(
        port,
        'messageSigned',
        undefined,
        'signMessage',
        signatureData,
        windowType,
        windowUrl,
        windowSize
      );

      if (signatureEvent === null) {
        throw new EIPRpcError('User Rejected Request', 4001);
      }

      if (!signatureEvent.detail.result) {
        throw new EIPRpcError('User Rejected Request', 4001);
      }

      return signatureEvent.detail.signature.hex;
    }

    if (request.method === AvailableMethods.dag_getPublicKey) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Constellation
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      const [address] = request.params as [string];

      if (!dag4.account.validateDagAddress(address)) {
        throw new Error("Bad argument 'address'");
      }

      if (assetAccount.address !== address) {
        throw new Error('The active account is not the requested');
      }

      return this.getPublicKey();
    }

    if (request.method === AvailableMethods.dag_sendTransaction) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Constellation
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      const [txData] = request.params as [StargazerTransactionRequest];

      const txSource = txData?.source;
      const txDestination = txData?.destination;
      const txAmount = txData?.amount;
      const txFee = txData?.fee || 0;

      if (typeof txSource !== 'string') {
        throw new Error("Bad argument 'source'");
      }

      if (typeof txDestination !== 'string') {
        throw new Error("Bad argument 'destination'");
      }

      if (typeof txAmount !== 'number') {
        throw new Error("Bad argument 'amount'");
      }

      if (!!txFee && typeof txFee !== 'number') {
        throw new Error("Bad argument 'fee'");
      }

      if (!dag4.account.validateDagAddress(txSource)) {
        throw new Error("Invalid address 'source'");
      }

      if (!dag4.account.validateDagAddress(txDestination)) {
        throw new Error("Invaid address 'destination'");
      }

      if (txAmount <= 0) {
        throw new Error("'amount' should be greater than 0");
      }

      if (assetAccount.address !== txSource) {
        throw new Error('The active account is invalid');
      }

      const txObject = {
        to: txDestination,
        value: txAmount * 0.00000001, // DATUM to DAG
        fee: txFee * 0.00000001, // DATUM to DAG
        chain: StargazerChain.CONSTELLATION
      };

      const sentTransactionEvent = await dappProvider.createPopupAndWaitForEvent(
        port,
        'transactionSent',
        undefined,
        'sendTransaction',
        txObject,
        windowType,
        windowUrl,
        windowSize
      );

      if (sentTransactionEvent === null) {
        throw new EIPRpcError('User Rejected Request', 4001);
      }

      if (sentTransactionEvent.detail.error) {
        throw new EIPRpcError(sentTransactionEvent.detail.error, 4002);
      }

      if (!sentTransactionEvent.detail.result) {
        throw new EIPRpcError('User Rejected Request', 4001);
      }

      return sentTransactionEvent.detail.result;
    }

    if (request.method === AvailableMethods.dag_getPendingTransaction) {
      const [hash] = request.params as [unknown];

      if (typeof hash !== 'string') {
        throw new Error("Bad argument 'hash' -> not a string");
      }

      if (!ethers.utils.isHexString('0x' + hash, 32)) {
        throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
      }

      try {
        return await dag4.network.getPendingTransaction(hash);
      } catch (e) {
        console.error('dag_getPendingTransaction:', e);
        return null;
      }
    }

    if (request.method === AvailableMethods.dag_getTransaction) {
      const [hash] = request.params as [unknown];

      if (typeof hash !== 'string') {
        throw new Error("Bad argument 'hash' -> not a string");
      }

      if (!ethers.utils.isHexString('0x' + hash, 32)) {
        throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
      }

      try {
        return await dag4.network.getTransaction(hash);
      } catch (e) {
        console.error('dag_getTransaction:', e);
        return null;
      }
    }

    throw new Error('Unsupported non-proxied method');
  }
}
