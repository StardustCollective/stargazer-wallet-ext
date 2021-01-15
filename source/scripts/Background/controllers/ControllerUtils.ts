import store from 'state/store';
import { updateFiatPrice } from 'state/price';
import {
  ASSET_PRICE_API,
  DEFAULT_CURRENCY,
  PRICE_DAG_ID,
} from 'constants/index';

export interface IControllerUtils {
  updateFiat: (currency?: string, assetId?: string) => Promise<void>;
}

const ControllerUtils = (): IControllerUtils => {
  const updateFiat = async (
    currency = DEFAULT_CURRENCY.id,
    assetId = PRICE_DAG_ID
  ) => {
    try {
      const data = await (
        await fetch(
          `${ASSET_PRICE_API}?ids=${assetId}&vs_currencies=${currency}`
        )
      ).json();
      if (data) {
        store.dispatch(
          updateFiatPrice({ assetId, price: data[assetId][currency] })
        );
      }
    } catch (error) {
      console.log('<!> Fetching asset price error: ', error);
    }
  };

  return {
    updateFiat,
  };
};

export default ControllerUtils;
