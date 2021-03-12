export interface IFiatState {
  [assetId: string]: number;
}

export interface ICurrency {
  id: 'usd';
  symbol: '$';
  name: 'USD';
}

export default interface IPriceState {
  fiat: IFiatState;
  currency: ICurrency;
}
