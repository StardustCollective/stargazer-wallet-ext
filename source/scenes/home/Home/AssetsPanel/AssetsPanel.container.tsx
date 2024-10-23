import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import walletSelectors from 'selectors/walletsSelectors';
import { getAccountController } from 'utils/controllersUtils';
import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import AssetsPanel from './AssetsPanel';
import { IUserState } from 'state/user/types';
import { getDagAddress } from 'utils/wallet';
import { DAG_NETWORK, ELPACA_LEARN_MORE } from 'constants/index';
import { open } from 'utils/browser';

const SECONDS = 15 * 1000; // 15 seconds

const AssetsPanelContainer: FC = () => {
  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const { activeWallet, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const { elpaca }: IUserState = useSelector((state: RootState) => state.user);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const [showClaimCard, setShowClaimCard] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const hasDagAddress = !!getDagAddress(activeWallet);
  const isMainnet = activeNetwork.Constellation === DAG_NETWORK.main2.id;
  const hasClaimWindow = !!elpaca?.streak?.data?.currentClaimWindow;
  const showCard = showClaimCard && hasDagAddress && isMainnet && hasClaimWindow;

  useEffect(() => {
    if (elpaca?.claim?.data?.hash) {
      accountController.assetsController.clearClaimHash();
      setTimeout(() => {
        // Wait 15 seconds for the update
        accountController.assetsController.fetchElpacaStreak();
      }, SECONDS);
    }
  }, [elpaca?.claim?.data?.hash]);

  useEffect(() => {
    if (!elpaca?.streak?.data?.claimEnabled) {
      setClaimLoading(false);
    }
  }, [elpaca?.streak?.data?.claimEnabled]);

  const handleSelectAsset = (asset: IAssetState) => {
    accountController.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  const handleAddTokens = () => {
    linkTo('/asset/add');
  };

  const handleClaim = async () => {
    setClaimLoading(true);
    await accountController.assetsController.claimElpaca();
  };

  const handleLearnMore = async () => {
    await open(ELPACA_LEARN_MORE);
  };

  const handleClose = () => {
    setShowClaimCard(false);
  };

  return (
    <AssetsPanel
      activeNetworkAssets={activeNetworkAssets}
      assets={assets}
      activeWallet={activeWallet}
      showClaimCard={showCard}
      elpaca={elpaca}
      claimLoading={claimLoading}
      handleSelectAsset={handleSelectAsset}
      handleAddTokens={handleAddTokens}
      handleClaim={handleClaim}
      handleClose={handleClose}
      handleLearnMore={handleLearnMore}
    />
  );
};

export default AssetsPanelContainer;
