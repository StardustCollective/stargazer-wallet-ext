///////////////////////
// Modules
///////////////////////

import React, { FC, ChangeEvent } from 'react';
import { formatDistanceDate } from '../../helpers';
import IVaultState from 'state/vault/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IAssetListState from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';

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
  onItemClick: (hash: string) => void;
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
  onItemClick,
}) => {

  const minGasPrice = tx.gasPrice ? tx.gasPrice * 1.10 : 0;

  /////////////////////////
  // Hooks
  ////////////////////////
  const { activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  let {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    setGasPrice,
    gasLimit,
    gasPrices,
    gasPrice } = useGasEstimate({
      toAddress: tx.toAddress,
      amount: tx.amount,
      asset: assets[activeAsset.id],
      data: tx.data,
    });

  const controller = useController();

  /////////////////////////
  // Callbacks
  //////////////////////////

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  }

  const onSpeedUpClick = (gas: number) => {

    const txConfig: ITransactionInfo = {
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date().getTime(),
      ethConfig: {
        gasPrice: gas,
        gasLimit,
        memo: tx.data,
        nonce: tx.nonce,
      }
    };

    controller.wallet.account.updateTempTx(txConfig);
    controller.wallet.account.confirmContractTempTx(activeAsset);
    controller.wallet.account.txController.removePendingTxHash(tx.txHash);
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
    <div onClick={() => { onItemClick(tx.hash) }} className={styles.txItem}>
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
            gasPrices={gasPrices}
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