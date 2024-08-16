import { DAG_NETWORK, DEFAULT_LANGUAGE } from 'constants/index';
import format from 'date-fns/format';
import { getAllEVMChains } from 'scripts/Background/controllers/EVMChainController/utils';
import { AssetType } from 'state/vault/types';

const MAX_LENGTH = 20;

export const ellipsis = (str: string, start?: number, end?: number) => {
  if (str.substring(0, 3) === 'DAG') {
    start = start || 5;
    end = end || 5;
  } else if (str.substring(0, 2) === '0x') {
    start = start || 6;
    end = end || 4;
  }
  return str.substring(0, start) + '...' + str.substring(str.length - end, str.length);
};

export const truncateString = (str: string, maxLength = MAX_LENGTH) => {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const getDecimalSeparatorByLocale = (locale: string) => {
  const numberWithDecimalSeparator = 1.1;
  return numberWithDecimalSeparator.toLocaleString(locale).substring(1, 2);
};

export const formatDistanceDate = (timestamp: number) => {
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

export const formatNumber = (num: number, min: number, max: number, maxSig?: number) => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  };

  if (maxSig) {
    options.maximumSignificantDigits = maxSig;
  }

  if (isNaN(num)) return '-';

  return (num || 0).toLocaleString(DEFAULT_LANGUAGE, options);
};

export const formatStringDecimal = (numberString: string, decimalPlaces: number) => {
  if (numberString === '-') return '-';

  const decimalSeparator = getDecimalSeparatorByLocale(DEFAULT_LANGUAGE);
  const [whole, fractional] = numberString.split(decimalSeparator);

  return `${whole}${decimalSeparator}${fractional.substring(0, decimalPlaces)}`;
};

export const formatPrice = (num: number, round = 2) => {
  num = Number(num || 0);
  const decimal = num - Math.floor(num);
  if (decimal === 0) {
    return `$${num.toFixed(round)}`;
  }
  let count = Math.floor(Math.abs(Math.log10(decimal)) + round);
  return `$${num.toFixed(count)}`;
};

export const getAddressURL = (
  address: string,
  contractAddress: string,
  type: AssetType,
  networkId: string
) => {
  const EVM_CHAINS = getAllEVMChains();
  if (!networkId) return '';

  if (type === AssetType.Constellation || type === AssetType.LedgerConstellation) {
    if (!DAG_NETWORK[networkId]) return '';
    if (!DAG_NETWORK[networkId]?.explorer) return '';

    return `${DAG_NETWORK[networkId]?.explorer}/address/${address}`;
  }

  if (!EVM_CHAINS[networkId]) return '';

  if (type === AssetType.ERC20) {
    //token/0xdac17f958d2ee523a2206206994597c13d831ec7?a=
    return `${EVM_CHAINS[networkId]?.explorer}token/${contractAddress}?a=${address}`;
  }
  return `${EVM_CHAINS[networkId]?.explorer}address/${address}`;
};
