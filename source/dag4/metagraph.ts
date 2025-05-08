import { dag4 } from '@stardust-collective/dag4';
import { IAssetInfoState } from 'state/assets/types';

export const getMetagraphCurrencyBalance = async (
  l0asset: IAssetInfoState
): Promise<number> => {
  try {
    const metagraphClient = dag4.account.createMetagraphTokenClient({
      metagraphId: l0asset.address,
      id: l0asset.address,
      l0Url: l0asset.l0endpoint,
      l1Url: l0asset.l1endpoint,
      // Block explorer not available for local development
      beUrl: '',
    });

    const balance = await metagraphClient.getBalance();

    return balance;
  } catch (err) {
    return null;
  }
};
