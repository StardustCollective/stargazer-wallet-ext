import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import format from 'date-fns/format';
import { AssetType } from 'state/wallet/types';

export const ellipsis = (str: string, start = 7, end = 4) => {
  return (
    str.substring(0, start) +
    '...' +
    str.substring(str.length - end, str.length)
  );
};

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

export const formatDistanceDate = (timestamp: string) => {
  const formatStyle = 'M-d-yyyy';
  const today = new Date();
  const yesterday = getYesterday();
  const formatedDate = format(new Date(timestamp), formatStyle);

  if (formatedDate === format(today, formatStyle)) return 'Today';
  if (formatedDate === format(yesterday, formatStyle)) return 'Yesterday';
  return new Date(timestamp).toLocaleDateString();
};

export const formatNumber = (num: number, min = 4, max = 4, maxSig = 12) => {
  return num.toLocaleString(navigator.language, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    maximumSignificantDigits: maxSig,
  });
};

export const getAddressURL = (
  address: string,
  type: AssetType,
  networkId: string
) => {
  if (type === AssetType.Constellation) {
    return `${DAG_EXPLORER_SEARCH}${address}`;
  }
  return `${ETH_NETWORK[networkId].etherscan}address/${address}`;
};
