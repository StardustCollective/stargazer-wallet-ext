import ERC_20_ABI from 'erc-20-abi';
import { BigNumber, ethers } from 'ethers';
import { baseAmount, BaseAmount, assetToString, AssetETH } from '@xchainjs/xchain-util';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import { parseUnits, toUtf8Bytes } from 'ethers/lib/utils';
import {
  BASE_TOKEN_GAS_COST,
  ETHAddress,
  ETH_DECIMAL,
  SIMPLE_GAS_COST,
} from './constants';
import {
  getDefaultGasPrices,
  getChainInfo,
  getTokenAddress,
  validateAddress,
  isTestnet,
} from './utils';
import {
  EVMChainControllerParams,
  FeesParamsEth,
  IEVMChainController,
  IChain,
  TxOverrides,
  AllChainsIds,
} from './types';
import { Address, FeeOptionKey, TxHistoryParams, TxParams } from '../ChainsController';
import {
  getETHTransactionHistory,
  getGasOracle,
  getTokenTransactionHistory,
} from './etherscanApi';
import { GasOracleResponse } from './etherscanApi.types';
import erc20abi from 'utils/erc20.json';
import erc721abi from 'utils/erc721.json';
import erc1155abi from 'utils/erc1155.json';
import { ITempNFTInfo } from 'state/nfts/types';
import { AssetType } from 'state/vault/types';
import StargazerRpcProvider from 'scripts/Provider/evm/StargazerRpcProvider';

class EVMChainController implements IEVMChainController {
  private chain: IChain;
  private address: Address | null = null;
  private wallet: ethers.Wallet | null = null;
  private provider: StargazerRpcProvider;

  constructor({ chain, privateKey }: EVMChainControllerParams) {
    this.chain = getChainInfo(chain);
    this.provider = new StargazerRpcProvider(this.chain.rpcEndpoint);
    this.changeWallet(new ethers.Wallet(privateKey, this.provider));
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
    if (!this.chain) {
      throw new Error('Network is not defined');
    }
    return this.chain;
  }

  getWallet() {
    if (!this.wallet) {
      throw new Error('Wallet is not defined');
    }
    return this.wallet;
  }

  getExplorerUrl = (): string => {
    return this.chain.explorer;
  };

  setChain(chain: AllChainsIds | string) {
    if (!chain) {
      throw new Error('Chain must be provided');
    } else {
      this.chain = getChainInfo(chain);
      this.provider = new StargazerRpcProvider(this.chain.rpcEndpoint);
      this.wallet = this.wallet.connect(this.provider);
    }
  }

  validateAddress(address: Address) {
    return validateAddress(address);
  }

  createERC20Contract(address: Address) {
    return new ethers.Contract(address, erc20abi, this.provider);
  }

  createERC721Contract(address: Address) {
    return new ethers.Contract(address, erc721abi, this.provider).connect(
      this.getWallet()
    );
  }

  async getERC1155Balance(
    contractAddress: string,
    userAddress: string,
    tokenIds: string[]
  ): Promise<number[]> {
    try {
      const userAddresses: string[] = new Array(tokenIds.length).fill(userAddress);
      const balances = await this.call<BigNumber[]>(
        contractAddress,
        erc1155abi,
        'balanceOfBatch',
        [userAddresses, tokenIds]
      );

      return balances.map((balance) => balance.toNumber());
    } catch (err) {
      console.log('ERROR: getERC1155Balance', err);
      return [];
    }
  }

  createERC1155Contract(address: Address) {
    return new ethers.Contract(address, erc1155abi, this.provider).connect(
      this.getWallet()
    );
  }

  async transferNFT(tempNFT: ITempNFTInfo): Promise<string> {
    const { nft } = tempNFT;
    const isERC721 = nft.token_standard === AssetType.ERC721;
    const nftContract = tempNFT.nft.contract;
    const fromAddress = tempNFT.from.address;
    const toAddress = tempNFT.to;
    const tokenId = tempNFT.nft.identifier;
    const amount = tempNFT.quantity;
    const { price, limit } = tempNFT.gas;
    let overrides: TxOverrides = {
      gasLimit: BASE_TOKEN_GAS_COST,
    };

    if (!!price && !!limit) {
      // Increase gas limit by 30%
      const gasLimit = BigNumber.from(Math.floor(limit * 1.3));
      const gasPrice = ethers.utils.parseUnits(price.toString(), 'gwei');

      overrides = {
        gasLimit,
        gasPrice,
      };
    }

    const tx = isERC721
      ? await this.call<TransactionResponse>(nftContract, erc721abi, 'transferFrom', [
          fromAddress,
          toAddress,
          tokenId,
          { ...overrides },
        ])
      : await this.call<TransactionResponse>(
          nftContract,
          erc1155abi,
          'safeTransferFrom',
          [fromAddress, toAddress, tokenId, amount, '0x', { ...overrides }]
        );

    // Wait for 5 confirmations
    const CONFIRMATIONS = 5;
    await tx.wait(CONFIRMATIONS);

    return tx.hash;
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

      const defaultGasLimit: BigNumber = isETHAddress
        ? SIMPLE_GAS_COST
        : BASE_TOKEN_GAS_COST;

      let overrides: TxOverrides = {
        gasLimit: gasLimit || defaultGasLimit,
        gasPrice: gasPrice && BigNumber.from(gasPrice.amount().toFixed()),
      };

      // override `overrides` if `feeOptionKey` is provided
      if (feeOptionKey) {
        const gasPrice = await this.estimateGasPrices()
          .then((prices) => prices[feeOptionKey])
          .catch(() => getDefaultGasPrices()[feeOptionKey]);
        const gasLimit = await this.estimateGasLimit({
          asset,
          recipient,
          amount,
          memo,
        }).catch(() => defaultGasLimit);

        overrides = {
          gasLimit,
          gasPrice: BigNumber.from(gasPrice.amount().toFixed()),
        };
      }

      let txResult;
      // TODO-349: Check ERC-20 token transfer for Polygon, Avalanche, etc.
      if (assetAddress && !isETHAddress) {
        // Transfer ERC20
        txResult = await this.call<TransactionResponse>(
          assetAddress,
          ERC_20_ABI,
          'transfer',
          [recipient, txAmount, Object.assign({}, { ...overrides, nonce })]
        );
      } else {
        // Transfer ETH
        const transactionRequest = Object.assign(
          { to: recipient, value: txAmount, nonce },
          {
            ...overrides,
            data: memo ? toUtf8Bytes(memo) : undefined,
          }
        );

        txResult = await this.getWallet().sendTransaction(transactionRequest);
      }

      return txResult;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getTokenInfo(address: string) {
    if (this.isValidEthereumAddress(address)) {
      try {
        return tokenContractHelper.getTokenInfo(this.getProvider(), address);
      } catch (e) {
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
          explorerID: this.chain.explorerID,
          address,
          assetAddress,
          page,
          offset,
        });
      } else {
        transations = await getETHTransactionHistory({
          explorerID: this.chain.explorerID,
          address,
          page,
          offset,
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

  async estimateGas(from: string, to: string, data: string) {
    return this.provider.estimateGas({ from, to, data });
  }

  async estimateGasPrices() {
    // Snowtrace API doesn't support the gas tracker module yet (https://snowtrace.io/apis)
    // That's why we need to include Avalanche Mainnet here.
    if (isTestnet(this.chain.id) || this.chain.id === 'avalanche-mainnet') {
      // Etherscan gas oracle is not working in testnets
      const oneGwei = ethers.BigNumber.from(1e9);
      const feeData = await this.provider.getFeeData();
      return {
        average: baseAmount(feeData.gasPrice.toString(), ETH_DECIMAL),
        fast: baseAmount(feeData.gasPrice.add(oneGwei.mul(5)).toString(), ETH_DECIMAL),
        fastest: baseAmount(
          feeData.gasPrice.add(oneGwei.mul(10)).toString(),
          ETH_DECIMAL
        ),
      };
    }

    try {
      const response: GasOracleResponse = await getGasOracle(this.chain.explorerID);

      // Convert result of gas prices: `Gwei` -> `Wei`
      const averageWei = parseUnits(response.SafeGasPrice, 'gwei');
      const fastWei = parseUnits(response.ProposeGasPrice, 'gwei');
      const fastestWei = parseUnits(response.FastGasPrice, 'gwei');

      return {
        average: baseAmount(averageWei.toString(), ETH_DECIMAL),
        fast: baseAmount(fastWei.toString(), ETH_DECIMAL),
        fastest: baseAmount(fastestWei.toString(), ETH_DECIMAL),
      };
    } catch (error) {
      throw new Error(`Failed to estimate gas price: ${error}`);
    }
  }

  async waitForTransaction(hash: string) {
    return this.provider.waitForTransaction(hash);
  }

  async estimateTokenTransferGasLimit(
    recipient: string,
    contractAddress: string,
    txAmount: BigNumber,
    defaultValue?: number
  ) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ERC_20_ABI,
        this.getProvider()
      );
      const gasLimit: BigNumber = await contract.estimateGas.transfer(
        recipient,
        txAmount,
        { from: this.getAddress() }
      );
      return gasLimit.toNumber();
    } catch (e) {
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

  private async estimateGasLimit({
    asset,
    recipient,
    amount,
    memo,
  }: FeesParamsEth): Promise<BigNumber> {
    try {
      const txAmount = BigNumber.from(amount.amount().toFixed());

      let assetAddress;
      if (asset && assetToString(asset) !== assetToString(AssetETH)) {
        assetAddress = getTokenAddress(asset);
      }

      let estimate;

      if (assetAddress && assetAddress !== ETHAddress) {
        // ERC20 gas estimate
        const contract = new ethers.Contract(assetAddress, ERC_20_ABI, this.provider);

        estimate = await contract.estimateGas.transfer(recipient, txAmount, {
          from: this.getAddress(),
        });
      } else {
        // ETH gas estimate
        const transactionRequest = {
          from: this.getAddress(),
          to: recipient,
          value: txAmount,
          data: memo ? toUtf8Bytes(memo) : undefined,
        };

        estimate = await this.provider.estimateGas(transactionRequest);
      }

      return estimate;
    } catch (error) {
      return Promise.reject(new Error(`Failed to estimate gas limit: ${error}`));
    }
  }

  private async call<T>(
    address: Address,
    abi: ethers.ContractInterface,
    func: string,
    params: Array<any>
  ): Promise<T> {
    if (!address) {
      return Promise.reject(new Error('address must be provided'));
    }
    const contract = new ethers.Contract(address, abi, this.provider).connect(
      this.getWallet()
    );
    return contract[func](...params);
  }
}

export default EVMChainController;
