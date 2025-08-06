import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import TextV3 from 'components/TextV3';

import WalletIcon from 'assets/images/svg/single-wallet.svg';
import LockIcon from 'assets/images/svg/lock.svg';
import BuyIcon from 'assets/images/svg/dollar.svg';
import SendIcon from 'assets/images/svg/arrow-up-right.svg';
import ReceiveIcon from 'assets/images/svg/qr-code.svg';
import SwapIcon from 'assets/images/svg/arrow-top-bottom.svg';
import InfoIcon from 'assets/images/svg/info-outlined.svg';

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

import styles from './styles';

const BUTTON_ICON_SIZE = 28;

const Root: FC<IBalanceRoot> = ({ children }) => (
  <LinearGradient
    useAngle
    angle={180}
    style={styles.root}
    locations={[0, 1]}
    colors={['#2B205B', '#211844']}
  >
    {children}
  </LinearGradient>
);

const Header: FC<IBalanceHeader> = ({ children }) => (
  <View style={styles.headerSection}>
    {children}
  </View>
);

const Available: FC<IBalanceAvailableHeader> = () => (
  <View style={styles.headerContent}>
    <View style={styles.headerIcon}>
      <WalletIcon width={20} height={20} color="#FFFFFFA8" />
    </View>
    <TextV3.CaptionStrong extraStyles={styles.headerTitle}>
      Available balance
    </TextV3.CaptionStrong>
  </View>
);

const Locked: FC<IBalanceLockedHeader> = ({ onInfoPress }) => (
  <View style={styles.headerContent}>
    <View style={styles.headerTitleContainer}> 
      <View style={styles.headerIcon}>
        <LockIcon width={20} height={20} color="#FFFFFFA8" />
      </View>
      <TextV3.CaptionStrong extraStyles={styles.headerTitle}>
        Locked balance
      </TextV3.CaptionStrong>
    </View>
    <TouchableOpacity style={styles.headerInfoIcon} onPress={onInfoPress}>
      <InfoIcon width={20} height={20} color="#FFFFFFA8" />
    </TouchableOpacity>
  </View>
);

const Content: FC<IBalanceContent> = ({ children }) => (
  <View style={styles.contentSection}>
    {children}
  </View>
);

const TokenAmount: FC<IBalanceTokenAmount> = ({ amount }) => (
  <TextV3.Header extraStyles={styles.tokenAmount}>
    {amount}
  </TextV3.Header>
);

const FiatAmount: FC<IBalanceFiatAmount> = ({ amount }) => (
  <TextV3.CaptionRegular extraStyles={styles.fiatAmount}>
    {amount}
  </TextV3.CaptionRegular>
);

const Footer: FC<IBalanceFooter> = ({ children }) => (
  <View style={styles.footerSection}>
    <View style={styles.footerButtons}>
      {children}
    </View>
  </View>
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
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.button}
      disabled={disabled}
    >
      <LinearGradient
        useAngle
        angle={180}
        style={styles.buttonIcon}
        locations={[0, 1]}
        colors={['#6C48F9', '#5430E0']}
      >
        <IconComponent 
          height={BUTTON_ICON_SIZE} 
          width={BUTTON_ICON_SIZE} 
          color="white"
        />
      </LinearGradient>
      <TextV3.CaptionStrong extraStyles={styles.buttonLabel}>
        {label}
      </TextV3.CaptionStrong>
    </TouchableOpacity>
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