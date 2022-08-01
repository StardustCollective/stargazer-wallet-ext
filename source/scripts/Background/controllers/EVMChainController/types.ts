import { BigNumber, Contract, ethers, Wallet } from 'ethers';
import { BaseAmount } from '@xchainjs/xchain-util';
import { Address, ChainsController, FeeOptionKey, Fees, FeesParams, TxParams } from '../ChainsController';
import { TransactionResponse } from '@ethersproject/abstract-provider';

// TODO-349: Add all chains and networks here
// Chain IDs
export type EthChainId = 'mainnet' | 'ropsten' | 'rinkeby';
export type PolygonChainId = 'matic' | 'maticmum';
export type BSCChainId = 'bsc' | 'bsc-testnet';
export type AvalancheChainId = 'avalanche-mainnet' | 'avalanche-testnet';

// Chain values
export type EthChainValue = 'homestead' | 'ropsten' | 'rinkeby';
export type PolygonChainValue = 'matic' | 'maticmum';
export type BSCChainValue = 'bsc' | 'bsc-testnet';
export type AvalancheChainValue = 'avalanche-mainnet' | 'avalanche-testnet';

// All chains
export type AllChainsIds = EthChainId | PolygonChainId | BSCChainId | AvalancheChainId;
export type AllChainsValues = EthChainValue | PolygonChainValue | BSCChainValue | AvalancheChainValue;

export const testnets = ['ropsten', 'rinkeby', 'maticmum', 'bsc-testnet', 'avalanche-testnet'];

export type IChain = {
  id: AllChainsIds;
  value: AllChainsValues;
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
  chain?: AllChainsIds;
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
