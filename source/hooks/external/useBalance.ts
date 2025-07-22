import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import EVMChainController from 'scripts/Background/controllers/EVMChainController';

import vaultSelectors from 'selectors/vaultSelectors';

interface UseBalanceProps {
  userAddress: string;
  contractAddress?: string; // For ERC20 tokens
  chainId?: string | number;
}

interface UseBalanceReturn {
  nativeBalance: ethers.BigNumber | null;
  erc20Balance: ethers.BigNumber | null;
  loading: boolean;
  error: string | null;
}

export const useBalance = ({ userAddress, contractAddress, chainId }: UseBalanceProps): UseBalanceReturn => {
  const currentEvmNetwork = useSelector(vaultSelectors.getCurrentEvmNetwork);
  const chain = chainId || currentEvmNetwork;

  const [nativeBalance, setNativeBalance] = useState<ethers.BigNumber | null>(null);
  const [erc20Balance, setErc20Balance] = useState<ethers.BigNumber | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chainController = useMemo(() => new EVMChainController({ chain }), [chain]);

  useEffect(() => {
    if (!userAddress || !chain) return;

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);

      try {
        // Always fetch native balance
        const nativeBalanceResult = await chainController.getBalance(userAddress);
        setNativeBalance(nativeBalanceResult);

        // Fetch ERC20 balance if contract address is provided
        if (contractAddress) {
          const erc20Contract = chainController.createERC20Contract(contractAddress);
          const erc20BalanceResult = await erc20Contract.balanceOf(userAddress);
          setErc20Balance(ethers.BigNumber.from(erc20BalanceResult));
        }
      } catch (err) {
        console.error('Failed to fetch balances:', err);
        setError('Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [userAddress, contractAddress, chain]);

  return {
    nativeBalance,
    erc20Balance,
    loading,
    error,
  };
};
