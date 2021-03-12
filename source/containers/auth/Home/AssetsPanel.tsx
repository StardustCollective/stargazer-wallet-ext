import React, { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import AssetItem from 'components/AssetItem';
import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { Asset } from 'types/asset';

import mockAssets from './mockData';
import styles from './Home.scss';

interface IAssetsPanel {
  setShowAddAsset: () => void;
}

const AssetsPanel: FC<IAssetsPanel> = ({ setShowAddAsset }: IAssetsPanel) => {
  const history = useHistory();
  const [isShowed, setShowed] = useState<boolean>(false);
  const [scrollArea, setScrollArea] = useState<HTMLElement>();

  const handleScroll = useCallback((ev) => {
    ev.persist();
    // setShowed(ev.target.scrollTop);
    if (ev.target.scrollTop) setShowed(true);
    setScrollArea(ev.target);
  }, []);

  const handleGoTop = () => {
    scrollArea!.scrollTo({ top: 0, behavior: 'smooth' });
    setShowed(false);
  };

  const renderAssetList = () => {
    return (
      <ul>
        {mockAssets.map((asset: Asset) => {
          return (
            <AssetItem
              key={asset.name}
              asset={asset}
              itemClicked={() => {
                console.log('Asset Item Clicked');
                history.push('/asset');
              }}
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
        <AddCircle className={styles.addAssets} onClick={setShowAddAsset} />
        Your Assets
        {!!isShowed && (
          <IconButton className={styles.goTop} onClick={handleGoTop}>
            <GoTopIcon />
          </IconButton>
        )}
      </div>
      {mockAssets.length ? (
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
