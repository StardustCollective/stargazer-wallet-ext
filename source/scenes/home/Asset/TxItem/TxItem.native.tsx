import React, { FC } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import TextV3 from 'components/TextV3';
import TokenLockIcon from 'assets/images/svg/token-lock.svg';
import TokenUnlockIcon from 'assets/images/svg/token-unlock.svg';
import AllowSpendIcon from 'assets/images/svg/allow-spend.svg';
import ExpiredTransactionIcon from 'assets/images/svg/expired-transaction.svg';
import DelegateStakeIcon from 'assets/images/svg/delegated-stake.svg';
import DelegateStakeWithdrawIcon from 'assets/images/svg/delegated-stake-withdraw.svg';
import SpendTransactionIcon from 'assets/images/svg/spend-transaction.svg';
import FeeTransactionIcon from 'assets/images/svg/fee-transaction.svg';
import TxReceivedIcon from 'assets/images/svg/tx-received.svg';
import TxSentIcon from 'assets/images/svg/tx-sent.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ellipsis } from 'scenes/home/helpers';
import styles from './styles';
import { DAILY_TX } from './constants';
import ITxItemSettings, { RenderIconProps } from './types';
import { ActionType, Actions } from '@stardust-collective/dag4-network';
import { open } from 'utils/browser';

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

const RenderIcon: FC<RenderIconProps> = ({ tx, isETH, isReceived, isRewardsTab, isStakingTransaction }) => {
  const { checkpointBlock, blockHash, assetId } = tx;
  if (!isETH) {
    if (isStakingTransaction) {
      return StakingIconMap[tx.type as ActionType];
    }
    // checkpointBlock is V1 and blockHash is V2
    if (checkpointBlock || blockHash || isRewardsTab) {
      return isReceived ? <TxReceivedIcon /> : <TxSentIcon />;
    }
    return <Progress.Circle size={20} indeterminate />;
  }

  if (!assetId) {
    return isReceived ? <TxReceivedIcon /> : <TxSentIcon />;
  }

  return <Progress.Circle size={20} indeterminate />;
};

const TxItem: FC<ITxItemSettings> = ({
  tx,
  isETH,
  isRewardsTab,
  isReceived,
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
  logo,
}) => {
  const isStakingTransaction = Actions.includes(tx.type);
  const sign = isReceived || ['TokenUnlock', 'ExpiredAllowSpend', "DelegateStakeWithdraw", "ExpiredSpendTransaction"].includes(tx.type) ? '+' : '-';
  const showSmallLogo = !isETH
    ? !!tx?.checkpointBlock || !!tx?.blockHash || isRewardsTab ||  isStakingTransaction
    : !tx?.assetId;

  const handleOnPress = (e) => {
    e.stopPropagation();

    if (!getLinkUrl) {
      return;
    }

    const url = getLinkUrl(tx);

    if (!url) {
      return;
    }

    open(url);
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

    return <TextV3.Caption extraStyles={styles.txAddress}>{content}</TextV3.Caption>;
  };

  return (
    <TouchableOpacity onPress={handleOnPress} activeOpacity={0.9}>
      <View style={styles.txItem}>
        {showGroupBar && (
          <View style={styles.groupBar}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.groupBarText}>
              {formattedDistanceDate}
            </TextV3.Caption>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.iconCircle}>
              <RenderIcon
                tx={tx}
                isETH={isETH}
                isReceived={isReceived}
                isRewardsTab={isRewardsTab}
                isStakingTransaction={isStakingTransaction}
              />
              {showSmallLogo && <Image source={{ uri: logo }} style={styles.logo} />}
            </View>
            <View style={styles.txInfoWrapper}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                {title}
              </TextV3.CaptionStrong>
              {renderSubtitleContent()}
            </View>
          </View>
          <View style={styles.txAmountWrapper}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
              {sign}
              {amount}
            </TextV3.CaptionStrong>
            <TextV3.Caption
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.txAmountFiatText}
              numberOfLines={1}
            >
              {fiatAmount}
            </TextV3.Caption>
          </View>
        </View>
        {isGasSettingsVisible && (
          <View style={styles.gasSettings}>{renderGasSettings()}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TxItem;
