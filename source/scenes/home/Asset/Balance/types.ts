import React from 'react';

export interface IBalanceRoot {
  children: React.ReactNode;
}

export interface IBalanceHeader {
  children: React.ReactNode;
}

export interface IBalanceAvailableHeader {}
 
export interface IBalanceLockedHeader {
  onInfoPress: () => void;
}

export interface IBalanceContent {
  children: React.ReactNode;
}

export interface IBalanceTokenAmount {
  amount: string;
}

export interface IBalanceFiatAmount {
  amount: string;
}

export interface IBalanceFooter {
  children: React.ReactNode;
}

export interface IBalanceButtonBase {
  show?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export interface IBalanceBuy extends IBalanceButtonBase {}
export interface IBalanceGetAsset extends IBalanceButtonBase {
  symbol: string;
}
export interface IBalanceSend extends IBalanceButtonBase {}
export interface IBalanceReceive extends IBalanceButtonBase {}
export interface IBalanceSwap extends IBalanceButtonBase {}

export interface IBalance {
  Root: React.FC<IBalanceRoot>;
  Header: React.FC<IBalanceHeader>;
  Available: React.FC<IBalanceAvailableHeader>;
  Locked: React.FC<IBalanceLockedHeader>;
  Content: React.FC<IBalanceContent>;
  TokenAmount: React.FC<IBalanceTokenAmount>;
  FiatAmount: React.FC<IBalanceFiatAmount>;
  Footer: React.FC<IBalanceFooter>;
  Buy: React.FC<IBalanceBuy>;
  GetAsset?: React.FC<IBalanceGetAsset>;
  Send: React.FC<IBalanceSend>;
  Receive: React.FC<IBalanceReceive>;
  Swap: React.FC<IBalanceSwap>;
}