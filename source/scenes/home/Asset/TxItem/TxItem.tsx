///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { formatDistanceDate } from '../../helpers';

///////////////////////
// Components
///////////////////////

import Spinner from '@material-ui/core/CircularProgress';
// import GasSettings from '../GasSettings';
import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import TxIcon from 'assets/images/svg/txIcon.svg';


///////////////////////
// Styles
///////////////////////

import styles from './TxItem.scss'

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////
import { Transaction } from 'state/vault/types';

type ITxItem = {
  tx: Transaction;
  isSelf: boolean;
  isReceived: boolean;
  isETH: boolean;
  isETHPending: boolean;
  // isGasSettingsVisible: boolean;
  // gasSettingsDefaults: {
  //   min: number;
  //   max: number;
  //   current: number;
  // }
  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
  onItemClick?: (hash: string) => void;
}

///////////////////////
// Component
///////////////////////

const TxItem: FC<ITxItem> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isETHPending,
  // isGasSettingsVisible,
  // gasSettingsDefaults,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  fiatAmount,
  onItemClick,
}) => {

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
            <Spinner size={24} className={styles.spinner} />
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
          <Spinner size={24} className={styles.spinner} />
        )}
      </>
    );
  };


  return (
    <div className={styles.txItem}>
      {showGroupBar && (
        <div className={styles.groupBar}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} >
            {formatDistanceDate(tx.timestamp)}
          </TextV3.CaptionStrong>
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
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
              {isSelf ? 'Self' : (isReceived ? 'Received' : 'Sent')} {currencySymbol}
            </TextV3.BodyStrong>
          </div>
          <div>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              {txTypeLabel}
            </TextV3.Caption>
          </div>
        </div>
        <div className={styles.txAmount}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
            {amount}
          </TextV3.BodyStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            ≈ {fiatAmount}
          </TextV3.Caption>
        </div>
      </div>
      {/* {isGasSettingsVisible &&
        <div className={styles.gasSettings}>
          <GasSettings values={gasSettingsDefaults} />
        </div>
      } */}
    </div>
  );

}

export default TxItem;