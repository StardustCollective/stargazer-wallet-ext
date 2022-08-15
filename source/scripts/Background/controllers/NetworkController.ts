import EVMChainController from './EVMChainController';
import { BSCSCAN_API_KEY, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY, SNOWTRACE_API_KEY,  } from 'utils/envUtil';
import { AllChainsIds, AvalancheChainId, BSCChainId, EthChainId, PolygonChainId } from './EVMChainController/types';
import { BigNumber, Wallet } from 'ethers';
import store from 'state/store';
import { TxHistoryParams } from './ChainsController';
import { getNetworkFromChainId } from './EVMChainController/utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

class NetworkController {

  private privateKey: string;
  
  #ethereumNetwork: EVMChainController;
  #polygonNetwork: EVMChainController;
  #bscNetwork: EVMChainController;
  #avalancheNetwork: EVMChainController;

  constructor(privateKey: string) {
    const { activeNetwork } = store.getState().vault;
    this.privateKey = privateKey;
    this.#ethereumNetwork = this.createEVMController(activeNetwork.Ethereum, ETHERSCAN_API_KEY);
    this.#polygonNetwork = this.createEVMController(activeNetwork.Polygon, POLYGONSCAN_API_KEY);
    this.#bscNetwork = this.createEVMController(activeNetwork.BSC, BSCSCAN_API_KEY);
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

  get bscNetwork() {
    return this.#bscNetwork;
  }

  get avalancheNetwork() {
    return this.#avalancheNetwork;
  }

  switchEthereumChain(chain: EthChainId) {
    this.#ethereumNetwork.setChain(chain);
  }

  switchPolygonChain(chain: PolygonChainId) {
    this.#polygonNetwork.setChain(chain);
  }

  switchBSCChain(chain: BSCChainId) {
    this.#bscNetwork.setChain(chain);
  }

  switchAvalancheChain(chain: AvalancheChainId) {
    this.#avalancheNetwork.setChain(chain);
  }

  private getProviderByActiveAsset(): EVMChainController {
    const assets = store.getState().assets;
    const { activeAsset } = store.getState().vault;
    const activeAssetInfo = assets[activeAsset.id];
    const network = getNetworkFromChainId(activeAssetInfo.network);
    // TODO-349: Add all chains here
    const networkToProvider = {
      [KeyringNetwork.Ethereum]: this.#ethereumNetwork,
      'Polygon': this.#polygonNetwork,
      'BSC': this.#bscNetwork,
      'Avalanche': this.#avalancheNetwork,
    }
    return networkToProvider[network as keyof typeof networkToProvider];
  }

  // TODO-349: Check if getProviderByActiveAsset is fine in all scenarios

  getNetwork() {
    return this.getProviderByActiveAsset().getNetwork();
  }

  getExplorerURL() {
    return this.getProviderByActiveAsset().getExplorerUrl();
  }

  getAddress(): string {
    return this.getProviderByActiveAsset().getAddress();
  }

  getWallet(): Wallet {
    return this.getProviderByActiveAsset().getWallet();
  }

  validateAddress(address: string): boolean {
    return this.getProviderByActiveAsset().validateAddress(address);
  }

  createERC20Contract(address: string) {
    return this.getProviderByActiveAsset().createERC20Contract(address);
  }

  async estimateGas(from: string, to: string, data: string) {
    return this.getProviderByActiveAsset().estimateGas(from, to, data);
  }

  async getTokenInfo(address: string, chainId?: string) {
    let provider = this.getProviderByActiveAsset();
    if (!!chainId) {
      const network = getNetworkFromChainId(chainId);
      const networkToProvider = {
        [KeyringNetwork.Ethereum]: this.#ethereumNetwork,
        'Polygon': this.#polygonNetwork,
        'BSC': this.#bscNetwork,
        'Avalanche': this.#avalancheNetwork,
      }
      provider = networkToProvider[network as keyof typeof networkToProvider];
    }
    return provider.getTokenInfo(address);
  }

  async estimateGasPrices() {
    return this.getProviderByActiveAsset().estimateGasPrices();
  }

  async getTransactions(params?: TxHistoryParams) {
    return this.getProviderByActiveAsset().getTransactions(params);
  }

  async waitForTransaction(hash: string) {
    return this.getProviderByActiveAsset().waitForTransaction(hash);
  }

  async estimateTokenTransferGasLimit(recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) {
    return this.getProviderByActiveAsset().estimateTokenTransferGasLimit(recipient, contractAddress, txAmount, defaultValue);
  }

  async transfer(txOptions: any) {
    return this.getProviderByActiveAsset().transfer(txOptions);
  }

}

export default NetworkController;
