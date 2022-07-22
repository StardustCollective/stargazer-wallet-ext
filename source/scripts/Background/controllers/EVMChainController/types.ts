import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { BaseAmount } from '@xchainjs/xchain-util';
import { Address, ChainsController, FeeOptionKey, Fees, FeesParams, TxParams } from '../ChainsController';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export type EthChainId = 'mainnet' | 'ropsten' | 'rinkeby';
export type EthNetworkValue = 'homestead' | 'ropsten' | 'rinkeby';
export const testnets = ['ropsten', 'rinkeby'];

export type EthereumNetwork = {
  id: EthChainId;
  value: EthNetworkValue;
  label: string;
  chainId: number;
  explorer: string;
  rpcEndpoint: string;
  explorerAPI: string;
}

export type GasPrices = Record<FeeOptionKey, BaseAmount>;
export type FeesParamsEth = FeesParams & TxParams;
export type FeesWithGasPricesAndLimits = { fees: Fees; gasPrices: GasPrices; gasLimit: BigNumber };

export type TxOverrides = {
  nonce?: ethers.BigNumberish;
  // mandatory: https://github.com/ethers-io/ethers.js/issues/469#issuecomment-475926538
  gasLimit: ethers.BigNumberish;
  gasPrice?: ethers.BigNumberish;
  data?: ethers.BytesLike;
  value?: ethers.BigNumberish;
}

type GetTokenInfoResponse = {
  address: string;
  decimals: any;
  symbol: any;
  name: string;
}

export type EVMChainControllerParams = {
  network?: EthChainId;
  etherscanApiKey?: string;
  privateKey?: string;
};

export interface IEVMChainController extends ChainsController {
  estimateTokenTransferGasLimit: (recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) => Promise<number>;
  getTokenInfo: (address: string) => Promise<GetTokenInfoResponse | null>;
  waitForTransaction: (hash: string) => Promise<ethers.providers.TransactionReceipt>;
  transfer: (txParams: TxParams & { feeOptionKey?: FeeOptionKey; gasPrice?: BaseAmount; gasLimit?: BigNumber; nonce: string; }) => Promise<TransactionResponse>;
  getWallet: (walletIndex: number) => Wallet;
  estimateGasPrices: () => Promise<GasPrices>;
  estimateGas: (from: string, to: string, data: string) => Promise<BigNumber>;
  createERC20Contract: (address: Address) => Contract;
};
