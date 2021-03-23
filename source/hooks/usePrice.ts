import { useSelector } from 'react-redux';
import IPriceState from 'state/price/types';
import IWalletState, { AssetType } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

export function useFiat(currencyName = true, assetId?: string) {
  const { fiat, currency }: IPriceState = useSelector(
    (state: RootState) => state.price
  );
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];
  const priceId =
    assets[assetId || account?.activeAssetId || AssetType.Constellation]
      .priceId;

  return (amount: number, fraction = 4, basePriceId = priceId) => {
    const value =
      amount * (priceId ? fiat[basePriceId || priceId]?.price || 0 : 0);
    return `${currencyName ? currency.symbol : ''}${
      currencyName
        ? value.toLocaleString(navigator.language, {
            minimumFractionDigits: fraction,
            maximumFractionDigits: fraction,
          })
        : value
    }${currencyName ? ` ${currency.name}` : ''}`;
  };
}
