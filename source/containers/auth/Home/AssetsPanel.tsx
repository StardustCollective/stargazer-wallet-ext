import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import { v4 as uuid } from 'uuid';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { useController } from 'hooks/index';

import styles from './Home.scss';
import IAssetListState from '../../../state/assets/types';

const AssetsPanel: FC = () => {
  const history = useHistory();
  const controller = useController();
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

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
  };

  const handleSelectAsset = (asset: IAssetState) => {
    controller.wallet.account.updateAccountActiveAsset(asset);
    history.push('/asset');
  };

  const handleAddAsset = () => {
    history.push('/asset/add');
  };

  const renderAssetList = () => {
    return (
      <ul>
        {Object.values(activeWallet.assets)
          .filter(
            (asset) =>
              assets[asset.id].network === 'both' ||
              assets[asset.id].network ===
                activeNetwork[
                  asset.type === AssetType.Constellation
                    ? AssetType.Constellation
                    : AssetType.Ethereum
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
      </ul>
    );
  };

  return (
    <section
      className={clsx(styles.activity, { [styles.expanded]: isShowed })}
      onScroll={handleScroll}
    >
      <div className={styles.heading}>
        {(activeWallet.supportedAssets && activeWallet.supportedAssets.length > 1) && (
          <IconButton onClick={handleAddAsset} className={styles.addAssets}>
            <AddCircle />
          </IconButton>
        )}
        Your Assets
        {!!isShowed && (
          <IconButton className={styles.goTop} onClick={handleGoTop}>
            <GoTopIcon />
          </IconButton>
        )}
      </div>
      {Object.keys(activeWallet.assets).length ? (
        <>
          {renderAssetList()}
          <div className={styles.stargazer}>
            <img
              src={StargazerIcon}
              alt="stargazer"
              height="167"
              width="auto"
            />
          </div>
        </>
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
