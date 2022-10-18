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
// constants
///////////////////////////

import {
  BUY_STRING,
  SWAP_STRING
} from './constants';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({
  activeWallet,
  balanceObject,
  balance,
  onBuyPressed,
  onSwapPressed,
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
                    <TextV3.Body extraStyles={styles.fiatType}>
                      {balanceObject.symbol}
                    </TextV3.Body>
                  </div>
                  <div className={styles.balance}>
                    <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                      {balanceObject.balance}
                    </TextV3.HeaderDisplay>
                  </div>
                  <div className={styles.name}>
                    <TextV3.Body extraStyles={styles.fiatType}>
                      {balanceObject.name}
                    </TextV3.Body>
                  </div>
                </div>
                <div className={styles.bitcoinBalance}>
                  <TextV3.Body extraStyles={styles.bitcoinBalance}>
                    {`≈ ₿${balance}`}
                  </TextV3.Body>
                </div>
                <div className={styles.buttons}>
                  <ButtonV3
                    label={BUY_STRING}
                    size={BUTTON_SIZES_ENUM.MEDIUM}
                    type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                    onClick={onBuyPressed}
                  />
                  <ButtonV3
                    label={SWAP_STRING}
                    size={BUTTON_SIZES_ENUM.MEDIUM}
                    type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                    onClick={onSwapPressed}
                  />
                </div>
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
