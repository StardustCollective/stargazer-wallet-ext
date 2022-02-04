import { RootState } from 'state/store';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

import { useController } from 'hooks/index';
import walletSelectors from 'selectors/walletsSelectors';

import Container from 'components/Container';

import AssetsPanel from './AssetsPanel';

import IVaultState, { IAssetState } from 'state/vault/types';
import { INFTInfoState, INFTListState } from 'state/nfts/types';
import IAssetListState from 'state/assets/types';



const AssetsPanelContainer = () => {
    const controller = useController();
    const linkTo = useLinkTo();
    const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
    const assets: IAssetListState = useSelector((state: RootState) => state.assets);
    const nfts: INFTListState = useSelector((state: RootState) => state.nfts);
  
    const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
    const activeNFTAssets = useSelector(walletSelectors.selectNFTAssets);
  
    const handleSelectAsset = (asset: IAssetState) => {
      controller.wallet.account.updateAccountActiveAsset(asset);
      linkTo('/asset');
    };
  
    const handleSelectNFT = (nft: INFTInfoState) => {
      window.open(nft.link, '_blank');
    };
  


    return(
        <Container>
            <AssetsPanel 
              activeNetworkAssets={activeNetworkAssets}
              handleSelectAsset={handleSelectAsset}
              assets={assets}
              activeNFTAssets={activeNFTAssets}
              nfts={nfts}
              handleSelectNFT={handleSelectNFT}
              activeWallet={activeWallet}
            />
        </Container>
    );

}

export default AssetsPanelContainer;