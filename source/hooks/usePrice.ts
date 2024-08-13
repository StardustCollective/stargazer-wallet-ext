import { useSelector } from 'react-redux';
import IPriceState from 'state/price/types';
import IVaultState from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import { formatNumber } from 'scenes/home/helpers';
import walletSelectors from 'selectors/walletsSelectors';
import { DEFAULT_LANGUAGE } from 'constants/index';

// eslint-disable-next-line default-param-last
export function useFiat(currencyName = true, asset?: IAssetInfoState) {
  const { activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);

  const { fiat, currency }: IPriceState = useSelector((state: RootState) => state.price);

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  // eslint-disable-next-line default-param-last
  return (amount: number, fraction = 4, basePriceId?: string) => {
    let priceId = basePriceId;

    if (!priceId) {
      priceId = asset ? asset.priceId : assets[activeAsset?.id]?.priceId;
    }

    const assetPrice = priceId ? fiat[basePriceId || priceId]?.price || 0 : 0;

    const value = amount * assetPrice;

    return `${currencyName ? currency.symbol : ''}${
      currencyName
        ? value.toLocaleString(DEFAULT_LANGUAGE, {
            minimumFractionDigits: fraction,
            maximumFractionDigits: fraction,
          })
        : value
    }${currencyName ? ` ${currency.name}` : ''}`;
  };
}

export type IBalanceObject = {
  symbol?: string;
  balance: string;
  name?: string;
};

export function useTotalBalance(): [IBalanceObject, string] {
  const { fiat, currency }: IPriceState = useSelector((state: RootState) => state.price);
  const { balances }: IVaultState = useSelector((state: RootState) => state.vault);
  const assetList: IAssetListState = useSelector((state: RootState) => state.assets);

  const assetIds: any = useSelector(walletSelectors.selectActiveNetworkAssetIds);

  if (!assetIds) {
    return [{ symbol: '', balance: '0', name: '' }, '0'];
  }

  const priceIds = assetIds.map((assetId: any) => assetList[assetId]?.priceId || '');

  let balance = 0;

  for (let i = 0; i < assetIds.length; i += 1) {
    balance += (Number(balances[assetIds[i]]) || 0) * (fiat[priceIds[i]]?.price || 0);
  }

  let balanceStr = formatNumber(balance, 2, balance >= 0.01 ? 2 : 4);

  const balanceObject = {
    symbol: currency.symbol || '',
    balance: balanceStr,
    name: currency.name || '',
  };

  balance /= fiat.bitcoin?.price || 0;

  balanceStr = formatNumber(balance, 2, balance >= 0.01 ? 2 : 4);

  return [balanceObject, balanceStr];
}
