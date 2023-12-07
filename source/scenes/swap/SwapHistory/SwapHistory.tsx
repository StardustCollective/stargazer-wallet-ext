///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import dayjs from 'dayjs';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import ChevronRight from 'assets/images/svg/chevron-right.svg';
import TxIcon from 'assets/images/svg/txIcon.svg';

///////////////////////
// Types
///////////////////////

import ISwapHistory from './types';
import { IExolixTransaction, ExolixTransactionStatuses } from 'state/swap/types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './SwapHistory.scss';

///////////////////////
// constants
///////////////////////

import {
  PROCESSING_STRING,
  SWAP_STRING,
  TO_STRING,
  DATE_FORMAT,
  NO_TRANSACTIONS,
} from './constants';

const CIRCULAR_PROGRESS_SIZE = 14;
const CIRCULAR_PROGRESS_COLOR_WHITE = 'white';

const ConfirmDetails: FC<ISwapHistory> = ({
  transactionHistoryData,
  onTransactionCellPressed,
  isLoading,
}) => {
  const RenderHistoryCell = ({
    swapFromTicker,
    swapToTicker,
    amount,
    date,
    isProcessing = false,
    onPress,
  }: {
    swapFromTicker: string;
    swapToTicker: string;
    amount: string;
    date?: string;
    isProcessing?: boolean;
    onPress: () => void;
  }) => {
    const cellStateStyle = isProcessing
      ? styles.historyCellProcessing
      : styles.historyCellSettled;

    return (
      <div onClick={onPress} className={clsx(styles.historyCell, cellStateStyle)}>
        <div className={styles.historyCellLeft}>
          {isProcessing ? (
            <>
              <div className={styles.activityIndicator}>
                <CircularProgress
                  size={CIRCULAR_PROGRESS_SIZE}
                  style={{ color: CIRCULAR_PROGRESS_COLOR_WHITE }}
                />
              </div>
              <TextV3.CaptionStrong
                color={COLORS_ENUMS.BLACK}
                extraStyles={styles.processingText}
              >
                {PROCESSING_STRING}
              </TextV3.CaptionStrong>
            </>
          ) : (
            <>
              <img src={`/${TxIcon}`} />
              <div className={styles.swapInfo}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {SWAP_STRING} {swapFromTicker} {TO_STRING} {swapToTicker}
                </TextV3.CaptionStrong>
                <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                  {dayjs(date).format(DATE_FORMAT)}
                </TextV3.Caption>
              </div>
            </>
          )}
        </div>
        <div className={styles.historyCellRight}>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.amountText}
          >
            {amount} {swapFromTicker}
          </TextV3.CaptionRegular>
          <img src={`/${ChevronRight}`} />
        </div>
      </div>
    );
  };

  const RenderCells = (transactionHistoryData: IExolixTransaction[]) => {
    return transactionHistoryData.map((item: IExolixTransaction) => (
      <>
        <RenderHistoryCell
          swapFromTicker={item?.coinFrom.coinCode}
          swapToTicker={item?.coinTo.coinCode}
          amount={item?.amount.toString()}
          date={item?.createdAt}
          isProcessing={item?.status !== ExolixTransactionStatuses.SUCCESS}
          onPress={() => onTransactionCellPressed(item)}
        />
      </>
    ));
  };

  const ListEmptyComponent = () => (
    <div className={styles.listEmpty}>
      <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_TRANSACTIONS}</TextV3.Body>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className={styles.listEmpty}>
          <CircularProgress />
        </div>
      ) : transactionHistoryData === null || transactionHistoryData.length === 0 ? (
        <>
          <ListEmptyComponent />
        </>
      ) : (
        <div className={styles.container}>{RenderCells(transactionHistoryData)}</div>
      )}
      ;
    </>
  );
};

export default ConfirmDetails;
