import { dag4 } from '@stardust-collective/dag4';
import { toDag } from 'utils/number';

export const getDagBalance = async (address: string): Promise<number> => {
  try {
    const balance: number =
      ((await dag4.network.blockExplorerV2Api.getAddressBalance(address)) as any)?.data
        ?.balance ?? 0;

    return toDag(balance);
  } catch (err) {
    return null;
  }
};
