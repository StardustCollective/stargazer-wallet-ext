import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { RootState } from 'state/store';
import IWalletState, { AssetType } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';
import { useController } from 'hooks/index';

import styles from './Home.scss';

const AssetsPanel: FC = () => {
  const history = useHistory();
  const controller = useController();
  const [isShowed, setShowed] = useState<boolean>(false);
  const [scrollArea, setScrollArea] = useState<HTMLElement>();
  const {
    accounts,
    activeAccountId,
    activeNetwork,
  }: IWalletState = useSelector((state: RootState) => state.wallet);
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];

  const handleScroll = useCallback((ev) => {
    ev.persist();
    if (ev.target.scrollTop) setShowed(true);
    setScrollArea(ev.target);
  }, []);

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
  };

  const handleSelectAsset = (assetId: string) => {
    controller.wallet.account.updateAccountActiveAsset(
      activeAccountId,
      assetId
    );
    history.push('/asset');
  };

  const handleAddAsset = () => {
    history.push('/asset/add');
  };

  const renderAssetList = () => {
    return (
      <ul>
        {Object.values(account.assets)
          .filter(
            (asset) =>
              assets[asset.id].network === 'both' ||
              assets[asset.id].network ===
                activeNetwork[
                  asset.id === AssetType.Constellation
                    ? AssetType.Constellation
                    : AssetType.Ethereum
                ]
          )
          .map((asset) => {
            return (
              <AssetItem
                key={asset.id}
                asset={assets[asset.id]}
                itemClicked={() => handleSelectAsset(asset.id)}
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
        <IconButton onClick={handleAddAsset} className={styles.addAssets}>
          <AddCircle />
        </IconButton>
        Your Assets
        {!!isShowed && (
          <IconButton className={styles.goTop} onClick={handleGoTop}>
            <GoTopIcon />
          </IconButton>
        )}
      </div>
      {Object.keys(account.assets).length ? (
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
