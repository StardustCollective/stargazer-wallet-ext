import { useSelector } from 'react-redux';

import dappSelectors from 'selectors/dappSelectors';
import vaultSelectors from 'selectors/vaultSelectors';
import walletsSelectors from 'selectors/walletsSelectors';

export interface ExternalViewData {
  current: ReturnType<typeof dappSelectors.getCurrent>;
  activeWallet: ReturnType<typeof walletsSelectors.getActiveWallet>;
  constellationNetwork: string;
  evmNetwork: string;
}

/**
 * Custom hook that provides common data used across all external view components
 * Centralizes the pattern of getting current dapp, active wallet, and network information
 */
export const useExternalViewData = (): ExternalViewData => {
  const current = useSelector(dappSelectors.getCurrent);
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);
  const constellationNetwork = useSelector(vaultSelectors.selectConstellationNetworkLabel);
  const evmNetwork = useSelector(vaultSelectors.selectActiveEvmNetworkLabel);

  return {
    current,
    activeWallet,
    constellationNetwork,
    evmNetwork,
  };
};
