import EVMChainController from './EVMChainController';
import { ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } from 'utils/envUtil';
import { AllChainsIds, EthChainId, PolygonChainId } from './EVMChainController/types';
import { BigNumber, Wallet } from 'ethers';
import store from 'state/store';

class NetworkController {

  private privateKey: string;
  
  #ethereumNetwork: EVMChainController;
  #polygonNetwork: EVMChainController;

  constructor(privateKey: string) {
    const { activeNetwork } = store.getState().vault;
    this.privateKey = privateKey;
    this.#ethereumNetwork = this.createEVMController(activeNetwork.Ethereum, ETHERSCAN_API_KEY);
    this.#polygonNetwork = this.createEVMController(activeNetwork.Polygon, POLYGONSCAN_API_KEY);
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

  switchEthereumChain(chain: EthChainId) {
    this.#ethereumNetwork.setChain(chain);
  }

  switchPolygonChain(chain: PolygonChainId) {
    this.#polygonNetwork.setChain(chain);
  }

  // TODO-349: Add logic to check provider before calling the method.
  getAddress(): string {
    return this.#ethereumNetwork.getAddress();
  }

  getWallet(): Wallet {
    return this.#ethereumNetwork.getWallet();
  }

  validateAddress(address: string): boolean {
    return this.#ethereumNetwork.validateAddress(address);
  }

  createERC20Contract(address: string) {
    return this.#ethereumNetwork.createERC20Contract(address);
  }

  async estimateGas(from: string, to: string, data: string) {
    return this.#ethereumNetwork.estimateGas(from, to, data);
  }

  async getTokenInfo(address: string) {
    return this.#ethereumNetwork.getTokenInfo(address);
  }

  async estimateGasPrices() {
    return this.#ethereumNetwork.estimateGasPrices();
  }

  async getTransactions() {
    return this.#ethereumNetwork.getTransactions();
  }

  async estimateTokenTransferGasLimit(recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) {
    return this.#ethereumNetwork.estimateTokenTransferGasLimit(recipient, contractAddress, txAmount, defaultValue);
  }

  async transfer(txOptions: any) {
    return this.#ethereumNetwork.transfer(txOptions);
  }

}

export default NetworkController;
