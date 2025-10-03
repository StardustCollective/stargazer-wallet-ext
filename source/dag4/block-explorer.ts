import { dag4 } from '@stardust-collective/dag4';

import { toDag } from 'utils/number';

export const getDagBalance = async (address: string): Promise<number> => {
  try {
    const balanceResponse = await dag4.network.blockExplorerV2Api.getAddressBalance(address);
    const balance = balanceResponse?.data?.balance ?? 0;

    return toDag(balance);
  } catch (err) {
    return null;
  }
};

export const getCurrencyAddressBalance = async (metagraphId: string, address: string): Promise<number> => {
  const balanceResponse = await dag4.network.blockExplorerV2Api.getCurrencyAddressBalance(metagraphId, address);

  if (!balanceResponse?.data) {
    throw new Error('Invalid response: missing data property');
  }

  if (!('balance' in balanceResponse.data)) {
    throw new Error('Invalid response: missing balance property in data');
  }

  const balance = balanceResponse.data.balance ?? 0;
  return toDag(balance);
};
