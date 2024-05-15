import {
  ecsign,
  hashPersonalMessage,
  toRpcSig,
  isHexString,
  toUtf8,
} from 'ethereumjs-util';
import find from 'lodash/find';
import * as ethers from 'ethers';
import {
  KeyringNetwork,
  KeyringWalletAccountState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import { InputData as ContractInputData } from 'ethereum-input-data-decoder';

import store from 'state/store';
import { IDAppState } from 'state/dapp/types';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { useController } from 'hooks/index';
import { getERC20DataDecoder } from 'utils/ethUtil';
import { TypedSignatureRequest } from 'scenes/external/TypedSignatureRequest';
import {
  getChainId,
  getChainInfo,
} from 'scripts/Background/controllers/EVMChainController/utils';
import { ALL_EVM_CHAINS, SUPPORTED_HEX_CHAINS } from 'constants/index';

import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';

import { isDappConnected } from 'scripts/Background/handlers/handleDappMessages';
import {
  AvailableMethods,
  IRpcChainRequestHandler,
  StargazerRequest,
  EIPRpcError,
  StargazerChain,
  ProtocolProvider,
  EIPErrorCodes,
  StargazerRequestMessage,
} from '../common';
import { StargazerSignatureRequest } from './StargazerProvider';

interface SwitchEthereumChainParameter {
  chainId: string;
}

export class EVMProvider implements IRpcChainRequestHandler {
  //////////////////////
  // Private methods
  //////////////////////

  private getNetworkInfo() {
    const { currentEVMNetwork }: IVaultState = store.getState().vault;
    const networkInfo = Object.values(ALL_EVM_CHAINS).find(
      (chain) => chain.id === currentEVMNetwork
    );

    if (!networkInfo)
      throw new EIPRpcError('Network not found', EIPErrorCodes.ChainDisconnected);

    return networkInfo;
  }

  private getNetworkLabel() {
    const network = this.getNetworkInfo();
    return network.network;
  }

  private getNetworkId() {
    const network = this.getNetworkInfo();
    return network.networkId;
  }

  private getNetworkToken() {
    const network = this.getNetworkInfo();
    return network.nativeToken;
  }

  private getWallet() {
    const controller = useController();
    const networkId = this.getNetworkId();

    if (networkId === StargazerChain.ETHEREUM) {
      return controller.wallet.account.networkController.ethereumNetwork.getWallet();
    }
    if (networkId === StargazerChain.POLYGON) {
      return controller.wallet.account.networkController.polygonNetwork.getWallet();
    }
    if (networkId === StargazerChain.BSC) {
      return controller.wallet.account.networkController.bscNetwork.getWallet();
    }
    if (networkId === StargazerChain.AVALANCHE) {
      return controller.wallet.account.networkController.avalancheNetwork.getWallet();
    }

    throw new EIPRpcError('Wallet not found', EIPErrorCodes.Unauthorized);
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }

  private preserve0x(hash: string) {
    return hash.startsWith('0x') ? hash : `0x${hash}`;
  }

  //////////////////////
  // Public methods
  //////////////////////

  getNetwork() {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const networkLabel = this.getNetworkLabel();

    return activeNetwork[networkLabel as keyof typeof activeNetwork];
  }

  getChainId() {
    const networkName = this.getNetwork();

    return getChainId(networkName);
  }

  getAddress() {
    // It's ok to return the ETH address for all EVM networks
    const asset: IAssetState = this.getAssetByType(AssetType.Ethereum);

    return asset && asset.address;
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

    if (!dappData?.accounts?.Ethereum) {
      return [];
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      return dappData.accounts.Ethereum;
    }

    const ethAddresses = dappData.accounts.Ethereum;
    const activeAddress = find(activeWallet.assets, { id: 'ethereum' });

    return [
      activeAddress?.address,
      ...ethAddresses.filter((address) => address !== activeAddress?.address),
    ].filter(Boolean); // if no active address, remove
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    const asset: IAssetState = this.getAssetByType(AssetType.Ethereum);
    const networkId = this.getNetworkId();

    return asset && balances[networkId];
  }

  normalizeSignatureRequest(message: string): string {
    // Test for hex message data
    if (isHexString(message)) {
      try {
        message = toUtf8(message);
      } catch (e) {
        // NOOP
      }
    }

    const signatureRequest: StargazerSignatureRequest = {
      content: message,
      metadata: {},
    };

    const stringSignature = JSON.stringify(signatureRequest);
    const newEncodedSignatureRequest = Buffer.from(stringSignature).toString('base64');

    return newEncodedSignatureRequest;
  }

  signMessage(msg: string) {
    const wallet = this.getWallet();
    const privateKeyHex = this.remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.preserve0x(toRpcSig(v, r, s));

    return sig;
  }

  signTypedData(
    domain: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[0],
    types: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[1],
    value: Parameters<typeof ethers.utils._TypedDataEncoder.hash>[2]
  ) {
    const wallet = this.getWallet();
    const privateKeyHex = this.remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);

    const { v, r, s } = ecsign(Buffer.from(this.remove0x(msgHash), 'hex'), privateKey);
    const sig = this.preserve0x(toRpcSig(v, r, s));

    return sig;
  }

  getAssetByType(type: AssetType) {
    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let asset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset.type !== type) {
      asset = activeWallet.assets.find((a) => a.type === type);
    }

    return asset;
  }

  async handleProxiedRequest(
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    _sender: chrome.runtime.MessageSender
  ) {
    const { activeNetwork }: IVaultState = store.getState().vault;
    const networkLabel = this.getNetworkLabel();
    const chainId = activeNetwork[`${networkLabel as keyof typeof activeNetwork}`];
    const networkInfo = getChainInfo(chainId);
    const provider = new ethers.providers.JsonRpcProvider(networkInfo.rpcEndpoint);

    return provider.send(request.method, request.params);
  }

  async handleNonProxiedRequest(
    request: StargazerRequest & { type: 'rpc' },
    message: StargazerRequestMessage,
    sender: chrome.runtime.MessageSender
  ) {
    const { vault } = store.getState();

    const allWallets = [
      ...vault.wallets.local,
      ...vault.wallets.ledger,
      ...vault.wallets.bitfi,
    ];
    const activeWallet = vault?.activeWallet
      ? allWallets.find((wallet: any) => wallet.id === vault.activeWallet.id)
      : null;

    // eth_requestAccounts is used to activate the provider
    if (request.method === AvailableMethods.eth_requestAccounts) {
      // Provider already activated -> return ETH accounts array
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

    if (request.method === AvailableMethods.eth_accounts) {
      return this.getAccounts();
    }

    // Provider needs to be activated before calling any other RPC method
    if (!isDappConnected(sender.origin)) {
      throw new EIPRpcError(
        'Provider is not activated. Call eth_requestAccounts to activate it.',
        EIPErrorCodes.Unauthorized
      );
    }

    if (request.method === AvailableMethods.personal_sign) {
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

      const signatureRequestEncoded = this.normalizeSignatureRequest(data);

      const chainLabel = Object.values(ALL_EVM_CHAINS).find(
        (chain: any) => chain.chainId === this.getChainId()
      )?.label;

      const signatureData = {
        origin: sender.origin,
        asset: this.getNetworkToken(),
        signatureRequestEncoded,
        walletId: activeWallet.id,
        walletLabel: activeWallet.label,
        publicKey: '',
        provider: ProtocolProvider.ETHEREUM,
        chainLabel,
      };

      // If the type of account is Ledger send back the public key so the
      // signature can be verified by the requester.
      const accounts: KeyringWalletAccountState[] = activeWallet?.accounts;
      if (
        activeWallet.type === KeyringWalletType.LedgerAccountWallet &&
        accounts &&
        accounts[0]
      ) {
        signatureData.publicKey = accounts[0].publicKey;
      }

      await StargazerExternalPopups.executePopupWithRequestMessage(
        signatureData,
        message,
        sender.origin,
        'signMessage'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (
      [
        AvailableMethods.eth_signTypedData,
        AvailableMethods.eth_signTypedData_v4,
      ].includes(request.method)
    ) {
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

      const activeChainId = this.getChainId();
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
        chain: this.getNetworkId() as StargazerChain,
        signer: address,
        content: JSON.stringify(data.message),
      };

      const signatureData = {
        origin: sender.origin,
        domain: JSON.stringify(data.domain),
        signatureConsent,
        walletId: activeWallet.id,
        walletLabel: activeWallet.label,
        publicKey: '',
        originalData: data,
      };

      // If the type of account is Ledger send back the public key so the
      // signature can be verified by the requester.
      const accounts: KeyringWalletAccountState[] = activeWallet?.accounts;
      if (
        activeWallet.type === KeyringWalletType.LedgerAccountWallet &&
        accounts &&
        accounts[0]
      ) {
        signatureData.publicKey = accounts[0].publicKey;
      }

      await StargazerExternalPopups.executePopupWithRequestMessage(
        signatureData,
        message,
        sender.origin,
        'signTypedMessage'
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (request.method === AvailableMethods.eth_sendTransaction) {
      const [trxData] = request.params;
      console.log('trxData', trxData);

      let decodedContractCall: ContractInputData | null = null;
      let route = 'sendTransaction';

      // chainId should match the current active network if chainId property is provided.
      if (trxData?.chainId) {
        const chainId = this.getChainId();

        if (typeof trxData.chainId === 'number') {
          if (trxData.chainId !== chainId) {
            throw new EIPRpcError(
              'chainId does not match the active network chainId',
              EIPErrorCodes.ChainDisconnected
            );
          }
        }

        if (typeof trxData.chainId === 'string') {
          if (parseInt(trxData.chainId, 10) !== chainId) {
            throw new EIPRpcError(
              'chainId does not match the active network chainId',
              EIPErrorCodes.ChainDisconnected
            );
          }
        }
      }

      try {
        decodedContractCall =
          typeof trxData.data === 'string'
            ? getERC20DataDecoder().decodeData(trxData.data)
            : null;
      } catch (e) {
        console.log('EVMProvider:eth_sendTransaction', e);
      }

      const chainLabel = Object.values(ALL_EVM_CHAINS).find(
        (chain: any) => chain.chainId === this.getChainId()
      )?.label;

      if (decodedContractCall?.method === 'approve') {
        route = 'approveSpend';
      }

      const data = { ...trxData, chain: this.getNetworkId(), chainLabel };

      await StargazerExternalPopups.executePopupWithRequestMessage(
        data,
        message,
        sender.origin,
        route
      );

      return StargazerWSMessageBroker.NoResponseEmitted;
    }

    if (request.method === AvailableMethods.web3_sha3) {
      return ethers.utils.keccak256(request.params[0]);
    }

    if (request.method === AvailableMethods.web3_clientVersion) {
      return `Stargazer/v${STARGAZER_WALLET_VERSION}`;
    }

    if (request.method === AvailableMethods.wallet_switchEthereumChain) {
      const [chainData] = (request?.params as [SwitchEthereumChainParameter]) || [];

      if (!chainData || !chainData?.chainId) {
        throw new EIPRpcError('chainId not provided', EIPErrorCodes.Unauthorized);
      }

      const { chainId } = chainData;

      if (typeof chainId !== 'string') {
        throw new EIPRpcError('chainId must be a string', EIPErrorCodes.Unauthorized);
      }

      if (!chainId.startsWith('0x')) {
        throw new EIPRpcError(
          'chainId must specify the integer ID of the chain as a hexadecimal string',
          EIPErrorCodes.Unauthorized
        );
      }

      if (!SUPPORTED_HEX_CHAINS.includes(chainId)) {
        // Show network not supported popup
        throw new EIPRpcError('chainId not supported', EIPErrorCodes.Unauthorized);
      }

      const controller = useController();
      const chainInfo = Object.values(ALL_EVM_CHAINS).find(
        (chain) => chain.hexChainId === chainId
      );

      try {
        await controller.wallet.switchNetwork(chainInfo.network, chainInfo.id);
      } catch (e) {
        throw new EIPRpcError(
          'There was an error switching the Ethereum chain',
          EIPErrorCodes.ChainDisconnected
        );
      }

      // https://eips.ethereum.org/EIPS/eip-3326#returns
      return null;
    }

    throw new EIPRpcError('Unsupported non-proxied method', EIPErrorCodes.Unsupported);
  }
}
