import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { AssetETH, assetToString, BaseAmount, baseAmount } from '@xchainjs/xchain-util';
import ERC_20_ABI from 'erc-20-abi';
import { BigNumber, ethers } from 'ethers';
import { parseUnits, toUtf8Bytes } from 'ethers/lib/utils';

import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import StargazerRpcProvider from 'scripts/Provider/evm/StargazerRpcProvider';

import { ITempNFTInfo } from 'state/nfts/types';
import { AssetType } from 'state/vault/types';

import erc20abi from 'utils/erc20.json';
import erc721abi from 'utils/erc721.json';
import erc1155abi from 'utils/erc1155.json';

import { Address, TxHistoryParams, TxParams } from '../ChainsController';

import { BASE_TOKEN_GAS_COST, ETH_DECIMAL, ETHAddress, SIMPLE_GAS_COST } from './constants';
import { getETHTransactionHistory, getGasOracle, getTokenTransactionHistory } from './etherscanApi';
import { GasOracleResponse } from './etherscanApi.types';
import { AllChainsIds, EVMChainControllerParams, IChain, IEVMChainController, TxOverrides } from './types';
import { getChainInfo, getTokenAddress, isTestnet, validateAddress } from './utils';

class EVMChainController implements IEVMChainController {
  private chain: IChain;
  private address: Address | null = null;
  private wallet: ethers.Wallet | null = null;
  private provider: StargazerRpcProvider;

  constructor({ chain, privateKey }: EVMChainControllerParams) {
    this.chain = getChainInfo(chain);
    this.provider = new StargazerRpcProvider(this.chain.rpcEndpoint);
    if (privateKey) {
      this.changeWallet(new ethers.Wallet(privateKey, this.provider));
    } else {
      // For hardware wallets or view-only instances, wallet remains null
      // Address might need to be set separately if no private key to derive from.
      // However, NetworkController is usually created when an account (with an address) is active.
      // If an address is available from the hardware wallet context, it could be passed and set here.
      // For now, assuming address will be set if wallet is created, or handled by consumer.
    }
  }

  // Public methods

  purgeClient() {
    this.address = null;
    this.wallet = null;
  }

  getAddress() {
    if (!this.address) {
      // If wallet is null (hardware wallet), address should have been set externally
      // or this method shouldn't be called without an address context.
      // For now, keeping original logic, but this might need refinement based on how
      // address is managed for hardware wallets.
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
      throw new Error('Signer not available. This operation likely requires a private key or hardware wallet interaction.');
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
      if (this.wallet) {
        this.wallet = this.wallet.connect(this.provider);
      }
      // If this.wallet is null, there's nothing to connect, provider is updated.
    }
  }

  validateAddress(address: Address) {
    return validateAddress(address);
  }

  createERC20Contract(address: Address) {
    // For read-only operations, provider is sufficient.
    // If write operations are intended, the caller must handle signing.
    return new ethers.Contract(address, erc20abi, this.provider);
  }

  createERC721Contract(address: Address) {
    // Returns a contract instance. If used for signing, it will call getWallet().
    return new ethers.Contract(address, erc721abi, this.provider);
  }

  async getERC1155Balance(contractAddress: string, userAddress: string, tokenIds: string[]): Promise<number[]> {
    try {
      const userAddresses: string[] = new Array(tokenIds.length).fill(userAddress);
      // Read operation, so isWriteOperation is false (or default)
      const balances = await this.call<BigNumber[]>(contractAddress, erc1155abi, 'balanceOfBatch', [userAddresses, tokenIds], false);

      return balances.map(balance => balance.toNumber());
    } catch (err) {
      console.log('ERROR: getERC1155Balance', err);
      return [];
    }
  }

  createERC1155Contract(address: Address) {
    // Returns a contract instance. If used for signing, it will call getWallet().
    return new ethers.Contract(address, erc1155abi, this.provider).connect(this.getWallet());
  }

  async transferNFT(tempNFT: ITempNFTInfo): Promise<string> {
    const { nft } = tempNFT;
    const isERC721 = nft.token_standard === AssetType.ERC721;
    const nftContractAddress = tempNFT.nft.contract;
    const fromAddress = tempNFT.from.address;
    const toAddress = tempNFT.to;
    const tokenId = tempNFT.nft.identifier;
    const amount = tempNFT.quantity;
    const { price, limit } = tempNFT.gas;
    let overrides: TxOverrides = {
      gasLimit: BASE_TOKEN_GAS_COST, // Default, might be overridden
    };

    if (!!price && !!limit) {
      // Increase gas limit by 30%
      const gasLimitBigNum = BigNumber.from(Math.floor(limit * 1.3)); // Keep as BigNumber
      const gasPriceParsed = ethers.utils.parseUnits(price.toString(), 'gwei');

      overrides = {
        gasLimit: gasLimitBigNum,
        gasPrice: gasPriceParsed,
      };
    }

    // This is a write operation
    const tx = isERC721
      ? await this.call<TransactionResponse>(
          nftContractAddress,
          erc721abi,
          'transferFrom',
          [fromAddress, toAddress, tokenId], // Overrides should be the last param if contract func accepts it
          // Or applied when sending the tx if call prepares it.
          // For ethers.js, overrides are part of the last argument object.
          // So, it should be [fromAddress, toAddress, tokenId, { ...overrides }]
          true, // isWriteOperation
          { ...overrides } // Pass overrides to call, which will pass to contract function
        )
      : await this.call<TransactionResponse>(
          nftContractAddress,
          erc1155abi,
          'safeTransferFrom',
          [fromAddress, toAddress, tokenId, amount, '0x'], // Similar override placement
          true, // isWriteOperation
          { ...overrides } // Pass overrides
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
    gasPrice,
    gasLimit,
    nonce,
  }: TxParams & {
    gasPrice?: BaseAmount;
    gasLimit?: BigNumber;
    nonce?: number;
  }): Promise<TransactionResponse> {
    // This whole method requires a signer. If this.wallet is null, getWallet() will throw.
    const wallet = this.getWallet(); // Ensures wallet is available or throws

    try {
      const txAmount = BigNumber.from(amount.amount().toFixed());

      let assetAddress;
      if (asset && assetToString(asset) !== assetToString(AssetETH)) {
        assetAddress = getTokenAddress(asset);
      }

      const isETHAddress = assetAddress === ETHAddress;

      const defaultGasLimit: BigNumber = isETHAddress ? SIMPLE_GAS_COST : BASE_TOKEN_GAS_COST;

      let overrides: TxOverrides = {
        gasLimit: gasLimit || defaultGasLimit,
        gasPrice: gasPrice && BigNumber.from(gasPrice.amount().toFixed()),
        nonce, // Pass nonce to overrides
      };

      // Ensure nonce is part of overrides if not already
      if (nonce !== undefined && overrides.nonce === undefined) {
        overrides.nonce = nonce;
      }

      let txResult;
      if (assetAddress && !isETHAddress) {
        const contract = new ethers.Contract(assetAddress, ERC_20_ABI, wallet);
        txResult = await contract.transfer(recipient, txAmount.toString(), overrides);
      } else {
        // Transfer ETH
        const transactionRequest = {
          to: recipient,
          value: txAmount,
          data: memo ? toUtf8Bytes(memo) : undefined,
          ...overrides, // nonce should be part of overrides
        };

        txResult = await wallet.sendTransaction(transactionRequest);
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

  async getBalance(address: string) {
    return await this.provider.getBalance(address);
  }

  async getNonce(address: string): Promise<number> {
    return await this.provider.getTransactionCount(address, 'pending');
  }

  async sendTransaction(signedTransaction: string) {
    return await this.provider.sendTransaction(signedTransaction);
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
          chainId: this.chain.chainId,
          address,
          assetAddress,
          page,
          offset,
        });
      } else {
        transations = await getETHTransactionHistory({
          explorerID: this.chain.explorerID,
          chainId: this.chain.chainId,
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

  async estimateGas(transaction: TransactionRequest) {
    return this.provider.estimateGas(transaction);
  }

  async estimateGasPrices() {
    if (isTestnet(this.chain.id) || this.chain.id === 'base-mainnet') {
      // Etherscan gas oracle is not working in testnets
      return this.fallbackFeeData(this.provider);
    }

    try {
      const response: GasOracleResponse = await getGasOracle(this.chain.explorerID, this.chain.chainId);

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
      return this.fallbackFeeData(this.provider);
    }
  }

  estimateDiffAmount(value: number): number {
    if (value < 10) return 1;
    return Math.floor(value / 10);
  }

  async fallbackFeeData(provider: ethers.providers.Provider) {
    const fastMultiplier = ethers.BigNumber.from(110); // 110 in BigNumber
    const fastestMultiplier = ethers.BigNumber.from(120); // 120 in BigNumber
    const hundred = ethers.BigNumber.from(100); // 100 in BigNumber

    const feeData = await provider.getFeeData();

    // If feeData.gasPrice is null (it can be on EIP-1559 networks),
    // you might want to handle maxFeePerGas / maxPriorityFeePerGas logic here.
    const baseGasPrice = feeData.gasPrice ?? ethers.BigNumber.from(0);
    const fastGasPrice = baseGasPrice.mul(fastMultiplier).div(hundred); // 110% of the baseGasPrice
    const fastestGasPrice = baseGasPrice.mul(fastestMultiplier).div(hundred); // 120% of the baseGasPrice

    return {
      average: baseAmount(baseGasPrice.toString(), ETH_DECIMAL),
      fast: baseAmount(fastGasPrice.toString(), ETH_DECIMAL),
      fastest: baseAmount(fastestGasPrice.toString(), ETH_DECIMAL),
    };
  }

  async waitForTransaction(hash: string) {
    return this.provider.waitForTransaction(hash);
  }

  // Private methods

  private changeWallet(wallet: ethers.Wallet | null): void {
    // Allow null
    this.wallet = wallet;
    this.address = wallet ? wallet.address.toLowerCase() : null;
  }

  private getProvider(): Provider {
    return this.provider;
  }

  private isValidEthereumAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  private async call<T>(
    address: Address,
    abi: ethers.ContractInterface,
    func: string,
    params: Array<any>,
    isWriteOperation = false, // Default to false (read)
    overrides?: TxOverrides // Optional overrides for write operations
  ): Promise<T> {
    if (!address) {
      return Promise.reject(new Error('address must be provided'));
    }
    let contractInstance = new ethers.Contract(address, abi, this.provider);

    if (isWriteOperation) {
      // This will throw if this.wallet is null, which is correct for writes.
      contractInstance = contractInstance.connect(this.getWallet());
      // Append overrides if provided and it's a write operation
      if (overrides) {
        return contractInstance[func](...params, overrides);
      }
    }
    return contractInstance[func](...params);
  }
}

export default EVMChainController;
