///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import Spinner from '@material-ui/core/CircularProgress';
import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import TxIcon from 'assets/images/svg/txIcon.svg';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Utils
///////////////////////

import { ellipsis } from 'scenes/home/helpers';

///////////////////////
// Types
///////////////////////

import { Transaction } from 'state/vault/types';

///////////////////////
// Styles
///////////////////////

import styles from './TxItem.scss';

type ITxItem = {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isGasSettingsVisible: boolean;
  getLinkUrl: (hash: string) => string;
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
  receivedOrSentText?: string;
  formattedDistanceDate?: string;
  renderGasSettings?: () => JSX.Element;
};

///////////////////////
// Component
///////////////////////

const TxItem: FC<ITxItem> = ({
  tx,
  isETH,
  isReceived,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  amount,
  fiatAmount,
  getLinkUrl,
  receivedOrSentText,
  formattedDistanceDate,
  renderGasSettings,
}) => {
  /////////////////////////
  // Renders
  ////////////////////////

  const RenderIcon: FC = () => {
    if (!isETH) {
      return (
        <>
          {tx.checkpointBlock ? (
            isReceived ? (
              <img src={'/' + TxIcon} className={styles.recvIcon} />
            ) : (
              <img src={'/' + TxIcon} />
            )
          ) : (
            <Spinner size={16} className={styles.spinner} />
          )}
        </>
      );
    }
    return (
      <>
        {!tx.assetId ? (
          isReceived ? (
            <img src={'/' + TxIcon} className={styles.recvIcon} />
          ) : (
            <img src={'/' + TxIcon} />
          )
        ) : (
          <Spinner size={16} className={styles.spinner} />
        )}
      </>
    );
  };

  return (
    <div
      onClick={() => {
        const url = getLinkUrl(tx.hash);

        if (!url) {
          return;
        }

        window.open(url, '_blank');
      }}
      className={styles.txItem}
    >
      {showGroupBar && (
        <div className={styles.groupBar}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.groupBarText}>{formattedDistanceDate}</TextV3.Caption>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.txIcon}>
          <div className={styles.iconCircle}>
            <RenderIcon />
          </div>
        </div>
        <div className={styles.txInfo}>
          <div>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.statusText}>{receivedOrSentText}</TextV3.CaptionStrong>
          </div>
          <div>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAddress}>{ellipsis(txTypeLabel)}</TextV3.Caption>
          </div>
        </div>
        <div className={styles.txAmount}>
          <TextV3.CaptionRegular dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountText}>
            {amount}
          </TextV3.CaptionRegular>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountFiatText}>
            ≈ {fiatAmount}
          </TextV3.Caption>
        </div>
      </div>
      {isGasSettingsVisible && <div className={styles.gasSettings}>{renderGasSettings()}</div>}
    </div>
  );
};

export default TxItem;
