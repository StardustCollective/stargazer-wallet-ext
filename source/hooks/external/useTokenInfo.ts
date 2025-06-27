import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ALL_EVM_CHAINS } from 'constants/index';

import { getChainInfo } from 'scripts/Background/controllers/EVMChainController/utils';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import StargazerRpcProvider from 'scripts/Provider/evm/StargazerRpcProvider';

import assetsSelectors from 'selectors/assetsSelectors';
import vaultSelectors from 'selectors/vaultSelectors';

import { ExternalApi } from 'utils/httpRequests/apis';
import { ExternalService } from 'utils/httpRequests/constants';

interface TokenInfo {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo?: string;
  price?: number;
}

interface UseTokenInfoResult {
  tokenInfo: TokenInfo | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

interface UseTokenInfoParams {
  contractAddress: string;
  chainId?: string;
  withPrice?: boolean;
}

/**
 * Hook to get token information following a 3-step pattern:
 * 1. Try to get token info from wallet assets
 * 2. If not found, try CoinGecko API
 * 3. If not found, try to get info directly from contract
 *
 * @param contractAddress - The contract address of the token
 * @param chainId - The chainId identifier (e.g., 'mainnet', 'matic', 'bsc', etc.)
 * @returns Object with tokenInfo, loading state, and error
 */
export const useTokenInfo = ({ contractAddress, chainId, withPrice = false }: UseTokenInfoParams): UseTokenInfoResult => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get current chainId if not provided
  const currentEvmNetwork = useSelector(vaultSelectors.getCurrentEvmNetwork);
  const targetNetwork = chainId || currentEvmNetwork;

  // Step 1: Try to get from wallet assets
  const walletAsset = useSelector(assetsSelectors.getAssetByAddress(contractAddress));

  const resetState = useCallback(() => {
    setTokenInfo(null);
    setError(null);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchFromCoinGecko = useCallback(async (address: string, networkId: string): Promise<TokenInfo | null> => {
    try {
      const CoinGeckoSupportedNetworks = ['eth', 'sepolia-testnet', 'bsc', 'polygon_pos', 'avax', 'base'];

      const NetworksMap: Record<string, string> = {
        mainnet: 'eth',
        sepolia: 'sepolia-testnet',
        bsc: 'bsc',
        matic: 'polygon_pos',
        'avalanche-mainnet': 'avax',
        'base-mainnet': 'base',
      };
      const mappedNetworkId = NetworksMap[networkId] || networkId;

      if (!CoinGeckoSupportedNetworks.includes(mappedNetworkId)) {
        return null;
      }

      console.log(`Fetching token info from CoinGecko for ${address} on ${mappedNetworkId}`);
      const response = await ExternalApi.get(`${ExternalService.CoinGecko}/onchain/networks/${mappedNetworkId}/tokens/${address}`);

      if (response?.data?.data && response.data.data?.attributes?.decimals) {
        let priceValue = 0;
        if (withPrice) {
          const { price_usd, coingecko_coin_id } = response.data?.data?.attributes ?? {};
          priceValue = price_usd && Number(price_usd);

          if (coingecko_coin_id && !price_usd) {
            const price = await ExternalApi.get(`${ExternalService.CoinGecko}/simple/price?ids=${coingecko_coin_id}&vs_currencies=usd`);
            if (price?.data?.[coingecko_coin_id]?.usd) {
              priceValue = price.data[coingecko_coin_id].usd;
            }
          }
        }
        return {
          address,
          decimals: response.data.data?.attributes?.decimals || 18,
          symbol: response.data.data?.attributes?.symbol || 'UNKNOWN',
          name: response.data.data?.attributes?.name || 'Unknown Token',
          logo: response.data.data?.attributes?.image_url || '',
          ...(withPrice ? { price: priceValue } : {}),
        };
      }
      return null;
    } catch (coinGeckoError) {
      console.warn('CoinGecko API failed:', coinGeckoError);
      return null;
    }
  }, []);

  const fetchFromContract = useCallback(async (address: string, networkId: string): Promise<TokenInfo | null> => {
    try {
      // Get the correct chain info and create provider
      const chainInfo = ALL_EVM_CHAINS[networkId] || getChainInfo(networkId);

      if (!chainInfo) {
        return null;
      }

      const provider = new StargazerRpcProvider(chainInfo.rpcEndpoint);
      const contractInfo = await tokenContractHelper.getTokenInfo(provider, address);

      return {
        address: contractInfo.address,
        decimals: contractInfo.decimals,
        symbol: contractInfo.symbol,
        name: contractInfo.name,
        logo: undefined,
      };
    } catch (contractError) {
      console.warn('Contract call failed:', contractError);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      // Reset state if no contract address provided
      if (!contractAddress) {
        resetState();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Step 1: Check if token exists in wallet
        if (walletAsset) {
          console.log('Token found in wallet:', walletAsset);
          setTokenInfo({
            address: walletAsset.address,
            decimals: walletAsset.decimals,
            symbol: walletAsset.symbol,
            name: walletAsset.label || walletAsset.symbol,
            logo: walletAsset.logo,
          });
          setLoading(false);
          return;
        }

        // Step 2: Try CoinGecko API
        const coinGeckoResult = await fetchFromCoinGecko(contractAddress, targetNetwork);
        if (coinGeckoResult) {
          console.log('Token found via CoinGecko:', coinGeckoResult);
          setTokenInfo(coinGeckoResult);
          setLoading(false);
          return;
        }

        // Step 3: Try contract directly
        const contractResult = await fetchFromContract(contractAddress, targetNetwork);
        if (contractResult) {
          console.log('Token found via contract call:', contractResult);
          setTokenInfo(contractResult);
          setLoading(false);
          return;
        }

        // If all methods fail
        setError('Unable to fetch token information from any source');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch token info';
        console.error('useTokenInfo error:', errorMessage);
        setError(errorMessage);
        setTokenInfo(null);
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [contractAddress, targetNetwork, walletAsset, fetchFromCoinGecko, fetchFromContract, resetState]);

  return {
    tokenInfo,
    loading,
    error,
    clearError,
  };
};

export default useTokenInfo;
