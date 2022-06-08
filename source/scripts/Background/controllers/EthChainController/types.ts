import { BigNumber, ethers, Wallet } from 'ethers';
import { BaseAmount } from '@xchainjs/xchain-util';
import { ChainsController, FeeOptionKey, Fees, FeesParams, TxParams } from '../ChainsController';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export type EthNetworkId = 'mainnet' | 'ropsten';
export type EthNetworkValue = 'homestead' | 'ropsten';
export const testnets = ['ropsten'];

export type EthereumNetwork = {
  id: EthNetworkId;
  value: EthNetworkValue;
  label: string;
  chainId: number;
  etherscan: string;
}

export type InfuraCreds = {
  projectId: string;
  projectSecret?: string;
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

export type EthChainControllerParams = {
  network?: EthNetworkId;
  etherscanApiKey?: string;
  privateKey?: string;
  infuraCreds?: InfuraCreds;
};

export interface IEthChainController extends ChainsController {
  estimateTokenTransferGasLimit: (recipient: string, contractAddress: string, txAmount: BigNumber, defaultValue?: number) => Promise<number>;
  getTokenInfo: (address: string, chainId: number) => Promise<GetTokenInfoResponse | null>;
  waitForTransaction: (hash: string, chainId: number) => Promise<ethers.providers.TransactionReceipt>;
  transfer: (txParams: TxParams & { feeOptionKey?: FeeOptionKey; gasPrice?: BaseAmount; gasLimit?: BigNumber; nonce: string; }) => Promise<TransactionResponse>;
  getWallet: (walletIndex: number) => Wallet;
  estimateGasPrices: () => Promise<GasPrices>;
};
