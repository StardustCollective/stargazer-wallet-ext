import { dag4 } from '@stardust-collective/dag4';

import { toDag } from 'utils/number';

export const getDagBalance = async (address: string): Promise<number> => {
  try {
    const balance: number =
      ((await dag4.network.blockExplorerV2Api.getAddressBalance(address)) as any)?.data?.balance ?? 0;

    return toDag(balance);
  } catch (err) {
    // Fallback to L0 API if block explorer fails
    return getDagBalanceFromL0();
  }
};

export const getDagBalanceFromL0 = async (): Promise<number> => {
  try {
    // Get balance from L0 API
    const balance: number = await dag4.account.getBalance();

    return balance;
  } catch (err) {
    return null;
  }
};
