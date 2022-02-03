import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { RootState } from 'state/store';

import { useController } from 'hooks/index';
import walletSelectors from 'selectors/walletsSelectors';

import IVaultState, { IAssetState } from 'state/vault/types';
import { INFTInfoState, INFTListState } from 'state/nfts/types';
import IAssetListState from 'state/assets/types';

import styles from './../Home.scss';

const AssetsPanel: FC = () => {
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

  const renderAssetList = () => {
    return (
      <>
        {activeNetworkAssets.map((asset: any) => {
          return (
            <AssetItem
              id={asset.id}
              key={asset.id}
              asset={asset}
              assetInfo={assets[asset.id]}
              itemClicked={() => handleSelectAsset(asset)}
            />
          );
        })}
        {activeNFTAssets.map((nft: any) => {
          return (
            <AssetItem
              id={nft.id}
              key={nft.id}
              asset={nft}
              assetInfo={nfts[nft.id]}
              itemClicked={() => handleSelectNFT(nfts[nft.id])}
            />
          );
        })}
      </>
    );
  };

  return (
    <section className={styles.activity}>
      <div className={styles.content}>
        {Object.keys(activeWallet.assets).length ? (
          <>{renderAssetList()}</>
        ) : (
          <>
            <span className={styles.noTxComment}>You have no assets. Please add new Asset by Click + icon.</span>
            <img src={StargazerIcon} className={styles.stargazer} alt="stargazer" height="167" width="auto" />
          </>
        )}
      </div>
    </section>
  );
};

export default AssetsPanel;
