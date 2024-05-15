import find from 'lodash/find';
import { dag4 } from '@stardust-collective/dag4';
import {
  KeyringNetwork,
  // KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import * as ethers from 'ethers';

import store from 'state/store';
import { useController } from 'hooks';

import { BigNumber } from 'bignumber.js';
import { DAG_NETWORK } from 'constants/index';

import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import IVaultState, { AssetType, IAssetState } from '../../state/vault/types';
import { IDAppState } from '../../state/dapp/types';

import {
  IRpcChainRequestHandler,
  StargazerRequest,
  AvailableMethods,
  ProtocolProvider,
  StargazerRequestMessage,
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

export type StargazerMetagraphTransactionRequest = {
  metagraphAddress: string;
  source: string;
  destination: string;
  amount: number; // In DATUM, 1 DATUM = 0.00000001 DAG
  fee?: number; // In DATUM, 100000000 DATUM = 1 DAG
};

export type StargazerMetagraphGetTransactionRequest = {
  metagraphAddress: string;
  hash: string;
};

export type WatchAssetOptions = {
  chainId: number; // The chain ID of the asset. 1 (mainnet), 3 (testnet), 4 (integrationnet)
  address: string; // Metagraph address
  l0: string; // L0 endpoint
  l1: string; // L1 endpoint
  name: string; // Name of the asset
  symbol: string; // Symbol of the asset
  logo: string; // Logo of the token
};

export type WatchAssetParameters = {
  type: string; // The asset's interface, e.g. 'L0'
  options: WatchAssetOptions;
};

// Constants
const LEDGER_URL = '/ledger.html';
const BITFI_URL = '/bitfi.html';
const EXTERNAL_URL = '/external.html';
const WINDOW_TYPES: Record<string, chrome.windows.createTypeEnum> = {
  popup: 'popup',
  normal: 'normal',
};
const DAG_DECIMAL_FACTOR = 1e-8;

export class StargazerProvider implements IRpcChainRequestHandler {
  getNetwork() {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Constellation];
  }

  // TODO: how to handle chain IDs for DAG? Currently mapped to Eth mainnet + Ropsten
  getChainId() {
    const networkName = this.getNetwork();

    return DAG_NETWORK[networkName].chainId;
  }

  getAddress() {
    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && stargazerAsset.address;
  }

  getPublicKey() {
    const { dapp, vault } = store.getState();
    const { whitelist }: IDAppState = dapp;

    const { current } = dapp;
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

    const { current } = dapp;
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

  getBalance(): string {
    const { balances }: IVaultState = store.getState().vault;

    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && balances[AssetType.Constellation];
  }

  getMetagraphBalance(address: string): string {
    const { balances }: IVaultState = store.getState().vault;

    const metagraphAsset: IAssetState = this.getAssetByContractAddress(address);

    return metagraphAsset && balances[metagraphAsset.id];
  }

  validateMetagraphAddress(address: unknown): IAssetState {
    const { vault, assets } = store.getState();
    const { activeNetwork } = vault;

    if (!address) {
      throw new Error("'metagraphAddress' is required");
    }

    if (typeof address !== 'string') {
      throw new Error("Bad argument 'metagraphAddress'");
    }

    if (!dag4.account.validateDagAddress(address)) {
      throw new Error("Invaid address 'metagraphAddress'");
    }

    const metagraphToken = vault?.activeWallet?.assets?.find(
      (asset) =>
        asset.contractAddress === address &&
        activeNetwork.Constellation === assets[asset?.id]?.network
    );

    if (!metagraphToken) {
      throw new Error("'metagraphAddress' not found in wallet");
    }

    return metagraphToken;
  }

  normalizeSignatureRequest(encodedSignatureRequest: string): string {
    let signatureRequest: StargazerSignatureRequest;
    try {
      // Test Manifest V3 (window not defined)
      const stringSignatureDecoded = Buffer.from(
        encodedSignatureRequest,
        'base64'
      ).toString('utf-8');
      signatureRequest = JSON.parse(stringSignatureDecoded);
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

    const parsedMetadata: Record<string, any> = {};
    for (const [key, value] of Object.entries(signatureRequest.metadata)) {
      if (['boolean', 'number', 'string'].includes(typeof value) || value === null) {
        parsedMetadata[key] = value;
      }
    }

    signatureRequest.metadata = parsedMetadata;

    // Test Manifest V3 (window not defined)
    const stringSignature = JSON.stringify(signatureRequest);
    const newEncodedSignatureRequest = Buffer.from(stringSignature).toString('base64');

    if (newEncodedSignatureRequest !== encodedSignatureRequest) {
      throw new Error('SignatureRequest does not match spec (unable to re-normalize)');
    }

    return newEncodedSignatureRequest;
  }

  async signMessage(msg: string) {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const signature = await dag4.keyStore.personalSign(privateKeyHex, msg);

    return signature;
  }

  async signData(data: string) {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const signature = await dag4.keyStore.dataSign(privateKeyHex, data);

    return signature;
  }

  getAssetByType(type: AssetType) {
    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset.type !== type) {
      stargazerAsset = activeWallet.assets.find((a) => a.type === type);
    }

    return stargazerAsset;
  }

  getAssetByContractAddress(address: string) {
    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let metagraphAsset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset?.contractAddress !== address) {
      metagraphAsset = activeWallet.assets.find((a) => a?.contractAddress === address);
    }

    return metagraphAsset;
  }

  private async fetchMetagraphBalance(
    url: string,
    metagraphAddress: string,
    dagAddress: string
  ): Promise<number> {
    const responseJson = await (
      await fetch(`${url}/currency/${metagraphAddress}/addresses/${dagAddress}/balance`)
    ).json();
    const balance = responseJson?.data?.balance ?? 0;
    const balanceNumber = new BigNumber(balance)
      .multipliedBy(DAG_DECIMAL_FACTOR)
      .toNumber();

    return balanceNumber;
  }

  private checkArguments(args: { type: string; value: any; name: string }[]) {
    if (args.length) {
      for (const arg of args) {
        if (!arg.value) {
          throw new Error(`Argument "${arg.name}" is required`);
        }

        if (typeof arg.value !== arg.type) {
          throw new Error(`Bad argument "${arg.name}" -> not a "${arg.type}"`);
        }
      }
    }
  }

  private async checkWatchAssetParams({ type, options }: WatchAssetParameters) {
    const { chainId, address, l0, l1, name, symbol, logo } = options;
    const SUPPORTED_TYPES = ['L0'];
    const SUPPORTED_CHAINS = Object.values(DAG_NETWORK).map((network) => network.chainId);
    const args = [
      { type: 'string', value: type, name: 'type' },
      { type: 'number', value: chainId, name: 'chainId' },
      { type: 'string', value: address, name: 'address' },
      { type: 'string', value: l0, name: 'l0' },
      { type: 'string', value: l1, name: 'l1' },
      { type: 'string', value: name, name: 'name' },
      { type: 'string', value: symbol, name: 'symbol' },
      { type: 'string', value: logo, name: 'logo' },
    ];

    this.checkArguments(args);

    const controller = useController();
    const { isValidDAGAddress, isValidMetagraphAddress } = controller.wallet.account;
    const isValidType = SUPPORTED_TYPES.includes(type);
    const isValidChainId = SUPPORTED_CHAINS.includes(chainId);
    const isValidAddress = isValidDAGAddress(address);

    if (!isValidType) {
      throw new Error('Argument "type" is not supported');
    }

    if (!isValidChainId) {
      throw new Error('Argument "chainId" is not supported');
    }

    const selectedNetwork = Object.values(DAG_NETWORK).find(
      (network) => network.chainId === chainId
    );
    const isValidMetagraph = await isValidMetagraphAddress(address, selectedNetwork.id);

    if (!isValidAddress) {
      throw new Error('Argument "address" is invalid -> not a DAG address');
    }

    if (!isValidMetagraph) {
      throw new Error(
        'Argument "address" or "chainId" are invalid -> metagraph not found'
      );
    }
  }

  async handleProxiedRequest(
    _request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    _sender: chrome.runtime.MessageSender
  ) {
    throw new Error('handleProxiedRequest is not available on StargazerProvider');
  }

  async handleNonProxiedRequest(
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    const { vault, assets } = store.getState();

    let deviceId = '';
    let bipIndex;
    const allWallets = [
      ...vault.wallets.local,
      ...vault.wallets.ledger,
      ...vault.wallets.bitfi,
    ];
    const activeWallet = vault?.activeWallet
      ? allWallets.find((wallet: any) => wallet.id === vault.activeWallet.id)
      : null;

    if (activeWallet?.type === KeyringWalletType.LedgerAccountWallet) {
      bipIndex = activeWallet?.bipIndex;
    } else if (activeWallet?.type === KeyringWalletType.BitfiAccountWallet) {
      deviceId = activeWallet?.accounts[0].deviceId;
    }

    // dag_requestAccounts is used to activate the provider
    if (request.method === AvailableMethods.dag_requestAccounts) {
      // Provider already activated -> return DAG accounts array
      if (isDappConnected(sender.origin)) {
        return this.getAccounts();
      }

      // Provider not activated -> display popup and wait for user's approval
      await StargazerExternalPopups.executePopupWithRequestMessage(
        null,
        message,
        sender.origin,
        'selectAccounts'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (request.method === AvailableMethods.dag_accounts) {
      return this.getAccounts();
    }

    // Provider needs to be activated before calling any other RPC method
    if (!isDappConnected(sender.origin)) {
      throw new Error(
        'Provider is not activated. Call dag_requestAccounts to activate it.'
      );
    }

    if (request.method === AvailableMethods.dag_chainId) {
      return this.getChainId();
    }

    if (request.method === AvailableMethods.dag_getBalance) {
      return this.getBalance();
    }

    if (request.method === AvailableMethods.dag_signData) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Constellation
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      const [address, dataEncoded] = request.params as [string, string];

      if (typeof dataEncoded !== 'string') {
        throw new Error("Bad argument 'dataEncoded' -> must be a string");
      }

      if (typeof address !== 'string') {
        throw new Error("Bad argument 'address' -> must be a string");
      }

      if (!dag4.account.validateDagAddress(address)) {
        throw new Error("Bad argument 'address'");
      }

      if (assetAccount.address !== address) {
        throw new Error('The active account is not the requested');
      }

      const chainLabel =
        this.getChainId() === 1 ? 'Constellation' : 'Constellation Testnet 2.0';

      const signatureData = {
        origin: sender.origin,
        dataEncoded,
        walletId: activeWallet.id,
        walletLabel: activeWallet.label,
        deviceId,
        bipIndex,
        chainLabel,
      };

      await StargazerExternalPopups.executePopupWithRequestMessage(
        signatureData,
        message,
        sender.origin,
        'signData'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
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

      const chainLabel =
        this.getChainId() === 1 ? 'Constellation' : 'Constellation Testnet 2.0';

      const signatureData = {
        origin: sender.origin,
        asset: 'DAG',
        signatureRequestEncoded,
        walletId: activeWallet.id,
        walletLabel: activeWallet.label,
        deviceId,
        bipIndex,
        provider: ProtocolProvider.CONSTELLATION,
        chainLabel,
      };

      await StargazerExternalPopups.executePopupWithRequestMessage(
        signatureData,
        message,
        sender.origin,
        'signMessage'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
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
        value: txAmount / 1e8, // DATUM to DAG
        fee: txFee / 1e8, // DATUM to DAG
        chain: ProtocolProvider.CONSTELLATION,
      };

      await StargazerExternalPopups.executePopupWithRequestMessage(
        txObject,
        message,
        sender.origin,
        'sendTransaction'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (request.method === AvailableMethods.dag_getPendingTransaction) {
      const [hash] = request.params as [unknown];

      if (typeof hash !== 'string') {
        throw new Error("Bad argument 'hash' -> not a string");
      }

      if (!ethers.utils.isHexString(`0x${hash}`, 32)) {
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

      if (!ethers.utils.isHexString(`0x${hash}`, 32)) {
        throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
      }

      try {
        return await dag4.network.getTransaction(hash);
      } catch (e) {
        console.error('dag_getTransaction:', e);
        return null;
      }
    }

    if (request.method === AvailableMethods.dag_getMetagraphBalance) {
      const [address] = request.params as [unknown];

      this.validateMetagraphAddress(address);

      return this.getMetagraphBalance(address as string);
    }

    if (request.method === AvailableMethods.dag_sendMetagraphTransaction) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Constellation
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      const [txData] = request.params as [StargazerMetagraphTransactionRequest];

      const txMetagraphAddress = txData?.metagraphAddress;
      const txSource = txData?.source;
      const txDestination = txData?.destination;
      const txAmount = txData?.amount;
      const txFee = txData?.fee || 0;

      this.validateMetagraphAddress(txMetagraphAddress);

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
        metagraphAddress: txMetagraphAddress,
        to: txDestination,
        value: txAmount / 1e8, // DATUM to DAG
        fee: txFee / 1e8, // DATUM to DAG
        chain: ProtocolProvider.CONSTELLATION,
      };

      await StargazerExternalPopups.executePopupWithRequestMessage(
        txObject,
        message,
        sender.origin,
        'sendTransaction'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (request.method === AvailableMethods.dag_getMetagraphTransaction) {
      const [txData] = request.params as [StargazerMetagraphGetTransactionRequest];

      const txMetagraphAddress = txData.metagraphAddress;
      const txHash = txData.hash;

      if (!txMetagraphAddress) {
        throw new Error("'metagraphAddress' is required");
      }

      if (!txHash) {
        throw new Error("'hash' is required");
      }

      if (typeof txMetagraphAddress !== 'string') {
        throw new Error("Bad argument 'metagraphAddress' -> not a string");
      }

      if (typeof txHash !== 'string') {
        throw new Error("Bad argument 'hash' -> not a string");
      }

      if (!ethers.utils.isHexString(`0x${txHash}`, 32)) {
        throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
      }

      this.validateMetagraphAddress(txMetagraphAddress);

      try {
        const response =
          await dag4.account.networkInstance.blockExplorerV2Api.getCurrencyTransaction(
            txMetagraphAddress,
            txHash
          );
        return response?.data ? response.data : null;
      } catch (e) {
        console.error('dag_getMetagraphTransaction:', e);
        return null;
      }
    }

    if (request.method === AvailableMethods.dag_getMetagraphPendingTransaction) {
      const [txData] = request.params as [StargazerMetagraphGetTransactionRequest];

      const txMetagraphAddress = txData.metagraphAddress;
      const txHash = txData.hash;

      if (!txMetagraphAddress) {
        throw new Error("'metagraphAddress' is required");
      }

      if (!txHash) {
        throw new Error("'hash' is required");
      }

      if (typeof txMetagraphAddress !== 'string') {
        throw new Error("Bad argument 'metagraphAddress' -> not a string");
      }

      if (typeof txHash !== 'string') {
        throw new Error("Bad argument 'hash' -> not a string");
      }

      if (!ethers.utils.isHexString(`0x${txHash}`, 32)) {
        throw new Error("Bad argument 'hash' -> invalid 32 byte hex value");
      }

      const metagraphToken = this.validateMetagraphAddress(txMetagraphAddress);

      const metagraphTokenInfo = assets[metagraphToken?.id];

      if (!metagraphTokenInfo) {
        throw new Error("'metagraphAddress' not found in wallet");
      }

      const { address, l0endpoint, l1endpoint } = metagraphTokenInfo;
      const { beUrl } = DAG_NETWORK[vault.activeNetwork.Constellation].config;
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        id: address,
        metagraphId: address,
        l0Url: l0endpoint,
        l1Url: l1endpoint,
        beUrl,
      });

      try {
        return metagraphClient.networkInstance.getPendingTransaction(txHash);
      } catch (e) {
        console.error('dag_getMetagraphPendingTransaction:', e);
        return null;
      }
    }

    if (request.method === AvailableMethods.wallet_watchAsset) {
      const [params] = request.params as [WatchAssetParameters];
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { activeWallet }: IVaultState = store.getState().vault;

      await this.checkWatchAssetParams(params);

      const metagraphAddress = params.options.address;
      const dagAddress = activeWallet?.assets?.find(
        (asset) => asset?.id === AssetType.Constellation
      )?.address;

      if (!dagAddress) {
        throw new Error('DAG address not found');
      }

      const selectedNetwork = Object.values(DAG_NETWORK).find(
        (network) => network.chainId === params.options.chainId
      );

      const balance = await this.fetchMetagraphBalance(
        selectedNetwork.config.beUrl,
        metagraphAddress,
        dagAddress
      );

      await StargazerExternalPopups.executePopupWithRequestMessage(
        { ...params, balance },
        message,
        sender.origin,
        'watchAsset'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    throw new Error('Unsupported non-proxied method');
  }
}
