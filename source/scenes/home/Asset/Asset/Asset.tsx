/// ////////////////////
// Modules
/// ////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

/// ////////////////////
// Components
/// ////////////////////

import CircularProgress from '@material-ui/core/CircularProgress';
import QRCodeModal from 'components/QRCodeModal';
import TextV3 from 'components/TextV3';

import TxsPanel from '../TxsPanel';

import styles from './Asset.scss';

import IAssetSettings from './types';
import AssetButtons from '../AssetButtons';

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  activeNetwork,
  balanceText,
  fiatAmount,
  transactions,
  showQrCode,
  onSendClick,
  setShowQrCode,
  assets,
  isAddressCopied,
  copyAddress,
}) => {
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';
  return (
    <div className={styles.wrapper}>
      {activeWallet && activeAsset ? (
        <>
          <section className={styles.center}>
            <div className={styles.balance}>
              <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                {balanceText}{' '}
              </TextV3.HeaderDisplay>
              <TextV3.Body extraStyles={styles.symbolText}>{assets[activeAsset?.id]?.symbol}</TextV3.Body>
            </div>
            <div className={styles.fiatBalance}>
              <TextV3.Body extraStyles={styles.fiatText}>≈ {fiatAmount}</TextV3.Body>
            </div>
            <div className={styles.actions}>
              <AssetButtons setShowQrCode={setShowQrCode} onSendClick={onSendClick} assetId={activeAsset?.id} />
            </div>
          </section>
          <QRCodeModal
            open={showQrCode}
            onClose={() => setShowQrCode(false)}
            address={activeAsset.address}
            asset={assets[activeAsset?.id]}
            textTooltip={textTooltip}
            copyAddress={copyAddress}
            activeNetwork={activeNetwork}
          />
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
