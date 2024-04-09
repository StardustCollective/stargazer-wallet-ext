import React, { FC } from 'react';
import Spinner from '@material-ui/core/CircularProgress';
import TextV3 from 'components/TextV3';
import TxReceivedIcon from 'assets/images/svg/tx-received.svg';
import TxSentIcon from 'assets/images/svg/tx-sent.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ellipsis } from 'scenes/home/helpers';
import styles from './TxItem.scss';
import ITxItemSettings, { RenderIconProps } from './types';
import { DAILY_TX } from './constants';

const RenderIcon: FC<RenderIconProps> = ({ isETH, tx, isReceived, isRewardsTab }) => {
  if (!isETH) {
    return tx.checkpointBlock || tx.blockHash || isRewardsTab ? (
      isReceived ? (
        <img src={`/${TxReceivedIcon}`} alt="Received icon" />
      ) : (
        <img src={`/${TxSentIcon}`} alt="Sent icon" />
      )
    ) : (
      <Spinner size={20} />
    );
  }

  return !tx.assetId ? (
    isReceived ? (
      <img src={`/${TxReceivedIcon}`} alt="Received icon" />
    ) : (
      <img src={`/${TxSentIcon}`} alt="Sent icon" />
    )
  ) : (
    <Spinner size={20} />
  );
};

const TxItem: FC<ITxItemSettings> = ({
  tx,
  isETH,
  isReceived,
  isRewardsTab,
  logo,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  amount,
  fiatAmount,
  rewardsCount,
  getLinkUrl,
  receivedOrSentText,
  formattedDistanceDate,
  renderGasSettings,
}) => {
  const sign = isReceived ? '+' : '-';
  const showSmallLogo = !isETH
    ? !!tx?.checkpointBlock || !!tx?.blockHash || isRewardsTab
    : !tx?.assetId;

  const handleOnClick = () => {
    if (!getLinkUrl) {
      return;
    }

    const url = getLinkUrl(tx);

    if (!url) {
      return;
    }

    window.open(url, '_blank');
  };

  const renderSubtitleContent = () => {
    if (!rewardsCount && !txTypeLabel) {
      return null;
    }

    let content = '';

    if (txTypeLabel) {
      content = ellipsis(txTypeLabel);
    }

    if (rewardsCount) {
      content = `${DAILY_TX} ${rewardsCount}`;
    }

    return (
      <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.txAddress}>
        {content}
      </TextV3.Caption>
    );
  };

  return (
    <div role="listitem" onClick={handleOnClick} className={styles.txItem}>
      {showGroupBar && (
        <div className={styles.groupBar}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.groupBarText}>
            {formattedDistanceDate}
          </TextV3.Caption>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.txIcon}>
          <div className={styles.iconCircle}>
            <RenderIcon
              isETH={isETH}
              isReceived={isReceived}
              isRewardsTab={isRewardsTab}
              tx={tx}
            />
            {showSmallLogo && (
              <div className={styles.logoContainer}>
                <img src={logo} alt="asset logo" className={styles.logo} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.txInfo}>
          <div>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              {receivedOrSentText}
            </TextV3.CaptionStrong>
          </div>
          {renderSubtitleContent()}
        </div>
        <div className={styles.txAmount}>
          <TextV3.CaptionStrong
            dynamic
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.txAmountText}
          >
            {sign}
            {amount}
          </TextV3.CaptionStrong>
          <TextV3.Caption
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.txAmountFiatText}
          >
            {fiatAmount}
          </TextV3.Caption>
        </div>
      </div>
      {isGasSettingsVisible && (
        <div className={styles.gasSettings}>{renderGasSettings()}</div>
      )}
    </div>
  );
};

export default TxItem;
