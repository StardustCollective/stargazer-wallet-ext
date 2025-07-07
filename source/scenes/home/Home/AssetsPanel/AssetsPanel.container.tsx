import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import walletSelectors from 'selectors/walletsSelectors';
import { getAccountController } from 'utils/controllersUtils';
import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import AssetsPanel from './AssetsPanel';

const AssetsPanelContainer: FC = () => {
  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);

  const handleSelectAsset = (asset: IAssetState) => {
    accountController.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  const handleAddTokens = () => {
    linkTo('/asset/add');
  };

  return (
    <AssetsPanel
      activeNetworkAssets={activeNetworkAssets}
      assets={assets}
      activeWallet={activeWallet}
      handleSelectAsset={handleSelectAsset}
      handleAddTokens={handleAddTokens}
    />
  );
};

export default AssetsPanelContainer;
