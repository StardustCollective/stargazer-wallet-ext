import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import walletSelectors from 'selectors/walletsSelectors';
import { getAccountController } from 'utils/controllersUtils';
import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { getDagAddress } from 'utils/wallet';
import { DAG_NETWORK } from 'constants/index';
import userSelectors from 'selectors/userSelectors';
import AssetsPanel from './AssetsPanel';

const AssetsPanelContainer: FC = () => {
  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const { activeWallet, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const isElpacaHidden = useSelector(userSelectors.getElpacaHidden);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const hasDagAddress = !!getDagAddress(activeWallet);
  const isMainnet = activeNetwork.Constellation === DAG_NETWORK.main2.id;
  const showCard = !isElpacaHidden && hasDagAddress && isMainnet;

  const handleSelectAsset = (asset: IAssetState) => {
    accountController.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  const handleAddTokens = () => {
    linkTo('/asset/add');
  };

  const handleHideCard = () => {
    accountController.assetsController.setElpacaHidden(true);
  };

  return (
    <AssetsPanel
      activeNetworkAssets={activeNetworkAssets}
      assets={assets}
      activeWallet={activeWallet}
      showClaimCard={showCard}
      handleSelectAsset={handleSelectAsset}
      handleAddTokens={handleAddTokens}
      handleHideCard={handleHideCard}
    />
  );
};

export default AssetsPanelContainer;
