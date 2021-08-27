import React, { FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import { useLinkTo } from '@react-navigation/native';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { useController } from 'hooks/index';

import styles from './Home.scss';
import IAssetListState from '../../../state/assets/types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

const AssetsPanel: FC = () => {
  const controller = useController();
  const linkTo = useLinkTo();
  const [isShowed, setShowed] = useState<boolean>(false);
  const [scrollArea, setScrollArea] = useState<HTMLElement>();
  const { activeWallet, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  const handleScroll = useCallback((ev) => {
    ev.persist();
    if (ev.target.scrollTop) setShowed(true);
    setScrollArea(ev.target);
  }, []);

  const handleSelectAsset = async (asset: IAssetState) => {
    await controller.wallet.account.updateAccountActiveAsset(asset);
    linkTo('/asset');
  };

  // const handleAddAsset = () => {
  //   history.push('/asset/add');
  // };

  const renderAssetList = () => {
    return (
      <>
        {Object.values(activeWallet.assets)
          .filter(
            (asset) =>
              assets[asset.id].network === 'both' ||
              assets[asset.id].network ===
                activeNetwork[
                  asset.type === AssetType.Constellation
                    ? KeyringNetwork.Constellation
                    : KeyringNetwork.Ethereum
                ]
          )
          .map((asset) => {
            return (
              <AssetItem
                key={uuid()}
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
      className={clsx(styles.activity, { [styles.expanded]: isShowed })}
      onScroll={handleScroll}
    >
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
    </section>
  );
};

export default AssetsPanel;
