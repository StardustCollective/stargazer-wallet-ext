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
  assetToString,
} from '@xchainjs/xchain-util';
import {
  BASE_TOKEN_GAS_COST,
  DEFAULT_GAS_PRICE,
  ETH_DECIMAL,
  SIMPLE_GAS_COST,
  ETHAddress,
} from './constants';
import {
  ALL_EVM_CHAINS,
  AVALANCHE_LOGO,
  BSC_LOGO,
  ETHEREUM_LOGO,
  POLYGON_LOGO,
} from 'constants/index';
import store from 'state/store';

export const isTestnet = (network: AllChainsIds | string) => {
  return testnets.includes(network);
};

export const getNetworkLogo = (network: string) => {
  switch (network) {
    case 'both':
    case 'mainnet':
    case 'sepolia':
      return ETHEREUM_LOGO;
    case 'avalanche-mainnet':
    case 'avalanche-testnet':
      return AVALANCHE_LOGO;
    case 'bsc':
    case 'bsc-testnet':
      return BSC_LOGO;
    case 'matic':
    case 'amoy':
      return POLYGON_LOGO;

    default:
      return ETHEREUM_LOGO;
  }
};

export const getMainnetFromPlatform = (platform: string): string => {
  switch (platform) {
    case 'ethereum':
      return 'mainnet';
    case 'avalanche':
      return 'avalanche-mainnet';
    case 'binance-smart-chain':
      return 'bsc';
    case 'polygon-pos':
      return 'matic';

    default:
      return 'mainnet';
  }
};

export const getPlatformFromMainnet = (network: string): string => {
  switch (network) {
    case 'mainnet':
      return 'ethereum';
    case 'avalanche-mainnet':
      return 'avalanche';
    case 'bsc':
      return 'binance-smart-chain';
    case 'matic':
      return 'polygon-pos';

    default:
      return 'mainnet';
  }
};

export const getNetworkLabel = (network: string): string => {
  switch (network) {
    case 'main2':
      return 'Constellation';
    case 'test2':
      return 'Constellation Testnet';
    case 'integration2':
      return 'IntegrationNet';
    case 'local2':
      return 'Constellation Local';
    case 'mainnet':
      return 'Ethereum';
    case 'sepolia':
      return 'Sepolia';
    case 'avalanche-mainnet':
      return 'Avalanche';
    case 'avalanche-testnet':
      return 'Fuji Testnet';
    case 'bsc':
      return 'BSC';
    case 'bsc-testnet':
      return 'BSC Testnet';
    case 'matic':
      return 'Polygon';
    case 'amoy':
      return 'Polygon Amoy Testnet';

    default:
      return 'ERC-20';
  }
};

export const getNetworkNativeToken = (network: string): string => {
  switch (network) {
    case 'Ethereum':
      return 'ETH';
    case 'Polygon':
      return 'MATIC';
    case 'Avalanche':
      return 'AVAX';
    case 'BSC':
      return 'BNB';

    default:
      return 'ETH';
  }
};

export const getAllEVMChains = () => {
  const { customNetworks } = store.getState().vault;
  return {
    ...ALL_EVM_CHAINS,
    ...customNetworks['ethereum'],
  };
};

export const generateId = (value: string): string => {
  return value.toLocaleLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
};

export const getPriceId = (network: string): string => {
  // 349: New network should be added here.
  switch (network) {
    case 'mainnet':
    case 'sepolia':
      return 'ethereum';
    case 'matic':
    case 'amoy':
      return 'matic-network';
    case 'avalanche-mainnet':
    case 'avalanche-testnet':
      return 'avalanche-2';
    case 'bsc':
    case 'bsc-testnet':
      return 'binancecoin';

    default:
      return 'ethereum';
  }
};

export const getMainnetFromTestnet = (chainId: AllChainsIds | string) => {
  const EVM_CHAINS = getAllEVMChains();
  if (chainId === 'both') return 'mainnet';
  return EVM_CHAINS[chainId]?.mainnet;
};

export const getNetworkFromChainId = (chainId: AllChainsIds | 'both' | string) => {
  const EVM_CHAINS = getAllEVMChains();
  if (chainId === 'both') return 'Ethereum';
  return EVM_CHAINS[chainId]?.network;
};

export const getNativeToken = (chainId: AllChainsIds | 'both' | string) => {
  const EVM_CHAINS = getAllEVMChains();
  if (chainId === 'both') return 'ETH';
  return EVM_CHAINS[chainId]?.nativeToken;
};

export const getChainId = (network: AllChainsIds | string): number => {
  const EVM_CHAINS = getAllEVMChains();
  return EVM_CHAINS[network]?.chainId;
};

export const getChainInfo = (chainId: string) => {
  const EVM_CHAINS = getAllEVMChains();
  return EVM_CHAINS[chainId];
};

export const filterSelfTxs = <T extends { from: string; to: string; hash: string }>(
  txs: T[]
): T[] => {
  const filterTxs = txs.filter((tx) => tx.from !== tx.to);
  let selfTxs = txs.filter((tx) => tx.from === tx.to);
  while (selfTxs.length) {
    const selfTx = selfTxs[0];
    filterTxs.push(selfTx);
    selfTxs = selfTxs.filter((tx) => tx.hash !== selfTx.hash);
  }

  return filterTxs;
};

export const validateSymbol = (symbol?: string | null): boolean =>
  symbol ? symbol.length >= 3 : false;

export const validateAddress = (address: Address): boolean => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (error) {
    return false;
  }
};

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
      };
    }
  }

  return null;
};

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
  };
};

export const getTokenAddress = (asset: Asset): string | null => {
  try {
    // strip 0X only - 0x is still valid
    return ethers.utils.getAddress(
      asset.symbol.slice(asset.ticker.length + 1).replace(/^0X/, '')
    );
  } catch (err) {
    return null;
  }
};

export const getFee = ({
  gasPrice,
  gasLimit,
}: {
  gasPrice: BaseAmount;
  gasLimit: BigNumber;
}) => baseAmount(gasPrice.amount().multipliedBy(gasLimit.toString()), ETH_DECIMAL);

export const estimateDefaultFeesWithGasPricesAndLimits = (
  asset?: Asset
): FeesWithGasPricesAndLimits => {
  const gasPrices = {
    average: baseAmount(
      parseUnits(DEFAULT_GAS_PRICE.toString(), 'gwei').toString(),
      ETH_DECIMAL
    ),
    fast: baseAmount(
      parseUnits((DEFAULT_GAS_PRICE * 2).toString(), 'gwei').toString(),
      ETH_DECIMAL
    ),
    fastest: baseAmount(
      parseUnits((DEFAULT_GAS_PRICE * 3).toString(), 'gwei').toString(),
      ETH_DECIMAL
    ),
  };
  const { fast: fastGP, fastest: fastestGP, average: averageGP } = gasPrices;

  let assetAddress;
  if (asset && assetToString(asset) !== assetToString(AssetETH)) {
    assetAddress = getTokenAddress(asset);
  }

  let gasLimit;
  if (assetAddress && assetAddress !== ETHAddress) {
    gasLimit = BigNumber.from(BASE_TOKEN_GAS_COST);
  } else {
    gasLimit = BigNumber.from(SIMPLE_GAS_COST);
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
  };
};

export const getDefaultGasPrices = (asset?: Asset): GasPrices => {
  const { gasPrices } = estimateDefaultFeesWithGasPricesAndLimits(asset);
  return gasPrices;
};
