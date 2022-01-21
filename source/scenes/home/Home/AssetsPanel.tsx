import React, { FC } from 'react';
import { useSelector } from 'react-redux';
// import { v4 as uuid } from 'uuid';
import { useLinkTo } from '@react-navigation/native';
// import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { RootState } from 'state/store';
import IVaultState, { IAssetState } from 'state/vault/types';
import { useController } from 'hooks/index';
import walletSelectors from 'selectors/walletsSelectors';

import styles from './Home.scss';
import IAssetListState from '../../../state/assets/types';


const AssetsPanel: FC = () => {
  const controller = useController();
  const linkTo = useLinkTo();
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);

  const handleSelectAsset = async (asset: IAssetState) => {
    await controller.wallet.account.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  console.log('activeNetworkAssets: ', activeNetworkAssets);

  const renderAssetList = () => {
    return (
      <>
        {activeNetworkAssets
          .map((asset: any) => {
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
      </>
    );
  };

  return (
    <section
      className={styles.activity}
    >
      <div className={styles.content}>
        {Object.keys(activeWallet.assets).length ? (
          <>{renderAssetList()}</>
        ) : (
          <>
            <span className={styles.noTxComment}>
              You have no assets. Please add new Asset by Click + icon.
            </span>
            <img
              src={StargazerIcon}
              className={styles.stargazer}
              alt="stargazer"
              height="167"
              width="auto"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default AssetsPanel;
