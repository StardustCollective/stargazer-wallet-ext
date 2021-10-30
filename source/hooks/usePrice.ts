import { useSelector } from 'react-redux';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { formatNumber } from 'scenes/home/helpers';
import { IAssetInfoState } from 'state/assets/types';

export function useFiat(currencyName = true, asset?: IAssetInfoState) {
  const { activeAsset }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const { fiat, currency }: IPriceState = useSelector(
    (state: RootState) => state.price
  );

  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  return (amount: number, fraction = 4, basePriceId?: string) => {
    const priceId = basePriceId
      ? basePriceId
      : asset
      ? asset.priceId
      : assets[activeAsset.id]
      ? assets[activeAsset.id].priceId
      : null;

    const assetPrice = priceId ? fiat[basePriceId || priceId]?.price || 0 : 0;

    const value = amount * assetPrice;
    
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

type IBalanceObject = {
  symbol?: string;
  balance: string;
  name?: string;
};

export function useTotalBalance(): [IBalanceObject, string] {
  const { fiat, currency }: IPriceState = useSelector(
    (state: RootState) => state.price
  );
  const { activeWallet, activeNetwork, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assetList: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  if (!activeWallet?.assets)
    return [{ symbol: '', balance: '0', name: '' }, '0'];

  const assetIds = activeWallet.assets
    .filter(
      (asset) =>
        assetList[asset.id].network === 'both' ||
        assetList[asset.id].network ===
          activeNetwork[
            asset.type === AssetType.Constellation
              ? KeyringNetwork.Constellation
              : KeyringNetwork.Ethereum
          ]
    )
    .map((asset) => asset.id);

  const priceIds = assetIds.map((assetId) => assetList[assetId].priceId || '');

  let balance = 0;

  for (let i = 0; i < assetIds.length; i += 1) {
    balance +=
      (Number(balances[assetIds[i]]) || 0) * (fiat[priceIds[i]]?.price || 0);
  }

  let balanceStr = formatNumber(balance, 2, balance >= 0.01 ? 2 : 4);

  const balanceObject = {
    symbol: currency.symbol || '',
    balance: balanceStr,
    name: currency.name || '',
  };

  balance = balance / (fiat.bitcoin?.price || 0);

  balanceStr = formatNumber(balance, 2, balance >= 0.01 ? 2 : 4);

  return [balanceObject, balanceStr];
}
