/// ////////////////////
// Modules
/// ////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

/// ////////////////////
// Components
/// ////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';

import TxsPanel from '../TxsPanel/TxsPanel';

import styles from './Asset.scss';

import IAssetSettings from './types';

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  balanceText,
  fiatAmount,
  transactions,
  onSendClick,
  assets,
}) => {
  return (
    <div className={styles.wrapper}>
      {activeWallet && activeAsset ? (
        <>
          <section className={styles.center}>
            <div className={styles.balance}>
              <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                {balanceText}{' '}
              </TextV3.HeaderDisplay>
              <TextV3.Body>{assets[activeAsset.id].symbol}</TextV3.Body>
            </div>
            <div className={styles.fiatBalance}>
              <TextV3.Body>≈ {fiatAmount}</TextV3.Body>
            </div>
            <div className={styles.actions}>
              <ButtonV3
                label="Send"
                size={BUTTON_SIZES_ENUM.LARGE}
                type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
                onClick={onSendClick}
              />
            </div>
          </section>
          <TxsPanel address={activeAsset.address} transactions={transactions} />
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: activeAsset,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default AssetDetail;
