import ERC_20_ABI from 'erc-20-abi';
import { BigNumber, ethers } from 'ethers';
import { baseAmount, BaseAmount, assetToString, AssetETH } from '@xchainjs/xchain-util';
import { EtherscanProvider, getDefaultProvider } from '@ethersproject/providers';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import { parseUnits, toUtf8Bytes } from 'ethers/lib/utils';
import { 
  BASE_TOKEN_GAS_COST, 
  ETHAddress, 
  ETH_DECIMAL, 
  InfuraProvider, 
  SIMPLE_GAS_COST 
} from './constants';
import { 
  getDefaultGasPrices,
  getNetworkInfo,
  getTokenAddress,
  validateAddress 
} from './utils';
import { 
  EthChainControllerParams,
  FeesParamsEth,
  IEthChainController, 
  InfuraCreds, 
  EthereumNetwork, 
  TxOverrides,
  EthNetworkId
} from './types';
import { Address, FeeOptionKey, TxHistoryParams, TxParams } from '../ChainsController';
import { getETHTransactionHistory, getGasOracle, getTokenTransactionHistory } from './etherscanApi';
import { GasOracleResponse } from './etherscanApi.types';

class EthChainController implements IEthChainController {
  private network: EthereumNetwork;
  private address: Address | null = null;
  private wallet: ethers.Wallet | null = null;
  private provider: Provider;
  private etherscan: EtherscanProvider;
  private etherscanApiKey?: string;
  private infuraCreds: InfuraCreds | null = null;
  private infuraProjectId: string;

  constructor({ network, privateKey, etherscanApiKey, infuraCreds }: EthChainControllerParams) {
    this.network = getNetworkInfo(network);
    this.etherscanApiKey = etherscanApiKey;
    this.etherscan = new EtherscanProvider(this.network.value, this.etherscanApiKey);

    if (infuraCreds) {
      if (infuraCreds.projectId) {
        this.infuraProjectId = infuraCreds.projectId;
      }
      this.infuraCreds = infuraCreds;
      this.provider = infuraCreds.projectSecret
        ? new ethers.providers.InfuraProvider(this.network.value, infuraCreds)
        : new ethers.providers.InfuraProvider(this.network.value, infuraCreds.projectId);
    } else {
      this.provider = getDefaultProvider(this.network.value);
    }

    this.changeWallet(new ethers.Wallet(privateKey, this.getProvider()));
  }

  // Public methods

  purgeClient() {
    this.address = null;
    this.wallet = null;
  }

  getAddress() {
    if (!this.address) {
      throw new Error('Address is not defined');
    }
    return this.address;
  }

  getNetwork() {
    if (!this.network) {
      throw new Error('Network is not defined');
    }
    return this.network;
  }

  getWallet() {
    if (!this.wallet) {
      throw new Error('Wallet is not defined');
    }
    return this.wallet;
  }

  getExplorerUrl = (): string => {
    return this.network.etherscan;
  }

  setNetwork(network: EthNetworkId) {
    if (!network) {
      throw new Error('Network must be provided');
    } else {
      this.network = getNetworkInfo(network);

      if (this.infuraCreds) {
        if (this.infuraCreds.projectId) {
          this.infuraProjectId = this.infuraCreds.projectId;
        }
        this.provider = this.infuraCreds.projectSecret
          ? new ethers.providers.InfuraProvider(this.network.value, this.infuraCreds)
          : new ethers.providers.InfuraProvider(this.network.value, this.infuraCreds.projectId);
      } else {
        this.provider = getDefaultProvider(this.network.value);
      }

      this.etherscan = new EtherscanProvider(this.network.value, this.etherscanApiKey);
    }
  }

  validateAddress(address: Address) {
    return validateAddress(address);
  }

  async transfer({
    asset,
    memo,
    amount,
    recipient,
    feeOptionKey,
    gasPrice,
    gasLimit,
    nonce,
  }: TxParams & {
    feeOptionKey?: FeeOptionKey;
    gasPrice?: BaseAmount;
    gasLimit?: BigNumber;
    nonce: string;
  }): Promise<TransactionResponse> {
    try {
      const txAmount = BigNumber.from(amount.amount().toFixed());

      let assetAddress;
      if (asset && assetToString(asset) !== assetToString(AssetETH)) {
        assetAddress = getTokenAddress(asset);
      }

      const isETHAddress = assetAddress === ETHAddress;

      // feeOptionKey

      const defaultGasLimit: BigNumber = isETHAddress ? SIMPLE_GAS_COST : BASE_TOKEN_GAS_COST;

      let overrides: TxOverrides = {
        gasLimit: gasLimit || defaultGasLimit,
        gasPrice: gasPrice && BigNumber.from(gasPrice.amount().toFixed()),
      }

      // override `overrides` if `feeOptionKey` is provided
      if (feeOptionKey) {
        const gasPrice = await this.estimateGasPrices()
          .then((prices) => prices[feeOptionKey])
          .catch(() => getDefaultGasPrices()[feeOptionKey]);
        const gasLimit = await this.estimateGasLimit({ asset, recipient, amount, memo }).catch(() => defaultGasLimit);

        overrides = {
          gasLimit,
          gasPrice: BigNumber.from(gasPrice.amount().toFixed()),
        }
      }

      let txResult;
      if (assetAddress && !isETHAddress) {
        // Transfer ERC20
        txResult = await this.call<TransactionResponse>(assetAddress, ERC_20_ABI, 'transfer', [
          recipient,
          txAmount,
          Object.assign({}, { ...overrides, nonce }),
        ])
      } else {
        // Transfer ETH
        const transactionRequest = Object.assign(
          { to: recipient, value: txAmount, nonce },
          {
            ...overrides,
            data: memo ? toUtf8Bytes(memo) : undefined,
          },
        )

        txResult = await this.getWallet().sendTransaction(transactionRequest);
      }

      return txResult;
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getTokenInfo(address: string, chainId = 1) {
    if (this.isValidEthereumAddress(address)) {
      const infuraProvider = new InfuraProvider(chainId, this.infuraProjectId);
      try {
        return tokenContractHelper.getTokenInfo(infuraProvider, address);
      }
      catch(e) {
        console.log('ERROR: getTokenInfo = ', e);
        return null;
      }
    }
    return null;
  }

  async getTransactions(params?: TxHistoryParams) {
    try {
      const address = params?.address || this.getAddress();
      const page = params?.offset || 1;
      const offset = params?.limit;
      const assetAddress = params?.asset;

      let transations;
      if (assetAddress) {
        transations = await getTokenTransactionHistory({
          baseUrl: this.etherscan.baseUrl,
          address,
          assetAddress,
          page,
          offset,
          apiKey: this.etherscan.apiKey,
        });
      } else {
        transations = await getETHTransactionHistory({
          baseUrl: this.etherscan.baseUrl,
          address,
          page,
          offset,
          apiKey: this.etherscan.apiKey,
        });
      }

      return {
        total: transations.length,
        txs: transations,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async estimateGasPrices() {
    if(this.network.value !== 'homestead'){
      // Etherscan gas oracle is not working in testnets
      const oneGwei = ethers.BigNumber.from(1e9);
      const feeData = await this.provider.getFeeData()
      return{
        average: baseAmount(feeData.gasPrice.toString(), ETH_DECIMAL),
        fast: baseAmount(feeData.gasPrice.add(oneGwei.mul(5)).toString(), ETH_DECIMAL),
        fastest: baseAmount(feeData.gasPrice.add(oneGwei.mul(10)).toString(), ETH_DECIMAL),
      }
    }

    try {
      const response: GasOracleResponse = await getGasOracle(this.etherscan.baseUrl, this.etherscan.apiKey)

      // Convert result of gas prices: `Gwei` -> `Wei`
      const averageWei = parseUnits(response.SafeGasPrice, 'gwei')
      const fastWei = parseUnits(response.ProposeGasPrice, 'gwei')
      const fastestWei = parseUnits(response.FastGasPrice, 'gwei')

      return {
        average: baseAmount(averageWei.toString(), ETH_DECIMAL),
        fast: baseAmount(fastWei.toString(), ETH_DECIMAL),
        fastest: baseAmount(fastestWei.toString(), ETH_DECIMAL),
      }
    } catch (error) {
      throw new Error(`Failed to estimate gas price: ${error}`);
    }
  }

  async waitForTransaction (hash: string, chainId = 1) {
    const infuraProvider = new InfuraProvider(chainId, this.infuraProjectId);
    return infuraProvider.waitForTransaction(hash);
  }

  async estimateTokenTransferGasLimit(recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) {
    try {
      const contract = new ethers.Contract(contractAddress, ERC_20_ABI, this.getProvider());
      const gasLimit: BigNumber = await contract.estimateGas.transfer(recipient, txAmount, { from: this.getAddress() });
      return gasLimit.toNumber();
    }
    catch(e) {
      return defaultValue;
    }
  }

  // Private methods

  private changeWallet(wallet: ethers.Wallet): void {
    this.wallet = wallet;
    this.address = wallet.address.toLowerCase();
  }

  private getProvider(): Provider {
    return this.provider;
  }

  private isValidEthereumAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  private async estimateGasLimit({ asset, recipient, amount, memo }: FeesParamsEth): Promise<BigNumber> {
    try {
      const txAmount = BigNumber.from(amount.amount().toFixed())

      let assetAddress
      if (asset && assetToString(asset) !== assetToString(AssetETH)) {
        assetAddress = getTokenAddress(asset)
      }

      let estimate

      if (assetAddress && assetAddress !== ETHAddress) {
        // ERC20 gas estimate
        const contract = new ethers.Contract(assetAddress, ERC_20_ABI, this.provider)

        estimate = await contract.estimateGas.transfer(recipient, txAmount, {
          from: this.getAddress(),
        })
      } else {
        // ETH gas estimate
        const transactionRequest = {
          from: this.getAddress(),
          to: recipient,
          value: txAmount,
          data: memo ? toUtf8Bytes(memo) : undefined,
        }

        estimate = await this.provider.estimateGas(transactionRequest)
      }

      return estimate;
    } catch (error) {
      return Promise.reject(new Error(`Failed to estimate gas limit: ${error}`))
    }
  }

  private async call<T>(address: Address, abi: ethers.ContractInterface, func: string, params: Array<any>): Promise<T> {
    if (!address) {
      return Promise.reject(new Error('address must be provided'));
    }
    const contract = new ethers.Contract(address, abi, this.provider).connect(this.getWallet());
    return contract[func](...params);
  }
}

export default EthChainController;