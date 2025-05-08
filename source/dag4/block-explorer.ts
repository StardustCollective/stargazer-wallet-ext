import { dag4 } from '@stardust-collective/dag4';
import { toDag } from 'utils/number';

export const getDagBalance = async (address: string): Promise<number> => {
  const balance: number =
    ((await dag4.network.blockExplorerV2Api.getAddressBalance(address)) as any)?.data
      ?.balance ?? 0;

  return toDag(balance);
};

export const getMetagraphBalance = async (
  metagraphId: string,
  address: string
): Promise<number> => {
  const balance: number =
    (
      (await dag4.network.blockExplorerV2Api.getCurrencyAddressBalance(
        metagraphId,
        address
      )) as any
    )?.data?.balance ?? 0;

  return toDag(balance);
};
