///////////////////////
// Modules
///////////////////////

import React, { FC, ChangeEvent } from 'react';
import { formatDistanceDate } from '../../helpers';

///////////////////////
// Components
///////////////////////

import Spinner from '@material-ui/core/CircularProgress';
import GasSettings from '../GasSettings';
import TextV3 from 'components/TextV3';

///////////////////////
// Hooks
///////////////////////

import useGasEstimate from 'hooks/useGasEstimate';
import { useController } from 'hooks/index';

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
  isGasSettingsVisible: boolean;

  showGroupBar: boolean;
  txTypeLabel: string;
  currencySymbol: string;
  amount: string;
  fiatAmount: string;
}

const MAX_GAS_NUMBER = 200;

///////////////////////
// Component
///////////////////////

const TxItem: FC<ITxItem> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  fiatAmount,
}) => {

  const minGasPrice = tx.gasPrice ? tx.gasPrice * 1.10 : 0;

  /////////////////////////
  // Hooks
  ////////////////////////


  let {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    setGasPrice,
    gasPrice } = useGasEstimate({
      toAddress: tx.toAddress,
      amount: tx.amount
    });
  const controller = useController();

  /////////////////////////
  // Callbacks
  ////////////////////////

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  }

  const onSpeedUpClick = (gas: number) => {
    controller.wallet.account
      .updatePendingTx(tx, gas)
    console.log('Speed Up Clicked');
  }

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
          <TextV3.BodyStrong dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountText}>
            {amount}
          </TextV3.BodyStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAmountFiatText}>
            ≈ {fiatAmount}
          </TextV3.Caption>
        </div>
      </div>
      {isGasSettingsVisible &&
        <div className={styles.gasSettings}>
          <GasSettings
            values={{
              min: minGasPrice,
              max: MAX_GAS_NUMBER,
              current: gasPrice,
            }}
            speedLabel={gasSpeedLabel}
            gasFeeLabel={gasFee}
            onSliderChange={onGasPriceChanged}
            onSpeedUpClick={onSpeedUpClick}
            gasPrice={gasPrice}
          />
        </div>
      }
    </div>
  );

}

export default TxItem;