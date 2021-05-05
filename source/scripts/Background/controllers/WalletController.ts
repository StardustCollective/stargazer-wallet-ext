import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import {
  changeActiveWallet,
  changeActiveNetwork,
  setVaultInfo,
  updateStatus
} from 'state/vault';
import { AccountController } from './AccountController';
import { DAG_NETWORK } from 'constants/index';
import IVaultState, { IWalletState, NetworkType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { browser } from 'webextension-polyfill-ts';
import { IKeyringWallet, KeyringManager, KeyringNetwork, KeyringVaultState } from '@stardust-collective/dag4-keyring';
import { IWalletController } from './IWalletController';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';

export class WalletController implements IWalletController {
  account: Readonly<AccountController>;
  keyringManager: Readonly<KeyringManager>;
  onboardHelper: Readonly<OnboardWalletHelper>;

  constructor () {
    this.onboardHelper = new OnboardWalletHelper();
    this.keyringManager = new KeyringManager();
    this.keyringManager.on('update', (state: KeyringVaultState) => {
      store.dispatch(setVaultInfo(state));
    })

    this.account = Object.freeze(
      new AccountController(this.keyringManager)
    );
  }

  checkPassword (password: string) {
    return this.keyringManager.checkPassword(password)
  }

  // generateSeedPhrase () {
  //   this.tempSeed = this.keyringManager.generateSeedPhrase();
  //   return this.tempSeed;
  // }
  //
  // getGeneratedSeedPhrase () {
  //   return this.tempSeed;
  // }
  //
  // importPhrase (phrase: string) {
  //   if(HdKeyring.validateMnemonic(phrase)) {
  //     this.tempSeed = phrase;
  //     return true;
  //   }
  //   return false;
  //   //await this.createWallet('Main Wallet', phrase, true);
  // }

  isUnlocked () {
    return this.keyringManager.isUnlocked();
  }

  getPhrase (walletId: string, password: string) {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportWalletSecretKeyOrPhrase(walletId);
  }

  getPrivateKey (walletId: string, password: string) {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportWalletSecretKeyOrPhrase(walletId);
  }

  async unLock (password: string): Promise<boolean> {
    await this.keyringManager.login(password);

    return true;
  }

  async importSingleAccount (label: string, network: KeyringNetwork, privateKey: string) {
    const wallet = await this.keyringManager.createSingleAccountWallet(label, network, privateKey);

    return wallet.id;
  }

  async createWallet ( label: string, phrase?: string, resetAll = false) {
    let wallet: IKeyringWallet;
    ;
    if (resetAll) {
      wallet = await this.keyringManager.createOrRestoreVault(label, phrase);
    }
    else {
      wallet = await this.keyringManager.createMultiChainHdWallet(label, phrase);
    }

    if (resetAll) {
      await this.account.getLatestUpdate();
    }

    return wallet.id;
  }

  async deleteWallet (walletId: string, password: string) {
    if (this.checkPassword(password)) {
      // const { wallet }: IVaultState = store.getState().vault;
      await this.keyringManager.removeWalletById(walletId);
      // store.dispatch(deleteWalletState());
      store.dispatch(updateStatus());
      return true;
    }
    return false;
  }

  async switchWallet (wallet: IWalletState) {
    store.dispatch(changeActiveWallet(wallet));
    await this.account.getLatestUpdate();
    dag4.monitor.startMonitor();
  }

  switchNetwork (network: NetworkType, chainId: string) {
    const { activeAsset }: IVaultState = store.getState().vault;
    const assets: IAssetListState = store.getState().assets;

    if (network === NetworkType.Constellation && DAG_NETWORK[chainId]!.id) {
      dag4.network.setNetwork({
        id: DAG_NETWORK[chainId].id,
        beUrl: DAG_NETWORK[chainId].beUrl,
        lbUrl: DAG_NETWORK[chainId].lbUrl,
      });
    }

    if (assets[activeAsset.id].network !== chainId) {
      this.account.updateAccountActiveAsset(activeAsset);
    }

    store.dispatch(
      changeActiveNetwork({ network, chainId })
    );

    this.account.getLatestUpdate();
  }

  setWalletPassword (password: string) {
    this.keyringManager.setPassword(password);
  }

  async logOut () {
    this.keyringManager.logout();
    store.dispatch(updateStatus());
    browser.runtime.reload();
  }

}

