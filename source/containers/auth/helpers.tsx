import { DAG_EXPLORER_SEARCH, ETH_NETWORK } from 'constants/index';
import format from 'date-fns/format';
import { AssetType } from 'state/vault/types';

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

export const formatDistanceDate = (timestamp: string | number) => {
  const formatStyle = 'M-d-yyyy';
  const today = new Date();
  const yesterday = getYesterday();

  try {
    const formatedDate = format(new Date(timestamp), formatStyle);
    if (formatedDate === format(today, formatStyle)) return 'Today';
    if (formatedDate === format(yesterday, formatStyle)) return 'Yesterday';
    return new Date(timestamp).toLocaleDateString();
  } catch (error) {
    return null;
  }
};

export const formatNumber = (num: number, min = 4, max = 4, maxSig = 12) => {
  return num.toLocaleString(navigator.language, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
    maximumSignificantDigits: maxSig,
  });
};

export const formatPrice = (num: number, round = 2) => {
  const decimal = num - Math.floor(num);
  return `$${Number(
    num.toFixed(Math.floor(Math.abs(Math.log10(decimal))) + round)
  )}`;
};

export const getAddressURL = (
  address: string,
  contractAddress: string,
  type: AssetType,
  networkId: string
) => {
  console.log(address, type, networkId);
  if (type === AssetType.Constellation) {
    return `${DAG_EXPLORER_SEARCH}${address}`;
  }
  if(type === AssetType.ERC20) {
    //token/0xdac17f958d2ee523a2206206994597c13d831ec7?a=
    return `${ETH_NETWORK[networkId].etherscan}token/${contractAddress}?a=${address}`
  }
  return `${ETH_NETWORK[networkId].etherscan}address/${address}`;
};
