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
import { Runtime, Windows } from 'webextension-polyfill-ts';
import { InputData as ContractInputData } from 'ethereum-input-data-decoder';

import store from 'state/store';
import { IDAppState } from 'state/dapp/types';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { useController } from 'hooks/index';
import { estimateGasPrice, getERC20DataDecoder } from 'utils/ethUtil';
import { getInfuraProvider } from 'utils/ethersUtil';

import type { DappProvider } from '../Background/dappRegistry';
import {
  AvailableMethods,
  IRpcChainRequestHandler,
  StargazerProxyRequest,
  EIPRpcError,
} from '../common';

import { StargazerSignatureRequest } from './StargazerProvider';
import { getChainId } from 'scripts/Background/controllers/EthChainController/utils';

// Constants
const LEDGER_URL = '/ledger.html';
const EXTERNAL_URL = '/external.html';
const WINDOW_TYPES: Record<string, Windows.CreateType> = {
  popup: 'popup',
  normal: 'normal',
};

export class EthereumProvider implements IRpcChainRequestHandler {
  getNetwork() {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Ethereum];
  }

  getChainId() {
    const networkName = this.getNetwork();

    return getChainId(networkName);
  }

  getAddress() {
    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Ethereum);

    return stargazerAsset && stargazerAsset.address;
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

  getBlockNumber() {
    return 1;
  }

  async getGasEstimate() {
    return estimateGasPrice();
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    const stargazerAsset: IAssetState = this.getAssetByType(AssetType.Ethereum);

    return stargazerAsset && balances[AssetType.Ethereum];
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

    const newEncodedSignatureRequest = window.btoa(JSON.stringify(signatureRequest));

    return newEncodedSignatureRequest;
  }

  signMessage(msg: string) {
    const controller = useController();
    const wallet = controller.wallet.account.ethClient.getWallet();
    const privateKeyHex = this.remove0x(wallet.privateKey);
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.preserve0x(toRpcSig(v, r, s));

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
    request: StargazerProxyRequest & { type: 'rpc' },
    _dappProvider: DappProvider,
    _port: Runtime.Port
  ) {
    const provider = getInfuraProvider(this.getNetwork());

    return provider.send(request.method, request.params);
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

    if (request.method === AvailableMethods.eth_accounts) {
      return this.getAccounts();
    }

    if (request.method === AvailableMethods.personal_sign) {
      if (!activeWallet) {
        throw new Error('There is no active wallet');
      }

      const assetAccount = activeWallet.accounts.find(
        (account) => account.network === KeyringNetwork.Ethereum
      );

      if (!assetAccount) {
        throw new Error('No active account for the request asset type');
      }

      // Extension 3.6.0+
      let [data, address] = request.params as [string, string];

      if (typeof data !== 'string') {
        throw new Error("Bad argument 'data'");
      }

      if (typeof address !== 'string') {
        throw new Error("Bad argument 'address'");
      }

      /* -- Backwards Compatibility */
      // Extension pre 3.6.0
      if (data.length === 42 && address.length !== 42) {
        [data, address] = [address, data];
      }
      /* Backwards Compatibility -- */

      if (!ethers.utils.isAddress(address)) {
        throw new Error("Bad argument 'address'");
      }

      if (assetAccount.address !== address) {
        throw new Error('The active account is not the requested');
      }

      const signatureRequestEncoded = this.normalizeSignatureRequest(data);

      const signatureData = {
        origin: dappProvider.origin,
        asset: 'ETH',
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

    if (request.method === AvailableMethods.eth_sendTransaction) {
      const [trxData] = request.params as [ethers.Transaction];
      let decodedContractCall: ContractInputData | null = null;

      try {
        decodedContractCall =
          typeof trxData.data === 'string'
            ? getERC20DataDecoder().decodeData(trxData.data)
            : null;
      } catch (e) {
        console.log('EthereumProvider:eth_sendTransaction', e);
      }

      if (decodedContractCall?.method === 'approve') {
        // special case transaction
        const spendEvent = await dappProvider.createPopupAndWaitForEvent(
          port,
          'spendApproved',
          undefined,
          'approveSpend',
          { ...trxData }
        );

        if (spendEvent === null) {
          throw new EIPRpcError('User Rejected Request', 4001);
        }

        if (spendEvent.detail.error) {
          throw new EIPRpcError(spendEvent.detail.error, 4002);
        }

        if (!spendEvent.detail.result) {
          throw new EIPRpcError('User Rejected Request', 4001);
        }

        return spendEvent.detail.result;
      } else {
        const sentTransactionEvent = await dappProvider.createPopupAndWaitForEvent(
          port,
          'transactionSent',
          undefined,
          'sendTransaction',
          { ...trxData }
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
    }

    if (request.method === AvailableMethods.web3_sha3) {
      return ethers.utils.keccak256(request.params[0]);
    }

    throw new Error('Unsupported non-proxied method');
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }

  private preserve0x(hash: string) {
    return hash.startsWith('0x') ? hash : `0x${hash}`;
  }
}
