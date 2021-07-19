import { useSelector } from 'react-redux';
import IPriceState from 'state/price/types';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';

export function useFiat(currencyName = true) {
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
    const priceId = basePriceId || assets[activeAsset.id].priceId;
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

export function useTotalBalance(currencyName = true) {
  const { fiat, currency }: IPriceState = useSelector(
    (state: RootState) => state.price
  );
  const { activeWallet, activeNetwork, balances}: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assetList: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  if (!activeWallet?.assets) return ['0', '0'];

  const assetIds = activeWallet.assets
    .filter(
      (asset) =>
        assetList[asset.id].network === 'both' ||
        assetList[asset.id].network ===
          activeNetwork[
            asset.type === AssetType.Constellation
              ? AssetType.Constellation
              : AssetType.Ethereum
          ]
    )
    .map((asset) => asset.id);

  const priceIds = assetIds.map((assetId) => assetList[assetId].priceId || '');

  let balance = 0;

  for (let i = 0; i < assetIds.length; i += 1) {
    balance += (balances[assetIds[i]] || 0) * (fiat[priceIds[i]]?.price || 0);
  }

  const label = `${currencyName ? currency.symbol : ''}${balance.toFixed(2)}${
    currencyName ? ` ${currency.name}` : ''
  }`;

  balance = (balance / (fiat.bitcoin?.price || 0))

  const balanceStr = balance.toFixed((balance >= 0.01) ? 2 : 4);

  return [label, balanceStr];
}
