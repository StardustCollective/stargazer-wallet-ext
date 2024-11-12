import store from 'state/store';
import { updateFiatPrices } from 'state/price';
import { DEFAULT_CURRENCY } from 'constants/index';
import IAssetListState from 'state/assets/types';
import IVaultState from '../../../state/vault/types';
import IProvidersState from 'state/providers/types';
import { ExternalApi } from 'utils/httpRequests/apis';
import { ExternalService } from 'utils/httpRequests/constants';

export interface IControllerUtils {
  appRoute: (newRoute?: string) => string;
  updateFiat: (currency?: string, assetId?: string) => Promise<void>;
}

const ControllerUtils = (): IControllerUtils => {
  let route = '/app.html';

  const appRoute = (newRoute?: string) => {
    if (newRoute) {
      route = newRoute;
    }
    return route;
  };

  const buildAssetIdsParam = (assetIds: string, defaultIds: string[]): string => {
    let updatedIds = assetIds;

    for (const id of defaultIds) {
      if (!updatedIds.includes(id)) {
        updatedIds = updatedIds.concat(`,${id}`);
      }
    }

    return updatedIds;
  };

  const updateFiat = async (currency = DEFAULT_CURRENCY.id) => {
    try {
      const { defaultTokens }: IProvidersState = store.getState().providers;
      const { activeWallet }: IVaultState = store.getState().vault;
      const assets: IAssetListState = store.getState().assets;
      if (activeWallet && assets && !!defaultTokens?.data) {
        let assetIds = activeWallet.assets
          .filter((a) => !!assets[a.id]?.priceId)
          .map((a) => assets[a.id]?.priceId)
          .join(',');

        const defaultIds = Object.values(defaultTokens.data)
          .filter((a) => a.priceId)
          .map((a) => a.priceId);

        assetIds = buildAssetIdsParam(assetIds, defaultIds);
        const GET_PRICE_URL = `${ExternalService.CoinGecko}/simple/price?ids=${assetIds}&vs_currencies=${currency}&include_24hr_change=true`;
        const priceResponse = await ExternalApi.get(GET_PRICE_URL);
        if (!priceResponse.data) return;
        const data = priceResponse.data;
        store.dispatch(
          updateFiatPrices(
            Object.keys(data).map((assetId) => {
              return {
                id: assetId,
                price: data[assetId][currency],
                priceChange: data[assetId][`${currency}_24h_change`],
              };
            })
          )
        );
      }
    } catch (error) {
      console.log('<!> Fetching asset price error: ', error);
    }
  };

  return {
    appRoute,
    updateFiat,
  };
};

export default ControllerUtils;
