///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';

///////////////////////////
// Styles
///////////////////////////

import styles from './Home.scss';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({
  activeWallet,
  balanceObject,
  balance,
  onBuyPressed,
}) => {

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div id={'home-scene'} className={styles.wrapper}>
      {activeWallet ? (
        <>
          {
            <>
              <section className={styles.center}>
                <div className={styles.price}>
                  <div className={styles.symbol}>
                    <TextV3.Body>
                      {balanceObject.symbol}
                    </TextV3.Body>
                  </div>
                  <div className={styles.balance}>
                    <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                      {balanceObject.balance}
                    </TextV3.HeaderDisplay>
                  </div>
                  <div className={styles.name}>
                    <TextV3.Body>
                      {balanceObject.name}
                    </TextV3.Body>
                  </div>
                </div>
                <div className={styles.bitcoinBalance}>
                  <TextV3.Body>
                    {`≈ ₿${balance}`}
                  </TextV3.Body>
                </div>
                <ButtonV3
                  label="Buy"
                  size={BUTTON_SIZES_ENUM.LARGE}
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  onClick={onBuyPressed}
                  extraStyle={styles.buyButton}
                />
              </section>
              <AssetsPanel />
            </>
          }
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: activeWallet,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default Home;
