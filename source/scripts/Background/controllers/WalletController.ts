import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import * as ethers from 'ethers';
import {
  changeActiveNetwork,
  changeActiveWallet,
  setVaultInfo,
  addLedgerWallet,
  updateWallets,
  addBitfiWallet,
  addCustomNetwork,
  changeCurrentEVMNetwork,
  getHasEncryptedVault,
} from 'state/vault';
import IVaultState, {
  ICustomNetworkObject,
  IVaultWalletsStoreState,
  Network,
} from 'state/vault/types';
import { DAG_NETWORK } from 'constants/index';
import {
  KeyringAssetType,
  KeyringManager,
  KeyringNetwork,
  KeyringWalletState,
  KeyringVaultState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import { getEncryptor } from 'utils/keyringManagerUtils';
import { AccountItem } from 'scripts/types';
import filter from 'lodash/filter';
import { isNative } from 'utils/envUtil';
import { setAutoLogin } from 'state/biometrics';
import { setUnlocked } from 'state/auth';
import { ProtocolProvider } from 'scripts/common';
import { generateId } from './EVMChainController/utils';
import { AccountController } from './AccountController';
import { KeystoreToKeyringHelper } from '../helpers/keystoreToKeyringHelper';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import SwapController, { ISwapController } from './SwapController';
import NFTController, { INFTController } from './NFTController';
import { DappMessage, DappMessageEvent, MessageType } from '../messaging/types';

// Constants
const LEDGER_WALLET_PREFIX = 'L';
const BITFI_WALLET_PREFIX = 'B';
const LEDGER_WALLET_LABEL = 'Ledger';
const BITFI_WALLET_LABEL = 'Bitfi';
const ACCOUNT_ITEMS_FIRST_INDEX = 0;

class WalletController {
  account: AccountController;

  keyringManager: KeyringManager;

  swap: ISwapController;

  nfts: INFTController;

  onboardHelper: OnboardWalletHelper;

  static instance: WalletController;

  constructor() {
    this.onboardHelper = new OnboardWalletHelper();
    this.keyringManager = new KeyringManager({
      encryptor: getEncryptor(),
    });
    this.keyringManager.on('update', async (state: KeyringVaultState) => {
      store.dispatch(setVaultInfo(state));
      const { vault } = store.getState();

      try {
        if (vault && vault.activeWallet) {
          await this.switchWallet(vault.activeWallet.id, vault.activeWallet.label);
        } else if (state.wallets.length) {
          await this.switchWallet(state.wallets[0].id, state.wallets[0].label);
        }
      } catch (e) {
        console.log('Error while switching wallet at login');
        console.log(e);
      }
      store.dispatch(setUnlocked(state.isUnlocked));
    });

    this.account = new AccountController(this.keyringManager);
    this.swap = new SwapController();
    this.nfts = new NFTController(this.account);
  }

  checkPassword(password: string): boolean {
    return this.keyringManager.checkPassword(password);
  }

  isUnlocked(): boolean {
    return this.keyringManager.isUnlocked();
  }

  getPhrase(walletId: string, password: string): string {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportWalletSecretKeyOrPhrase(walletId);
  }

  getPrivateKey(address: string, password: string): string {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportAccountPrivateKey(address);
  }

  async unLock(password: string): Promise<boolean> {
    await this.keyringManager.login(password);

    const state = store.getState();
    const { vault } = state;

    if (vault) {
      // Check for v1.4 migration
      if (vault.migrateWallet) {
        try {
          await KeystoreToKeyringHelper.migrate(vault.migrateWallet, password);
        } catch (e) {
          return false;
        }
      }
    }

    return true;
  }

  async importSingleAccount(
    label: string,
    network: KeyringNetwork,
    privateKey: string,
    silent?: boolean
  ): Promise<string> {
    const wallet = await this.keyringManager.createSingleAccountWallet(
      label,
      network,
      privateKey
    );

    if (!silent) {
      // The createSingleAccountWallet sends an "update" event which executes the switchWallet function
      // with an old wallet. This issue is reproducible when importing a DAG wallet with private key.
      // This is a workaround to fix that race conditon.
      setTimeout(async () => {
        await this.switchWallet(wallet.id);
      }, 1000);
    }
    return wallet.getLabel();
  }

  async createWallet(label: string, phrase?: string, resetAll = false): Promise<string> {
    let wallet;
    try {
      if (resetAll) {
        wallet = await this.keyringManager.createOrRestoreVault(label, phrase);
      } else {
        wallet = await this.keyringManager.createMultiChainHdWallet(label, phrase);
      }
    } catch (err) {
      console.log('CREATE WALLET ERR CAUGHT =====>>>>> ', err);
      console.log('err.stack');
      throw err;
    }

    await this.switchWallet(wallet.id);

    return wallet.id;
  }

  private checkForDuplicateWallet(address: string): boolean {
    const state = store.getState();
    const { vault } = state;
    const { wallets } = vault;
    const allWallets = [...wallets.local, ...wallets.ledger, ...wallets.bitfi];

    for (let i = 0; i < allWallets.length; i++) {
      const { accounts } = allWallets[i];
      for (let j = 0; j < accounts.length; j++) {
        const account = accounts[j];
        if (account.address === address) return true;
      }
    }

    return false;
  }

  private getNextHardwareWaletAccountId = (wallets: any, prefix: string): number => {
    // If no wallets exist return 1 as the first ID.
    if (wallets.length === 0) {
      return 1;
    }

    const walletIds = [];

    // Move all the existing IDs the walletIds array.
    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      const num = wallet.id.replace(prefix, '');
      walletIds.push(parseInt(num, 10));
    }

    //Determine the next ID.
    return (
      walletIds.sort(function (a, b) {
        return a - b;
      })[walletIds.length - 1] + 1
    );
  };

  async importHardwareWalletAccounts(
    accountItems: AccountItem[],
    deviceId?: string
  ): Promise<void> {
    for (let i = 0; i < accountItems.length; i++) {
      const state = store.getState();
      const { vault } = state;
      const { wallets } = vault;
      const accountItem = accountItems[i];
      const isDuplicate = this.checkForDuplicateWallet(accountItem.address);
      // Skip the account if it already exist in the vault.wallets redux store.
      if (isDuplicate) {
        continue;
      }

      const wallet =
        accountItem.type === KeyringWalletType.LedgerAccountWallet
          ? wallets.ledger
          : wallets.bitfi;
      const prefix =
        accountItem.type === KeyringWalletType.LedgerAccountWallet
          ? LEDGER_WALLET_PREFIX
          : BITFI_WALLET_PREFIX;
      const label =
        accountItem.type === KeyringWalletType.LedgerAccountWallet
          ? LEDGER_WALLET_LABEL
          : BITFI_WALLET_LABEL;
      const addWallet =
        accountItem.type === KeyringWalletType.LedgerAccountWallet
          ? addLedgerWallet
          : addBitfiWallet;
      // Determine the next ID for either a ledger or bitfi wallet.
      const id: number = this.getNextHardwareWaletAccountId(wallet, prefix);

      // Determine the name of the wallet for Ledger we need to create a recursive
      // function that will name the wallets.
      const newWallet = {
        id: `${prefix}${id}`,
        bipIndex: accountItem.bipIndex,
        // The account id is offset by one so the UI displays will
        // the first account as 1 and not 0.
        label: `${label} ${id}`,
        type: accountItem.type,
        accounts: [
          {
            address: accountItem.address,
            network: KeyringNetwork.Constellation,
            publicKey: accountItem!.publicKey,
            deviceId, // Used for bitfi devices.
          },
        ],
        supportedAssets: [KeyringAssetType.DAG],
      };

      await store.dispatch(addWallet(newWallet));

      // Switches wallets immediately after adding the first account item
      // to prevent a rendering delay in the wallet extension.
      if (i === ACCOUNT_ITEMS_FIRST_INDEX) {
        // Switches wallets to the first hardware wallet account item in the accountItem array.
        this.switchWallet(`${prefix}${accountItems[0].id}`);
      }
    }
  }

  async deleteWallet(wallet: KeyringWalletState): Promise<void> {
    const { vault } = store.getState();
    const { wallets } = vault;
    const { local, bitfi, ledger } = wallets;

    let newWalletState: IVaultWalletsStoreState = { local: [], ledger: [], bitfi: [] };
    let newLocalState = [...local];
    let newLedgerState = [...ledger];
    let newBitfiState = [...bitfi];

    if (
      wallet.type !== KeyringWalletType.LedgerAccountWallet &&
      wallet.type !== KeyringWalletType.BitfiAccountWallet
    ) {
      newLocalState = filter(newLocalState, (w) => w.id !== wallet.id);
    } else if (wallet.type === KeyringWalletType.LedgerAccountWallet) {
      newLedgerState = filter(newLedgerState, (w) => w.id !== wallet.id);
    } else if (wallet.type === KeyringWalletType.BitfiAccountWallet) {
      newBitfiState = filter(newBitfiState, (w) => w.id !== wallet.id);
    }

    newWalletState = {
      local: [...newLocalState],
      ledger: [...newLedgerState],
      bitfi: [...newBitfiState],
    };

    const newAllWallets = [
      ...newWalletState.local,
      ...newWalletState.ledger,
      ...newWalletState.bitfi,
    ];

    if (vault && vault.activeWallet && vault.activeWallet.id === wallet.id) {
      if (newAllWallets.length) {
        await this.switchWallet(newAllWallets[0].id);
      }
    }

    store.dispatch(updateWallets({ wallets: newWalletState }));

    if (
      wallet.type !== KeyringWalletType.LedgerAccountWallet &&
      wallet.type !== KeyringWalletType.BitfiAccountWallet
    ) {
      await this.keyringManager.removeWalletById(wallet.id);
    }
  }

  async switchWallet(id: string, label?: string): Promise<void> {
    await this.account.buildAccountAssetInfo(id, label);
    await Promise.all([
      this.account.getLatestTxUpdate(),
      this.account.assetsBalanceMonitor.start(),
      this.account.txController.startMonitor(),
      this.nfts.fetchAllNfts(),
    ]);
  }

  async switchNetwork(network: string, chainId: string): Promise<void> {
    const { activeAsset }: IVaultState = store.getState().vault;
    const { assets } = store.getState();
    console.log(`${network} - ${chainId}`);

    let provider = ProtocolProvider.CONSTELLATION;
    if (network === KeyringNetwork.Constellation && DAG_NETWORK[chainId]!.id) {
      dag4.account.connect(
        {
          id: DAG_NETWORK[chainId].id,
          networkVersion: DAG_NETWORK[chainId].version,
          ...DAG_NETWORK[chainId].config,
        },
        false
      );
    }

    const EVM_CHAINS = [
      KeyringNetwork.Ethereum,
      Network.Avalanche,
      Network.BSC,
      Network.Polygon,
    ];

    if (EVM_CHAINS.includes(network as KeyringNetwork | Network)) {
      this.account.networkController.switchChain(network, chainId);
      store.dispatch(changeCurrentEVMNetwork(chainId));
      provider = ProtocolProvider.ETHEREUM;
    }

    store.dispatch(changeActiveNetwork({ network, chainId }));
    // Update NFTs list if any EVM chain has changed.
    await this.nfts.fetchAllNfts();

    if (!isNative) {
      const message: DappMessage = {
        type: MessageType.dapp,
        event: DappMessageEvent.chainChanged,
        payload: { provider, network, chainId },
      };

      await chrome.runtime.sendMessage(message);
    }

    if (activeAsset) {
      if (assets[activeAsset.id].network !== chainId) {
        await this.account.updateAccountActiveAsset(activeAsset);
      }

      await this.account.getLatestTxUpdate();
    }

    // restart monitor with different network
    await this.account.assetsBalanceMonitor.start();
  }

  async addNetwork(network: string, data: any): Promise<void> {
    if (network === 'constellation') {
      // Add chain in Constellation dropdown.
      console.log('Constellation', data);
      // Switch chain in Constellation
    }

    if (network === 'ethereum') {
      // Add chain in Ethereum dropdown.
      console.log('Ethereum', data);
      const provider = data?.rpcUrl && new ethers.providers.JsonRpcProvider(data?.rpcUrl);
      // We're catching this Promise in AddNetwork.container.tsx
      await provider._networkPromise;
      // Here I'm connected to the RPC Provider.

      const customNetworkId = generateId(data.chainName);
      const chainId = parseInt(data.chainId, 10);
      // TODO-349: Check all fields
      const customNetwork: ICustomNetworkObject = {
        id: customNetworkId,
        value: customNetworkId,
        label: data.chainName,
        explorer: data.blockExplorerUrl,
        chainId,
        rpcEndpoint: data.rpcUrl,
        explorerAPI: '',
        nativeToken: 'ETH',
        mainnet: 'mainnet',
        network: 'Ethereum',
      };
      console.log('customNetwork', customNetwork);

      store.dispatch(addCustomNetwork({ network, data: customNetwork }));

      // this.account.networkController.ethereumNetwork.setChain();

      // Switch chain in NetworkController (ethereumProvider)
    }
  }

  setWalletPassword(password: string): void {
    this.keyringManager.setPassword(password);
  }

  getEncryptedVault() {
    store.dispatch<any>(getHasEncryptedVault());
  }

  logOut(): void {
    this.keyringManager.logout();
    this.account.networkController = undefined;
    store.dispatch(setUnlocked(false));
    store.dispatch(changeActiveWallet(null));
    store.dispatch(setVaultInfo({ wallets: [], isUnlocked: false }));
    store.dispatch(setAutoLogin(false));
  }
}

export default new WalletController();
