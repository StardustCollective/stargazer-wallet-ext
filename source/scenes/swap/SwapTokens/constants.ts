import { CONSTELLATION_LOGO, LATTICE_LOGO } from 'constants/index';

export const SWAP_FROM_STRING = 'Swap From';
export const BALANCE_STRING = 'Balance:';
export const SWAP_TO_STRING = 'Swap To';
export const RATE_STRING = 'Rate';
export const MINIMUM_AMOUNT_STRING = 'Min. Amount';
export const NEXT_BUTTON_STRING = 'Next';
export const EXCHANGE_RATE_ONE = 1;
export const DOT_INDICATOR_SIZE = 6;
export const DOT_INDICATOR_COUNT = 3;
export const DOT_INDICATOR_COLOR = '#473194';
export const CURRENCY_INPUT_ZERO_PLACEHOLDER = '0';
export const TO_CURRENCY_INPUT_EDITABLE = false;
export const LTX_DEFAULT_CURRENCY = {
  code: 'LTX',
  name: 'Lattice Token',
  icon: LATTICE_LOGO,
  notes: '',
  networks: [
    {
      network: 'ETH',
      name: 'Ethereum',
      shortName: 'ERC20',
      notes: '',
      addressRegex: '^(0x)[0-9A-Fa-f]{40}$',
      isDefault: true,
      depositMinAmount: null as any,
      memoNeeded: false,
      memoName: '',
      precision: 6,
    },
  ],
};
export const DAG_DEFAULT_CURRENCY = {
  code: 'DAG',
  name: 'Constellation',
  icon: CONSTELLATION_LOGO,
  notes: '',
  networks: [
    {
      network: 'DAG',
      name: 'Constellation',
      shortName: '',
      notes: '',
      addressRegex: '^(DAG)[0-9A-Za-z]{30,70}$',
      isDefault: true,
      depositMinAmount: null as any,
      memoNeeded: false,
      precision: 8,
    },
  ],
};
