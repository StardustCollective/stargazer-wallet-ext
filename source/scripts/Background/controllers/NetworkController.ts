import EVMChainController from './EVMChainController';
import {
  BSCSCAN_API_KEY,
  ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  SNOWTRACE_API_KEY,
} from 'utils/envUtil';
import {
  AllChainsIds,
  AvalancheChainId,
  BSCChainId,
  EthChainId,
  PolygonChainId,
} from './EVMChainController/types';
import { BigNumber, Wallet } from 'ethers';
import store from 'state/store';
import { TxHistoryParams } from './ChainsController';
import { getNetworkFromChainId } from './EVMChainController/utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { initialState as initialStateAssets } from 'state/assets';
import { ITempNFTInfo } from 'state/nfts/types';
import { AssetType } from 'state/vault/types';

class NetworkController {
  // 349: New network should be added here.
  #ethereumNetwork: EVMChainController;
  #polygonNetwork: EVMChainController;
  #bscNetwork: EVMChainController;
  #avalancheNetwork: EVMChainController;

  constructor(privateKey: string) {
    const { activeNetwork } = store.getState().vault;
    this.#ethereumNetwork = this.createEVMController(
      activeNetwork.Ethereum,
      privateKey,
      ETHERSCAN_API_KEY
    );
    this.#polygonNetwork = this.createEVMController(
      activeNetwork.Polygon,
      privateKey,
      POLYGONSCAN_API_KEY
    );
    this.#bscNetwork = this.createEVMController(
      activeNetwork.BSC,
      privateKey,
      BSCSCAN_API_KEY
    );
    this.#avalancheNetwork = this.createEVMController(
      activeNetwork.Avalanche,
      privateKey,
      SNOWTRACE_API_KEY
    );
  }

  private createEVMController(chain: AllChainsIds, privateKey: string, apiKey: string) {
    return new EVMChainController({
      chain,
      privateKey,
      etherscanApiKey: apiKey,
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

  switchChain(network: string, chain: string) {
    switch (network) {
      case 'Ethereum':
        this.switchEthereumChain(chain as EthChainId);
        break;
      case 'Polygon':
        this.switchPolygonChain(chain as PolygonChainId);
        break;
      case 'BSC':
        this.switchBSCChain(chain as BSCChainId);
        break;
      case 'Avalanche':
        this.switchAvalancheChain(chain as AvalancheChainId);
        break;

      default:
        throw new Error('Unable to switch chain. Chain not found');
    }
  }

  public getProviderByNetwork(network: string): EVMChainController {
    const networkToProvider: { [net: string]: EVMChainController } = {
      Ethereum: this.#ethereumNetwork,
      Polygon: this.#polygonNetwork,
      BSC: this.#bscNetwork,
      Avalanche: this.#avalancheNetwork,
    };
    return networkToProvider[network];
  }

  private getProviderByActiveAsset(): EVMChainController {
    const assets = store.getState().assets;
    const { activeAsset } = store.getState().vault;
    const UNSUPPORTED_TYPES = [AssetType.Constellation];
    if (!activeAsset || UNSUPPORTED_TYPES.includes(activeAsset.type))
      throw new Error('No active asset');
    const activeAssetInfo = assets[activeAsset.id] || initialStateAssets[activeAsset.id];
    const network = getNetworkFromChainId(activeAssetInfo.network);
    const networkToProvider: { [net: string]: EVMChainController } = {
      Ethereum: this.#ethereumNetwork,
      Polygon: this.#polygonNetwork,
      BSC: this.#bscNetwork,
      Avalanche: this.#avalancheNetwork,
    };
    return networkToProvider[network];
  }

  // TODO-349: Check if getProviderByActiveAsset is fine in all scenarios

  public getNetwork() {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: getNetwork - provider not found.');
      return null;
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

  transferNFT(nft: ITempNFTInfo, network: string) {
    let provider;
    try {
      provider = this.getProviderByNetwork(network);
    } catch (err) {
      console.log('Error: transferNFT - provider not found.');
    }
    return provider.transferNFT(nft);
  }

  getERC1155Balance(
    contractAddress: string,
    userAddress: string,
    tokenIds: string[],
    network: string
  ) {
    let provider;
    try {
      provider = this.getProviderByNetwork(network);
    } catch (err) {
      console.log('Error: createERC721Contract - provider not found.');
    }
    return provider.getERC1155Balance(contractAddress, userAddress, tokenIds);
  }

  createERC721Contract(address: string, network: string) {
    let provider;
    try {
      provider = this.getProviderByNetwork(network);
    } catch (err) {
      console.log('Error: createERC721Contract - provider not found.');
    }
    return provider.createERC721Contract(address);
  }

  createERC1155Contract(address: string, network: string) {
    let provider;
    try {
      provider = this.getProviderByNetwork(network);
    } catch (err) {
      console.log('Error: createERC1155Contract - provider not found.');
    }
    return provider.createERC1155Contract(address);
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
        Polygon: this.#polygonNetwork,
        BSC: this.#bscNetwork,
        Avalanche: this.#avalancheNetwork,
      };
      provider = networkToProvider[network as keyof typeof networkToProvider];
    }
    return provider.getTokenInfo(address);
  }

  async estimateGasPrices(network?: string) {
    let provider;
    try {
      provider = !!network
        ? this.getProviderByNetwork(network)
        : this.getProviderByActiveAsset();
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
    return provider?.waitForTransaction(hash);
  }

  async estimateTokenTransferGasLimit(
    recipient: string,
    contractAddress: string,
    txAmount: BigNumber,
    defaultValue?: number
  ) {
    let provider;
    try {
      provider = this.getProviderByActiveAsset();
    } catch (err) {
      console.log('Error: estimateTokenTransferGasLimit - provider not found.');
    }
    return provider.estimateTokenTransferGasLimit(
      recipient,
      contractAddress,
      txAmount,
      defaultValue
    );
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
