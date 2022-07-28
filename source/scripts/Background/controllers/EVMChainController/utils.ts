import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { Address, Tx } from '../ChainsController';
import { ETHTransactionInfo, TokenTransactionInfo } from './etherscanApi.types';
import { FeesWithGasPricesAndLimits, GasPrices, testnets, AllChainsIds } from './types';
import { 
  Asset, 
  BaseAmount, 
  AssetETH, 
  ETHChain, 
  baseAmount, 
  assetFromString, 
  assetToString 
} from '@xchainjs/xchain-util';
import { 
  BASE_TOKEN_GAS_COST, 
  DEFAULT_GAS_PRICE, 
  ETH_DECIMAL, 
  SIMPLE_GAS_COST ,
  ETHAddress 
} from './constants';
import { ALL_EVM_CHAINS } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export const isTestnet = (network: AllChainsIds) => {
  return testnets.includes(network);
};

// TODO-349: Check all these methods
export const equalMainTokenAddress = (chainId: AllChainsIds) => {
  switch (chainId) {
    case 'matic':
    case 'maticmum':
      return true;
    case 'mainnet':
    case 'rinkeby':
    case 'ropsten':
      return false;
  
    default:
      return false;
  }
}

export const getMainnetFromTestnet = (chainId: AllChainsIds) => {
  switch (chainId) {
    case 'rinkeby':
    case 'ropsten':
      return 'mainnet';
    case 'maticmum':
      return 'matic';
  
    default:
      return 'mainnet';
  }
}

export const getNetworkFromChainId = (chainId: AllChainsIds | 'both') => {
  switch (chainId) {
    case 'mainnet':
    case 'rinkeby':
    case 'ropsten':
    case 'both':
        return KeyringNetwork.Ethereum;
    case 'matic':
    case 'maticmum':
        return 'Polygon';
  
    default:
      return KeyringNetwork.Ethereum;
  }
}

export const getChainId = (network: AllChainsIds): number => {
  switch (network) {
    case 'mainnet':
      return 1;
    case 'ropsten':
      return 3;
    case 'rinkeby':
      return 4;
    case 'matic':
      return 137;
    case 'maticmum':
      return 80001;
      
    default:
      return 1;
  }
}

export const getChainInfo = (chainId: AllChainsIds) => {
  return ALL_EVM_CHAINS[chainId];
}

export const filterSelfTxs = <T extends { from: string; to: string; hash: string }>(txs: T[]): T[] => {
  const filterTxs = txs.filter((tx) => tx.from !== tx.to)
  let selfTxs = txs.filter((tx) => tx.from === tx.to)
  while (selfTxs.length) {
    const selfTx = selfTxs[0]
    filterTxs.push(selfTx)
    selfTxs = selfTxs.filter((tx) => tx.hash !== selfTx.hash)
  }

  return filterTxs
}

export const validateSymbol = (symbol?: string | null): boolean => (symbol ? symbol.length >= 3 : false);

export const validateAddress = (address: Address): boolean => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (error) {
    return false;
  }
}

export const getTxFromTokenTransaction = (tx: TokenTransactionInfo): Tx | null => {
  const decimals = parseInt(tx.tokenDecimal) || ETH_DECIMAL;
  const symbol = tx.tokenSymbol;
  const address = tx.contractAddress;
  if (validateSymbol(symbol) && validateAddress(address)) {
    const tokenAsset = assetFromString(`${ETHChain}.${symbol}-${address}`);
    if (tokenAsset) {
      return {
        asset: tokenAsset,
        from: [
          {
            from: tx.from,
            amount: baseAmount(tx.value, decimals),
          },
        ],
        to: [
          {
            to: tx.to,
            amount: baseAmount(tx.value, decimals),
          },
        ],
        date: new Date(parseInt(tx.timeStamp) * 1000),
        type: 'transfer',
        hash: tx.hash,
      }
    }
  }

  return null;
}

export const getTxFromEthTransaction = (tx: ETHTransactionInfo): Tx => {
  return {
    asset: AssetETH,
    from: [
      {
        from: tx.from,
        amount: baseAmount(tx.value, ETH_DECIMAL),
      },
    ],
    to: [
      {
        to: tx.to,
        amount: baseAmount(tx.value, ETH_DECIMAL),
      },
    ],
    date: new Date(parseInt(tx.timeStamp) * 1000),
    type: 'transfer',
    hash: tx.hash,
  }
}

export const getTokenAddress = (asset: Asset): string | null => {
  try {
    // strip 0X only - 0x is still valid
    return ethers.utils.getAddress(asset.symbol.slice(asset.ticker.length + 1).replace(/^0X/, ''));
  } catch (err) {
    return null;
  }
}

export const getFee = ({ gasPrice, gasLimit }: { gasPrice: BaseAmount; gasLimit: BigNumber }) =>
  baseAmount(gasPrice.amount().multipliedBy(gasLimit.toString()), ETH_DECIMAL);

export const estimateDefaultFeesWithGasPricesAndLimits = (asset?: Asset): FeesWithGasPricesAndLimits => {
  const gasPrices = {
    average: baseAmount(parseUnits(DEFAULT_GAS_PRICE.toString(), 'gwei').toString(), ETH_DECIMAL),
    fast: baseAmount(parseUnits((DEFAULT_GAS_PRICE * 2).toString(), 'gwei').toString(), ETH_DECIMAL),
    fastest: baseAmount(parseUnits((DEFAULT_GAS_PRICE * 3).toString(), 'gwei').toString(), ETH_DECIMAL),
  }
  const { fast: fastGP, fastest: fastestGP, average: averageGP } = gasPrices

  let assetAddress
  if (asset && assetToString(asset) !== assetToString(AssetETH)) {
    assetAddress = getTokenAddress(asset)
  }

  let gasLimit
  if (assetAddress && assetAddress !== ETHAddress) {
    gasLimit = BigNumber.from(BASE_TOKEN_GAS_COST)
  } else {
    gasLimit = BigNumber.from(SIMPLE_GAS_COST)
  }

  return {
    gasPrices,
    gasLimit,
    fees: {
      type: 'byte',
      average: getFee({ gasPrice: averageGP, gasLimit }),
      fast: getFee({ gasPrice: fastGP, gasLimit }),
      fastest: getFee({ gasPrice: fastestGP, gasLimit }),
    },
  }
}

export const getDefaultGasPrices = (asset?: Asset): GasPrices => {
  const { gasPrices } = estimateDefaultFeesWithGasPricesAndLimits(asset)
  return gasPrices
}