import store from 'state/store';
import { ecsign, hashPersonalMessage, toRpcSig, isHexString, toUtf8 } from 'ethereumjs-util';
import find from 'lodash/find';
import { useController } from 'hooks/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { estimateGasPrice } from 'utils/ethUtil';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { IDAppState } from 'state/dapp/types';
import { StargazerSignatureRequest } from './StargazerProvider';
import { getChainId } from 'scripts/Background/controllers/EthChainController/utils';

export class EthereumProvider {

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

    const _origin = origin.replace(/https?:\/\//, '');

    const dappData = whitelist[_origin];

    if (!dappData?.accounts?.Ethereum) {
      return [];
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      return dappData.accounts.Ethereum;
    }

    const ethAddresses = dappData.accounts.Ethereum;
    const activeAddress = find(activeWallet.assets, { id: 'ethereum' });

    return [activeAddress?.address, ...ethAddresses.filter((address) => address !== activeAddress?.address)].filter(
      Boolean
    ); // if no active address, remove
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

  /*
  async importLedgerAccounts(addresses: AccountItem[]) {
    for (let i = 0; i < addresses.length; i++) {
      let accountItem = addresses[i];

      window.controller.wallet.keyringManager.findAccount(accountItem.address);

      const res = await this.getAccountByAddress(accountItem.address);

      const account = {
        id: 'L' + accountItem.id,
        label: 'Ledger ' + (accountItem.id + 1),
        address: res!.address,
        publicKey: accountItem!.publicKey,
        balance: res!.balance,
        transactions: res!.transactions,
        type: AccountType.Ledger,
      };

      await store.dispatch(createAccount(account));
    }
  } */

  // async postTransactionResult (hash: string) {
  //   console.log('postTransactionResult.addToMemPoolMonitor', hash);
  //
  //   await dag4.monitor.addToMemPoolMonitor(hash);
  //
  //   setTimeout(() => {
  //     console.log('postTransactionResult.watchMemPool');
  //     window.controller.wallet.account.watchMemPool();
  //   }, 1000)
  // }

  // private async getAccountByAddress(address: string): Promise<IAccountInfo> {
  //   dag4.account.setKeysAndAddress('', '', address);
  //   const balance = await dag4.account.getBalance();
  //   const transactions = await dag4.account.getTransactions(10);
  //   return {
  //     address: {
  //       constellation: dag4.account.address,
  //     },
  //     balance,
  //     transactions,
  //   };
  // }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }

  private preserve0x(hash: string) {
    return hash.startsWith('0x') ? hash : `0x${hash}`;
  }
}

// type AccountItem = {
//   id: number;
//   address: string;
//   publicKey: string;
// };
