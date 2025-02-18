import { useSelector } from 'react-redux';
import { IAssetInfoState } from 'state/assets/types';
import vaultSelectors from 'selectors/vaultSelectors';
import { ActiveNetwork, AssetType } from 'state/vault/types';
import {
  getNetworkFromChainId,
  getNetworkLabel,
} from 'scripts/Background/controllers/EVMChainController/utils';

function useNetworkLabel(asset: IAssetInfoState) {
  const activeNetwork: ActiveNetwork = useSelector(vaultSelectors.getActiveNetwork);

  let network = asset?.network ?? '';

  if (
    [
      AssetType.Ethereum,
      AssetType.Polygon,
      AssetType.Avalanche,
      AssetType.BSC,
      AssetType.Base,
    ].includes(asset?.id as AssetType)
  ) {
    const currentNetwork = getNetworkFromChainId(network);
    network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
  } else if (AssetType.Constellation === asset?.id) {
    network = activeNetwork.Constellation;
  }

  return getNetworkLabel(network);
}

export default useNetworkLabel;
