import React, { FC } from 'react';
import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { INFTInfoState } from 'state/nfts/types';
import IAssetPanel from './types';
import styles from './AssetsPanel.scss';

const AssetsPanel: FC<IAssetPanel> = ({
  activeNetworkAssets,
  handleSelectAsset,
  assets,
  activeNFTAssets,
  nfts,
  activeWallet,
}) => {
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
