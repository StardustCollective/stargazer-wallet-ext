import { dag4 } from '@stardust-collective/dag4';
import { KeyringManager, KeyringNetwork, KeyringVaultState, KeyringWalletState } from '@stardust-collective/dag4-keyring';
import filter from 'lodash/filter';

import { DAG_NETWORK } from 'constants/index';

import { ProtocolProvider, StargazerChain } from 'scripts/common';
import StargazerRpcProvider from 'scripts/Provider/evm/StargazerRpcProvider';

import { setUnlocked } from 'state/auth';
import { setAutoLogin } from 'state/biometrics';
import store from 'state/store';
import { addBitfiWallet, addCustomNetwork, addCypherockWallet, addLedgerWallet, changeActiveNetwork, changeCurrentEVMNetwork, getHasEncryptedVault, setVaultInfo, updateWallets } from 'state/vault';
import { type ICustomNetworkObject, type IVaultWalletsStoreState, Network } from 'state/vault/types';

import { isNative } from 'utils/envUtil';
import { BITFI_WALLET_LABEL, BITFI_WALLET_PREFIX, CYPHEROCK_WALLET_LABEL, CYPHEROCK_WALLET_PREFIX, HardwareWallet, isBitfi, isCypherock, isHardware, isLedger, LEDGER_WALLET_LABEL, LEDGER_WALLET_PREFIX } from 'utils/hardware';
import { getEncryptor } from 'utils/keyringManagerUtils';

import { updateAndNotify } from '../handlers/handleStoreSubscribe';
import { KeystoreToKeyringHelper } from '../helpers/keystoreToKeyringHelper';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import { DappMessage, DappMessageEvent, MessageType } from '../messaging/types';

import { generateId } from './EVMChainController/utils';
import { AccountController } from './AccountController';
import NFTController, { INFTController } from './NFTController';
import SwapController, { ISwapController } from './SwapController';

// Constants
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
        if (state.isUnlocked) {
          if (vault && vault.activeWallet) {
            await this.switchWallet(vault.activeWallet.id, vault.activeWallet.label);
          } else if (state.wallets.length) {
            await this.switchWallet(state.wallets[0].id, state.wallets[0].label);
          }
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

  async importSingleAccount(label: string, network: KeyringNetwork, privateKey: string, silent?: boolean): Promise<string> {
    const wallet = await this.keyringManager.createSingleAccountWallet(label, network, privateKey);

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
    const allWallets = [...wallets.local, ...wallets.ledger, ...wallets.bitfi, ...wallets.cypherock];

    for (let i = 0; i < allWallets.length; i++) {
      const { accounts } = allWallets[i];
      for (let j = 0; j < accounts.length; j++) {
        const account = accounts[j];
        if (account.address === address) return true;
      }
    }

    return false;
  }

  private getNextHardwareWalletId = (wallets: any, prefix: string): number => {
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

  async importHardwareWalletAccounts(hardwareWallets: HardwareWallet[]): Promise<void> {
    for (let i = 0; i < hardwareWallets.length; i++) {
      const state = store.getState();
      const { vault } = state;
      const { wallets } = vault;
      const hardwareWallet = hardwareWallets[i];

      let wallet;
      let prefix;
      let label;
      let defaultLabel;
      let addWalletAction;
      let supportedAssets;
      let accounts;
      let isDuplicate = false;

      if (isLedger(hardwareWallet.type)) {
        wallet = wallets.ledger;
        prefix = LEDGER_WALLET_PREFIX;
        defaultLabel = LEDGER_WALLET_LABEL;
        addWalletAction = addLedgerWallet;
        supportedAssets = hardwareWallet.supportedAssets;
        accounts = hardwareWallet.accounts;
        isDuplicate = this.checkForDuplicateWallet(accounts[0].address);
      } else if (isBitfi(hardwareWallet.type)) {
        wallet = wallets.bitfi;
        prefix = BITFI_WALLET_PREFIX;
        defaultLabel = BITFI_WALLET_LABEL;
        addWalletAction = addBitfiWallet;
        supportedAssets = hardwareWallet.supportedAssets;
        accounts = hardwareWallet.accounts;
        isDuplicate = this.checkForDuplicateWallet(accounts[0].address);
      } else if (isCypherock(hardwareWallet.type)) {
        wallet = wallets.cypherock;
        prefix = CYPHEROCK_WALLET_PREFIX;
        label = hardwareWallet.label;
        defaultLabel = CYPHEROCK_WALLET_LABEL;
        addWalletAction = addCypherockWallet;
        supportedAssets = hardwareWallet.supportedAssets;
        accounts = hardwareWallet.accounts;
        isDuplicate = this.checkForDuplicateWallet(accounts[0].address) || this.checkForDuplicateWallet(accounts[1].address);
      } else {
        console.warn('Unknown hardware wallet type:', hardwareWallet.type);
        continue;
      }

      if (isDuplicate) {
        throw new Error('Wallet address already exists');
      }

      // Determine the next ID for the wallet type.
      const id: number = this.getNextHardwareWalletId(wallet, prefix);

      const newWallet = {
        id: `${prefix}${id}`,
        bipIndex: hardwareWallet.bipIndex,
        cypherockId: hardwareWallet.cypherockId,
        label: label || `${defaultLabel} ${id}`,
        type: hardwareWallet.type,
        accounts,
        supportedAssets,
      };

      if (addWalletAction) {
        await store.dispatch(addWalletAction(newWallet));
      }

      if (i === ACCOUNT_ITEMS_FIRST_INDEX) {
        this.switchWallet(newWallet.id);
      }
    }
  }

  async deleteWallet(wallet: KeyringWalletState): Promise<void> {
    const { vault } = store.getState();
    const { wallets } = vault;
    const { local, bitfi, ledger, cypherock } = wallets;

    let newWalletState: IVaultWalletsStoreState = {
      local: [],
      ledger: [],
      bitfi: [],
      cypherock: [],
    };
    let newLocalState = [...local];
    let newLedgerState = [...ledger];
    let newBitfiState = [...bitfi];
    let newCypherockState = [...cypherock];

    if (isLedger(wallet.type)) {
      newLedgerState = filter(newLedgerState, w => w.id !== wallet.id);
    } else if (isBitfi(wallet.type)) {
      newBitfiState = filter(newBitfiState, w => w.id !== wallet.id);
    } else if (isCypherock(wallet.type)) {
      newCypherockState = filter(newCypherockState, w => w.id !== wallet.id);
    } else {
      newLocalState = filter(newLocalState, w => w.id !== wallet.id);
    }

    newWalletState = {
      local: [...newLocalState],
      ledger: [...newLedgerState],
      bitfi: [...newBitfiState],
      cypherock: [...newCypherockState],
    };

    const newAllWallets = [...newWalletState.local, ...newWalletState.ledger, ...newWalletState.bitfi, ...newWalletState.cypherock];

    if (vault && vault.activeWallet && vault.activeWallet.id === wallet.id) {
      if (newAllWallets.length) {
        await this.switchWallet(newAllWallets[0].id);
      }
    }

    store.dispatch(updateWallets({ wallets: newWalletState }));

    if (!isHardware(wallet.type)) {
      await this.keyringManager.removeWalletById(wallet.id);
    }
  }

  async switchWallet(id: string, label?: string): Promise<void> {
    // Stop all existing operations first
    this.account.assetsBalanceMonitor.stop();
    // Build account info
    this.account.buildAccountAssetInfo(id, label);
    try {
      // Start operations sequentially with proper error handling
      Promise.all([this.account.assetsBalanceMonitor.start(), this.account.getLatestTxUpdate(), this.account.txController.startMonitor(), this.nfts.fetchAllNfts()]);
    } catch (err) {
      // Ensure monitor is still started even if other operations fail
      this.account.assetsBalanceMonitor.start();
    }
  }

  async switchNetwork(network: string, chainId: string): Promise<void> {
    console.log(`${network} - ${chainId}`);
    this.account.assetsBalanceMonitor.stop();

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

    const EVM_CHAINS = [KeyringNetwork.Ethereum, Network.Avalanche, Network.BSC, Network.Polygon, Network.Base, Network.Ink];

    if (EVM_CHAINS.includes(network as KeyringNetwork | Network)) {
      this.account.networkController.switchChain(network, chainId);
      store.dispatch(changeCurrentEVMNetwork(chainId));
      provider = ProtocolProvider.ETHEREUM;
    }

    store.dispatch(changeActiveNetwork({ network, chainId }));
    // Manually trigger state update
    await updateAndNotify();

    if (!isNative) {
      const message: DappMessage = {
        type: MessageType.dapp,
        event: DappMessageEvent.chainChanged,
        payload: { provider, network, chainId },
      };

      await chrome.runtime.sendMessage(message);
    }

    // restart monitor with different network
    setTimeout(() => {
      if (EVM_CHAINS.includes(network as KeyringNetwork | Network)) {
        // Update NFTs list if any EVM chain has changed.
        this.nfts.fetchAllNfts();
      }
      this.account.assetsBalanceMonitor.start();
    }, 100);
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
      const provider = data?.rpcUrl && new StargazerRpcProvider(data?.rpcUrl);
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
        explorerID: '',
        nativeToken: 'ETH',
        mainnet: 'mainnet',
        network: 'Ethereum',
        networkId: StargazerChain.ETHEREUM,
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
    this.account.assetsBalanceMonitor.stop();
    this.keyringManager.logout();
    this.account.networkController = undefined;
    store.dispatch(setUnlocked(false));
    store.dispatch(setAutoLogin(false));
  }
}

export default new WalletController();
