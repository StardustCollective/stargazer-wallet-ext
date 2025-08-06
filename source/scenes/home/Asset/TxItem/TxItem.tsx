import React, { FC } from 'react';
import Spinner from '@material-ui/core/CircularProgress';
import TextV3 from 'components/TextV3';
import { ReactComponent as TxReceivedIcon } from 'assets/images/svg/tx-received.svg';
import { ReactComponent as TxSentIcon } from 'assets/images/svg/tx-sent.svg';
import { ReactComponent as TokenLockIcon } from 'assets/images/svg/token-lock.svg';
import { ReactComponent as TokenUnlockIcon } from 'assets/images/svg/token-unlock.svg';
import { ReactComponent as AllowSpendIcon } from 'assets/images/svg/allow-spend.svg';
import { ReactComponent as ExpiredTransactionIcon } from 'assets/images/svg/expired-transaction.svg';
import { ReactComponent as DelegateStakeWithdrawIcon } from 'assets/images/svg/delegated-stake-withdraw.svg';
import { ReactComponent as DelegateStakeIcon } from 'assets/images/svg/delegated-stake.svg';
import { ReactComponent as SpendTransactionIcon } from 'assets/images/svg/spend-transaction.svg';
import { ReactComponent as FeeTransactionIcon } from 'assets/images/svg/fee-transaction.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ellipsis } from 'scenes/home/helpers';
import styles from './TxItem.scss';
import ITxItemSettings, { RenderIconProps } from './types';
import { DAILY_TX } from './constants';
import { ActionType, Actions } from '@stardust-collective/dag4-network';

const StakingIconMap: Record<ActionType, React.ReactElement> = {
  TokenLock: <TokenLockIcon />,
  TokenUnlock: <TokenUnlockIcon />,
  AllowSpend: <AllowSpendIcon />,
  ExpiredAllowSpend: <ExpiredTransactionIcon />,
  DelegateStakeCreate: <DelegateStakeIcon />,
  DelegateStakeWithdraw: <DelegateStakeWithdrawIcon />,
  SpendTransaction: <SpendTransactionIcon />,
  ExpiredSpendTransaction: <ExpiredTransactionIcon />,
  FeeTransaction: <FeeTransactionIcon />,
}

const RenderIcon: FC<RenderIconProps> = ({ isETH, tx, isReceived, isRewardsTab, isStakingTransaction }) => {
  if (!isETH) {
    if (isStakingTransaction) {
      return StakingIconMap[tx.type as ActionType];
    }

    return tx.checkpointBlock || tx.blockHash || isRewardsTab ? (
      isReceived ? (
        <TxReceivedIcon />
      ) : (
        <TxSentIcon />
      )
    ) : (
      <Spinner size={20} />
    );
  }

  return !tx.assetId ? (
    isReceived ? (
      <TxReceivedIcon />
    ) : (
      <TxSentIcon />
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
  title,
  formattedDistanceDate,
  renderGasSettings,
}) => {
  const isStakingTransaction = Actions.includes(tx.type);
  const sign = isReceived || ['TokenUnlock', 'ExpiredAllowSpend', "DelegateStakeWithdraw", "ExpiredSpendTransaction"].includes(tx.type) ? '+' : '-';
  const showSmallLogo = !isETH
    ? !!tx?.checkpointBlock || !!tx?.blockHash || isRewardsTab || isStakingTransaction
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
              isStakingTransaction={isStakingTransaction}
              tx={tx}
            />
            {showSmallLogo && <img src={logo} alt="asset logo" className={styles.logo} />}
          </div>
        </div>
        <div className={styles.txInfo}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {title}
          </TextV3.CaptionStrong>
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
