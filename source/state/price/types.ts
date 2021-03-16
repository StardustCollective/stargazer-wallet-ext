export interface IFiatAssetState {
  price: number;
  priceChange: number;
}
export interface IFiatState {
  [assetId: string]: IFiatAssetState;
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
