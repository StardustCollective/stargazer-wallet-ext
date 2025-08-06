import React, { FC } from 'react';

import TextV3 from 'components/TextV3';

import { ReactComponent as WalletIcon} from 'assets/images/svg/single-wallet.svg';
import { ReactComponent as LockIcon} from 'assets/images/svg/lock.svg';
import { ReactComponent as BuyIcon} from 'assets/images/svg/dollar.svg';
import { ReactComponent as SendIcon} from 'assets/images/svg/arrow-up-right.svg';
import { ReactComponent as ReceiveIcon} from 'assets/images/svg/qr-code.svg';
import { ReactComponent as SwapIcon } from 'assets/images/svg/arrow-top-bottom.svg';
import { ReactComponent as InfoIcon } from 'assets/images/svg/info-outlined.svg';

import {
  IBalance,
  IBalanceRoot,
  IBalanceHeader,
  IBalanceAvailableHeader,
  IBalanceLockedHeader,
  IBalanceContent,
  IBalanceTokenAmount,
  IBalanceFiatAmount,
  IBalanceFooter,
  IBalanceBuy,
  IBalanceSend,
  IBalanceReceive,
  IBalanceSwap
} from './types';

import styles from './Balance.scss';

// const BUTTON_ICON_SIZE = 28;

const Root: FC<IBalanceRoot> = ({ children }) => (
  <div className={styles.balanceRoot}>
    {children}
  </div>
);

const Header: FC<IBalanceHeader> = ({ children }) => (
  <div className={styles.balanceHeaderSection}>
    {children}
  </div>
);

const Available: FC<IBalanceAvailableHeader> = () => (
  <div className={styles.balanceHeaderContent}>
    <div className={styles.balanceHeaderIcon}>
      <WalletIcon className={styles.balanceHeaderIconSvg} />
    </div>
    <TextV3.CaptionStrong extraStyles={styles.balanceHeaderTitle}>
      Available balance
    </TextV3.CaptionStrong> 
  </div>
);

const Locked: FC<IBalanceLockedHeader> = ({ onInfoPress }) => (
  <div className={styles.balanceHeaderContent}>
    <div className={styles.balanceHeaderLockedContent}>
      <div className={styles.balanceHeaderIcon}> 
        <LockIcon className={styles.balanceHeaderIconSvg} />
      </div>
      <TextV3.CaptionStrong extraStyles={styles.balanceHeaderTitle}>
        Locked balance
      </TextV3.CaptionStrong>
    </div>
    <button className={styles.balanceHeaderInfoIcon} onClick={onInfoPress}>
      <InfoIcon width={20} height={20} color="#FFFFFFA8" />
    </button>
  </div>
);

const Content: FC<IBalanceContent> = ({ children }) => (
  <div className={styles.balanceContentSection}>
    {children}
  </div>
);

const TokenAmount: FC<IBalanceTokenAmount> = ({ amount }) => (
  <TextV3.HeaderLarge extraStyles={styles.balanceTokenAmount}>
    {amount}
  </TextV3.HeaderLarge>
);

const FiatAmount: FC<IBalanceFiatAmount> = ({ amount }) => (
  <TextV3.CaptionRegular extraStyles={styles.balanceFiatAmount}>
    {amount}
  </TextV3.CaptionRegular>
);

const Footer: FC<IBalanceFooter> = ({ children }) => (
  <div className={styles.balanceFooterSection}>
    <div className={styles.balanceFooterButtons}>
      {children}
    </div>
  </div>
);

const BalanceButton: FC<{
  onPress: () => void;
  IconComponent: any;
  label: string;
  show?: boolean;
  disabled?: boolean;
}> = ({ onPress, IconComponent, label, show = true, disabled = false }) => {
  if (!show) return null;

  return (
    <button 
      onClick={onPress} 
      className={styles.balanceButton}
      disabled={disabled}
    >
      <div className={styles.balanceButtonIcon}>
        <IconComponent className={styles.balanceButtonIconSvg} />
      </div>
      <TextV3.CaptionStrong extraStyles={styles.balanceButtonLabel}>
        {label}
      </TextV3.CaptionStrong>
    </button>
  );
};

const Buy: FC<IBalanceBuy> = ({ show = true, onPress, disabled = false }) => (
  <BalanceButton
    onPress={onPress}
    IconComponent={BuyIcon}
    label="Buy"
    show={show}
    disabled={disabled}
  />
);

const Send: FC<IBalanceSend> = ({ show = true, onPress, disabled = false }) => (
  <BalanceButton
    onPress={onPress}
    IconComponent={SendIcon}
    label="Send"
    show={show}
    disabled={disabled}
  />
);

const Receive: FC<IBalanceReceive> = ({ show = true, onPress, disabled = false }) => (
  <BalanceButton
    onPress={onPress}
    IconComponent={ReceiveIcon}
    label="Receive"
    show={show}
    disabled={disabled}
  />
);

const Swap: FC<IBalanceSwap> = ({ show = true, onPress, disabled = false }) => (
  <BalanceButton
    onPress={onPress}
    IconComponent={SwapIcon}
    label="Swap"
    show={show}
    disabled={disabled}
  />
);

const Balance: IBalance = {
  Root,
  Header,
  Available,
  Locked,
  Content,
  TokenAmount,
  FiatAmount,
  Footer,
  Buy,
  Send,
  Receive,
  Swap,
};

export default Balance;