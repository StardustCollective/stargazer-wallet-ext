import EVMChainController from './EVMChainController';
import { ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, SNOWTRACE_API_KEY } from 'utils/envUtil';
import { AllChainsIds, AvalancheChainId, EthChainId, PolygonChainId } from './EVMChainController/types';
import { BigNumber, Wallet } from 'ethers';
import store from 'state/store';
import { TxHistoryParams } from './ChainsController';
import { getNetworkFromChainId } from './EVMChainController/utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

class NetworkController {

  private privateKey: string;
  
  #ethereumNetwork: EVMChainController;
  #polygonNetwork: EVMChainController;
  // TODO-349: Only Polygon and AVAX
  // #bscNetwork: EVMChainController;
  #avalancheNetwork: EVMChainController;

  constructor(privateKey: string) {
    const { activeNetwork } = store.getState().vault;
    this.privateKey = privateKey;
    this.#ethereumNetwork = this.createEVMController(activeNetwork.Ethereum, ETHERSCAN_API_KEY);
    this.#polygonNetwork = this.createEVMController(activeNetwork.Polygon, POLYGONSCAN_API_KEY);
    // this.#bscNetwork = this.createEVMController(activeNetwork.BSC, BSCSCAN_API_KEY);
    this.#avalancheNetwork = this.createEVMController(activeNetwork.Avalanche, SNOWTRACE_API_KEY);
  }

  private createEVMController(chain: AllChainsIds, apiKey: string) {
    return new EVMChainController({ 
      chain, 
      privateKey: this.privateKey, 
      etherscanApiKey: apiKey
    });
  }

  get ethereumNetwork() {
    return this.#ethereumNetwork;
  }

  get polygonNetwork() {
    return this.#polygonNetwork;
  }

  // get bscNetwork() {
  //   return this.#bscNetwork;
  // }

  get avalancheNetwork() {
    return this.#avalancheNetwork;
  }

  switchEthereumChain(chain: EthChainId) {
    this.#ethereumNetwork.setChain(chain);
  }

  switchPolygonChain(chain: PolygonChainId) {
    this.#polygonNetwork.setChain(chain);
  }

  // switchBSCChain(chain: BSCChainId) {
  //   this.#bscNetwork.setChain(chain);
  // }

  switchAvalancheChain(chain: AvalancheChainId) {
    this.#avalancheNetwork.setChain(chain);
  }

  private getProviderByActiveAsset(): EVMChainController {
    const assets = store.getState().assets;
    const { activeAsset } = store.getState().vault;
    if (!activeAsset) throw new Error('No active asset');
    const activeAssetInfo = assets[activeAsset.id];
    const network = getNetworkFromChainId(activeAssetInfo.network);
    const networkToProvider = {
      [KeyringNetwork.Ethereum]: this.#ethereumNetwork,
      'Polygon': this.#polygonNetwork,
      // 'BSC': this.#bscNetwork,
      'Avalanche': this.#avalancheNetwork,
    }
    return networkToProvider[network as keyof typeof networkToProvider];
  }

  // TODO-349: Check if getProviderByActiveAsset is fine in all scenarios

  public getNetwork() {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getNetwork - provider not found.');
    }
    return provider.getNetwork();
  }

  public getExplorerURL() { 
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getExplorerUrl - provider not found.');
    }
    return provider.getExplorerUrl();
  }

  public getAddress(): string {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getAddress - provider not found.');
    }
    return provider.getAddress();
  }

  public getWallet(): Wallet {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getWallet - provider not found.');
    }
    return provider.getWallet();
  }

  validateAddress(address: string): boolean {
    return this.#ethereumNetwork.validateAddress(address);
  }

  createERC20Contract(address: string) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: createERC20Contract - provider not found.');
    }
    return provider.createERC20Contract(address);
  }

  async estimateGas(from: string, to: string, data: string) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: estimateGas - provider not found.');
    }
    return provider.estimateGas(from, to, data);
  }

  public async getTokenInfo(address: string, chainId?: string) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getTokenInfo - provider not found.');
    }
    if (!!chainId) {
      const network = getNetworkFromChainId(chainId);
      const networkToProvider = {
        [KeyringNetwork.Ethereum]: this.#ethereumNetwork,
        'Polygon': this.#polygonNetwork,
        // 'BSC': this.#bscNetwork,
        'Avalanche': this.#avalancheNetwork,
      }
      provider = networkToProvider[network as keyof typeof networkToProvider];
    }
    return provider.getTokenInfo(address);
  }

  async estimateGasPrices() {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: estimateGasPrices - provider not found.');
    }
    return provider.estimateGasPrices();
  }

  async getTransactions(params?: TxHistoryParams) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getTransactions - provider not found.');
    }
    return provider.getTransactions(params);
  }

  async waitForTransaction(hash: string) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: waitForTransaction - provider not found.');
    }
    return provider.waitForTransaction(hash);
  }

  async estimateTokenTransferGasLimit(recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: estimateTokenTransferGasLimit - provider not found.');
    }
    return provider.estimateTokenTransferGasLimit(recipient, contractAddress, txAmount, defaultValue);
  }

  async transfer(txOptions: any) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: transfer - provider not found.');
    }
    return provider.transfer(txOptions);
  }

}

export default NetworkController;
