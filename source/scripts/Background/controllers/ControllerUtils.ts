import store from 'state/store';
import { updateFiatPrices } from 'state/price';
import { ASSET_PRICE_API, DEFAULT_CURRENCY } from 'constants/index';
import IAssetListState from 'state/assets/types';

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

  const updateFiat = async (currency = DEFAULT_CURRENCY.id) => {
    try {
      const assets: IAssetListState = store.getState().assets;
      const assetIds = Object.values(assets)
        .map((asset) => asset.priceId)
        .join(',');
      const data = await (
        await fetch(
          `${ASSET_PRICE_API}?ids=${assetIds},bitcoin&vs_currencies=${currency}&include_24hr_change=true`
        )
      ).json();
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
