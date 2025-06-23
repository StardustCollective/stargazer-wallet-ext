import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { WalletParam } from 'scripts/Background/messaging';
import { StargazerChain } from 'scripts/common';

import dappSelectors from 'selectors/dappSelectors';
import vaultSelectors from 'selectors/vaultSelectors';
import walletsSelectors from 'selectors/walletsSelectors';

export interface ExternalViewData {
  current: ReturnType<typeof dappSelectors.getCurrent>;
  activeWallet: ReturnType<typeof walletsSelectors.getActiveWallet>;
  networkLabel: string;
  accountChanged: boolean;
  networkChanged: boolean;
}

/**
 * Custom hook that provides common data used across all external view components
 * Centralizes the pattern of getting current dapp, active wallet, and network information
 */
export const useExternalViewData = (wallet?: WalletParam, isDappTransaction = true): ExternalViewData => {
  const { address, chainId, chain } = wallet ?? {};

  const current = useSelector(dappSelectors.getCurrent);
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);

  const isDag = chain === StargazerChain.CONSTELLATION;
  const evmSelector = isDappTransaction ? vaultSelectors.selectActiveEvmNetwork : vaultSelectors.selectActiveNetworkByChain(chain);
  const activeNetwork = isDag ? useSelector(vaultSelectors.selectActiveConstellationNetwork) : useSelector(evmSelector);

  const networkLabel = useMemo(() => {
    if (isDag) {
      const { label, network, chainId: networkChainId } = activeNetwork;
      const extraLabel = networkChainId !== 1 ? ` ${label}` : '';
      return `${network}${extraLabel}`;
    }

    return activeNetwork?.label;
  }, [activeNetwork, isDag]);

  const accountChanged = useMemo(() => !activeWallet?.accounts?.find(account => account?.address?.toLowerCase() === address?.toLowerCase()), [address, activeWallet]);

  const networkChanged = useMemo(() => {
    if (!chainId) return false;

    return activeNetwork.chainId !== chainId;
  }, [activeNetwork, chainId]);

  return {
    current,
    activeWallet,
    networkLabel,
    accountChanged,
    networkChanged,
  };
};
