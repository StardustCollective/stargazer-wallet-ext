import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ALKIMI_LOGO, AVALANCHE_LOGO, BSC_LOGO, CONSTELLATION_LOGO, DOR_LOGO, ETHEREUM_LOGO, GEOJAM_LOGO, JENNYCO_LOGO, LATTICE_LOGO, POLYGON_LOGO, SWAP_LOGO, USDC_DAG_LOGO, VE_LTX_LOGO } from 'constants/index';

import { AssetSymbol, AssetType } from 'state/vault/types';

import IAssetListState, { IAssetInfoState } from './types';

export const initialState: IAssetListState = {
  [AssetType.Ethereum]: {
    id: AssetType.Ethereum,
    label: 'ETH',
    type: AssetType.Ethereum,
    symbol: AssetSymbol.ETH,
    address: '',
    native: true,
    network: 'both',
    logo: ETHEREUM_LOGO,
    priceId: 'ethereum',
    decimals: 18,
  },
  [AssetType.Constellation]: {
    id: AssetType.Constellation,
    label: 'DAG',
    type: AssetType.Constellation,
    symbol: AssetSymbol.DAG,
    address: '',
    native: true,
    network: 'both',
    logo: CONSTELLATION_LOGO,
    priceId: 'constellation-labs',
    decimals: 8,
  },
  'DAG0S16WDgdAvh8VvroR6MWLdjmHYdzAF5S181xh-main2': {
    id: 'DAG0S16WDgdAvh8VvroR6MWLdjmHYdzAF5S181xh-main2',
    address: 'DAG0S16WDgdAvh8VvroR6MWLdjmHYdzAF5S181xh',
    label: 'USDC.dag',
    symbol: 'USDC.dag',
    decimals: 8,
    type: AssetType.Constellation,
    logo: USDC_DAG_LOGO,
    network: 'main2',
    l0endpoint: 'http://usdc-ml0-463769650.us-west-1.elb.amazonaws.com',
    l1endpoint: 'http://usdc-cl1-1109728921.us-west-1.elb.amazonaws.com',
    priceId: 'usd-coin',
  },
  'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W-main2': {
    id: 'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W-main2',
    address: 'DAG7X5idd4aLfp4XC6WQdG1eDfR3LGPVEwtUUB2W',
    label: 'PacaSwap',
    symbol: 'SWAP',
    decimals: 8,
    type: AssetType.Constellation,
    logo: SWAP_LOGO,
    network: 'main2',
    l0endpoint: 'http://pacaswap-mainnet-ml0-286306868.us-west-1.elb.amazonaws.com',
    l1endpoint: 'http://pacaswap-mainnet-cl1-647928315.us-west-1.elb.amazonaws.com',
    dl1endpoint: 'http://pacaswap-mainnet-dl1-1672636488.us-west-1.elb.amazonaws.com',
  },
  'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2': {
    id: 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM-main2',
    address: 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM',
    label: 'DOR',
    symbol: 'DOR',
    decimals: 8,
    type: AssetType.Constellation,
    logo: DOR_LOGO,
    network: 'main2',
    l0endpoint: 'http://l0-lb-mainnet.getdor.com:7000',
    l1endpoint: 'http://cl1-lb-mainnet.getdor.com:8000',
    dl1endpoint: 'http://dl1-lb-mainnet.getdor.com:9000',
    priceId: 'dor',
  },
  // 349: New network should be added here.
  [AssetType.Avalanche]: {
    id: AssetType.Avalanche,
    address: '',
    label: 'AVAX',
    symbol: AssetSymbol.AVAX,
    type: AssetType.Ethereum,
    priceId: 'avalanche-2',
    network: 'avalanche-mainnet',
    logo: AVALANCHE_LOGO,
    decimals: 18,
  },
  [AssetType.BSC]: {
    id: AssetType.BSC,
    address: '',
    label: 'BNB',
    symbol: AssetSymbol.BNB,
    type: AssetType.Ethereum,
    priceId: 'binancecoin',
    network: 'bsc',
    logo: BSC_LOGO,
    decimals: 18,
  },
  [AssetType.Polygon]: {
    id: AssetType.Polygon,
    address: '',
    label: 'POL',
    symbol: AssetSymbol.POL,
    type: AssetType.Ethereum,
    priceId: 'matic-network',
    network: 'matic',
    logo: POLYGON_LOGO,
    decimals: 18,
  },
  [AssetType.Base]: {
    id: AssetType.Base,
    address: '',
    label: 'Base ETH',
    symbol: AssetSymbol.BASE,
    type: AssetType.Ethereum,
    priceId: 'ethereum',
    network: 'base-mainnet',
    logo: ETHEREUM_LOGO,
    decimals: 18,
  },
  [AssetType.Ink]: {
    id: AssetType.Ink,
    address: '',
    label: 'Ink ETH',
    symbol: AssetSymbol.INK,
    type: AssetType.Ethereum,
    priceId: 'ethereum',
    network: 'ink-mainnet',
    logo: ETHEREUM_LOGO,
    decimals: 18,
  },
  '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet': {
    id: '0xa393473d64d2F9F026B60b6Df7859A689715d092-mainnet',
    address: '0xa393473d64d2F9F026B60b6Df7859A689715d092',
    label: 'Lattice Token',
    symbol: 'LTX',
    type: AssetType.ERC20,
    priceId: 'lattice-token',
    network: 'mainnet',
    logo: LATTICE_LOGO,
    decimals: 8,
  },
  '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet': {
    id: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349-mainnet',
    address: '0xc6a22cc9acd40b4f31467a3580d4d69c3387f349',
    label: 'Lattice Governance',
    symbol: 'veLTX',
    type: AssetType.ERC20,
    priceId: 'lattice-governance',
    network: 'mainnet',
    logo: VE_LTX_LOGO,
    decimals: 18,
  },
  '0x3106a0a076BeDAE847652F42ef07FD58589E001f-mainnet': {
    id: '0x3106a0a076BeDAE847652F42ef07FD58589E001f-mainnet',
    address: '0x3106a0a076BeDAE847652F42ef07FD58589E001f',
    label: 'Alkimi Exchange',
    symbol: 'ADS',
    type: AssetType.ERC20,
    priceId: 'alkimi',
    network: 'mainnet',
    logo: ALKIMI_LOGO,
    decimals: 18,
  },
  '0x23894dc9da6c94ecb439911caf7d337746575a72-mainnet': {
    id: '0x23894dc9da6c94ecb439911caf7d337746575a72-mainnet',
    address: '0x23894dc9da6c94ecb439911caf7d337746575a72',
    label: 'Geojam',
    symbol: 'JAM',
    type: AssetType.ERC20,
    priceId: 'geojam',
    network: 'mainnet',
    logo: GEOJAM_LOGO,
    decimals: 18,
  },
  '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic': {
    id: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6-matic',
    address: '0x8105f88e77a5d102099bf73db4469d3f1e3b0cd6',
    label: 'JennyCo',
    symbol: 'JCO',
    type: AssetType.ERC20,
    priceId: 'jennyco',
    network: 'matic',
    logo: JENNYCO_LOGO,
    decimals: 18,
  },
  '0xEcFf4D80f54CF55c626E52F304a8891645961e72-base-mainnet': {
    id: '0xEcFf4D80f54CF55c626E52F304a8891645961e72-base-mainnet',
    address: '0xEcFf4D80f54CF55c626E52F304a8891645961e72',
    label: 'Base DAG',
    symbol: 'BASE_DAG',
    type: AssetType.ERC20,
    priceId: 'constellation-labs',
    network: 'base-mainnet',
    logo: CONSTELLATION_LOGO,
    decimals: 8,
  },
  '0x38a7C0416164faa29d207c9cF2273a5b80210aeD-base-mainnet': {
    id: '0x38a7C0416164faa29d207c9cF2273a5b80210aeD-base-mainnet',
    address: '0x38a7C0416164faa29d207c9cF2273a5b80210aeD',
    label: 'Base DOR',
    symbol: 'BASE_DOR',
    type: AssetType.ERC20,
    priceId: 'dor',
    network: 'base-mainnet',
    logo: DOR_LOGO,
    decimals: 8,
  },
  '0x1467d31ab00F986d0e0e764365d999972289CD03-ink-mainnet': {
    id: '0x1467d31ab00F986d0e0e764365d999972289CD03-ink-mainnet',
    address: '0x1467d31ab00F986d0e0e764365d999972289CD03',
    label: 'Ink DAG',
    symbol: 'INK_DAG',
    type: AssetType.ERC20,
    priceId: 'constellation-labs',
    network: 'ink-mainnet',
    logo: CONSTELLATION_LOGO,
    decimals: 8,
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AssetListState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    rehydrate(_: IAssetListState, action: PayloadAction<IAssetListState>) {
      return action.payload;
    },
    addAsset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        state[action.payload.id] = action.payload;
      }
    },
    removeAsset(state: IAssetListState, action: PayloadAction<IAssetInfoState>) {
      if (action.payload.id) {
        delete state[action.payload.id];
      }
    },
    updateAssetDecimals(state: IAssetListState, action: PayloadAction<{ assetId: string; decimals: number }>) {
      if (action.payload.assetId && action.payload.decimals && !!state[action.payload.assetId]) {
        state[action.payload.assetId].decimals = action.payload.decimals;
      }
    },
  },
});

export const { addAsset, removeAsset, updateAssetDecimals, rehydrate } = AssetListState.actions;

export default AssetListState.reducer;
