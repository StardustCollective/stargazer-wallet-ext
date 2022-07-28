import find from 'lodash/find';
import { dag4 } from '@stardust-collective/dag4';
import {
  KeyringNetwork,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
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
} from '../common';

export type StargazerSignatureRequest = {
  content: string;
  metadata: Record<string, any>;
};

// Constants
const LEDGER_URL = '/ledger.html';
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

    return networkName === 'main' ? 1 : 3;
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

    const allWallets = [...vault.wallets.local, ...vault.wallets.ledger];
    const activeWallet = vault?.activeWallet
      ? allWallets.find((wallet: any) => wallet.id === vault.activeWallet.id)
      : null;

    const windowUrl =
      activeWallet.type === KeyringWalletType.LedgerAccountWallet
        ? LEDGER_URL
        : EXTERNAL_URL;
    const windowType =
      activeWallet.type === KeyringWalletType.LedgerAccountWallet
        ? WINDOW_TYPES.normal
        : WINDOW_TYPES.popup;
    const windowSize =
      activeWallet.type === KeyringWalletType.LedgerAccountWallet
        ? { width: 1000, height: 1000 }
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
      if (dag4.keyStore.validateDagAddress(signatureRequest)) {
        [signatureRequest, address] = [address, signatureRequest];
      }
      /* Backwards Compatibility -- */

      if (!dag4.keyStore.validateDagAddress(address)) {
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
        publicKey: '',
      };

      // If the type of account is Ledger send back the public key so the
      // signature can be verified by the requester.
      let accounts: KeyringWalletAccountState[] = activeWallet?.accounts;
      if (
        activeWallet.type === KeyringWalletType.LedgerAccountWallet &&
        accounts &&
        accounts[0]
      ) {
        signatureData.publicKey = accounts[0].publicKey;
      }

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

      if (!dag4.keyStore.validateDagAddress(address)) {
        throw new Error("Bad argument 'address'");
      }

      if (assetAccount.address !== address) {
        throw new Error('The active account is not the requested');
      }

      return this.getPublicKey();
    }

    throw new Error('Unsupported non-proxied method');
  }
}
