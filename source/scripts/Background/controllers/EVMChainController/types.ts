import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { BaseAmount } from '@xchainjs/xchain-util';
import { BigNumber, Contract, ethers, Wallet } from 'ethers';

import { Address, ChainsController, FeeOptionKey, Fees, FeesParams, TxParams } from '../ChainsController';

// Chain IDs
export type EthChainId = 'mainnet' | 'sepolia';
export type PolygonChainId = 'matic' | 'amoy';
export type BSCChainId = 'bsc' | 'bsc-testnet';
export type AvalancheChainId = 'avalanche-mainnet' | 'avalanche-testnet';
export type BaseChainId = 'base-mainnet' | 'base-sepolia';
export type InkChainId = 'ink-mainnet' | 'ink-sepolia';

// Chain values
export type EthChainValue = 'homestead' | 'sepolia';
export type PolygonChainValue = 'matic' | 'amoy';
export type BSCChainValue = 'bsc' | 'bsc-testnet';
export type AvalancheChainValue = 'avalanche-mainnet' | 'avalanche-testnet';
export type BaseChainValue = 'base-mainnet' | 'base-sepolia';
export type InkChainValue = 'ink-mainnet' | 'ink-sepolia';

// All chains
export type AllChainsIds = EthChainId | PolygonChainId | BSCChainId | AvalancheChainId | BaseChainId | InkChainId;
export type AllChainsValues = EthChainValue | PolygonChainValue | BSCChainValue | AvalancheChainValue | BaseChainValue | InkChainValue;

export const testnets = ['sepolia', 'amoy', 'bsc-testnet', 'avalanche-testnet', 'base-sepolia', 'ink-sepolia'];

export type IChain = {
  id: AllChainsIds | string;
  value: AllChainsValues | string;
  label: string;
  chainId: number;
  explorer: string;
  rpcEndpoint: string;
  explorerID: string;
  nativeToken: string;
  mainnet: string;
  network: string;
};

export type GasPrices = Record<FeeOptionKey, BaseAmount>;
export type FeesParamsEth = FeesParams & TxParams;
export type FeesWithGasPricesAndLimits = {
  fees: Fees;
  gasPrices: GasPrices;
  gasLimit: BigNumber;
};

export type TxOverrides = {
  nonce?: ethers.BigNumberish;
  // mandatory: https://github.com/ethers-io/ethers.js/issues/469#issuecomment-475926538
  gasLimit: ethers.BigNumberish;
  gasPrice?: ethers.BigNumberish;
  data?: ethers.BytesLike;
  value?: ethers.BigNumberish;
};

type GetTokenInfoResponse = {
  address: string;
  decimals: any;
  symbol: any;
  name: string;
};

export type EVMChainControllerParams = {
  chain?: AllChainsIds | string | number;
  privateKey?: string;
};

export interface IEVMChainController extends ChainsController {
  getTokenInfo: (address: string) => Promise<GetTokenInfoResponse | null>;
  waitForTransaction: (hash: string) => Promise<ethers.providers.TransactionReceipt>;
  transfer: (
    txParams: TxParams & {
      gasPrice?: BaseAmount;
      gasLimit?: BigNumber;
      nonce?: number;
    }
  ) => Promise<TransactionResponse>;
  getWallet: (walletIndex: number) => Wallet;
  estimateGasPrices: () => Promise<GasPrices>;
  estimateGas: (txn: TransactionRequest) => Promise<BigNumber>;
  createERC20Contract: (address: Address) => Contract;
}
