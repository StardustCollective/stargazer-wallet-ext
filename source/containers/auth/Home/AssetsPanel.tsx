import React, { FC, Fragment, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import GoTopIcon from '@material-ui/icons/VerticalAlignTop';
import AddCircle from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';

import StargazerIcon from 'assets/images/svg/stargazer.svg';
import { formatNumber } from 'containers/auth/helpers';

import mockAssets from './mockData';
import { Asset } from './types';
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
          <ul>
            {mockAssets.map((asset: Asset) => {
              return (
                <Fragment key={uuid()}>
                  <li
                    onClick={() => {
                      history.push('/asset');
                    }}
                  >
                    <div>
                      <div className={styles.iconWrapper}>
                        <img src={asset.logo}></img>
                      </div>
                      <span>
                        {asset.name}
                        <p>
                          <small>{formatNumber(asset.price)}</small>
                          <small
                            className={
                              asset.priceChange > 0 ? styles.green : styles.red
                            }
                          >
                            {asset.priceChange > 0 ? '+' : ''}
                            {formatNumber(asset.priceChange)}%
                          </small>
                        </p>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span>
                          {asset.balance}
                          <b>{asset.shortName}</b>
                        </span>
                      </span>
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
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
