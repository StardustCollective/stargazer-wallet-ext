import EVMChainController from './EVMChainController';
import { ETHERSCAN_API_KEY } from 'utils/envUtil';
import { AllChainsIds, EthChainId, PolygonChainId } from './EVMChainController/types';

class NetworkController {

  private privateKey: string;
  
  #ethereumNetwork: EVMChainController;
  #polygonNetwork: EVMChainController;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
    this.#ethereumNetwork = this.createEVMController('mainnet', ETHERSCAN_API_KEY);
    this.#polygonNetwork = this.createEVMController('matic', ETHERSCAN_API_KEY);
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

}

export default NetworkController;
