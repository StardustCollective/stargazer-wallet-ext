///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import AssetsPanel from './AssetsPanel';
import Portal from '@reach/portal';

///////////////////////////
// Styles
///////////////////////////

import styles from './Home.scss';

///////////////////////////
// Types
///////////////////////////

import { IHome } from './types';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Scene
///////////////////////////

const Home: FC<IHome> = ({
  activeWallet,
  balanceObject,
  balance,
  onBuyPressed,
}) => {
  {/* TODO-421: Remove when Mainnet 2.0 is available */}
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const isModalVisible = activeNetwork.Constellation === 'main';
  const [modalOpen, setModalOpen] = useState(isModalVisible);

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
                <ButtonV3
                  label="Buy"
                  size={BUTTON_SIZES_ENUM.LARGE}
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  onClick={onBuyPressed}
                  extraStyle={styles.buyButton}
                />
              </section>
              <AssetsPanel />
              {/* TODO-421: Remove this modal when Mainnet 2.0 is available */}
              <Portal>
                <section className={clsx(styles.modalMask, { [styles.open]: modalOpen })}>
                  <div className={styles.modal}>
                    <section className={styles.titleContainer}>
                      <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>Notice</TextV3.BodyStrong>
                    </section>
                    <section className={styles.textContainer}>
                      <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK} extraStyles={styles.modalText}>Constellation mainnet will upgrade to v2.0 at 12:00 UTC on September 28th. At that time mainnet 1.0 will become obsolete. You will need to go to Settings -{'>'} Networks and switch to the 2.0 network in order to connect to the new network and interact with your Constellation assets.</TextV3.CaptionRegular>
                    </section>
                    <section className={styles.buttonContainer}>
                      <ButtonV3
                        label="Ok"
                        extraStyle={styles.extraButtonStyles}
                        onClick={() => setModalOpen(false)}
                      />
                    </section>
                  </div>
                </section>
              </Portal>
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
