import { addERC20Asset, removeERC20Asset, updateAssetDecimals } from 'state/assets';
import store from 'state/store';
import IVaultState, { ActiveNetwork, AssetType } from 'state/vault/types';
import {
  TOKEN_INFO_API,
  ETHEREUM_DEFAULT_LOGO,
  AVALANCHE_DEFAULT_LOGO,
  BSC_DEFAULT_LOGO,
  POLYGON_DEFAULT_LOGO,
  COINGECKO_API_KEY_PARAM,
  CONSTELLATION_DEFAULT_LOGO,
} from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import {
  clearErrors as clearErrorsDispatch,
  clearPaymentRequest as clearPaymentRequestDispatch,
  setRequestId as setRequestIdDispatch,
} from 'state/providers';
import { getQuote, getSupportedAssets, paymentRequest } from 'state/providers/api';
import { GetQuoteRequest, PaymentRequestBody } from 'state/providers/types';
import {
  getNetworkFromChainId,
  getPlatformFromMainnet,
  validateAddress,
} from './EVMChainController/utils';
import { getERC20Assets, search } from 'state/erc20assets/api';
import { addAsset, removeAsset, addCustomAsset } from 'state/vault';
import { IAssetInfoState } from 'state/assets/types';
import { clearCustomAsset, clearSearchAssets as clearSearch } from 'state/erc20assets';
import { getAccountController } from 'utils/controllersUtils';

// Default logos
const DEFAULT_LOGOS = {
  Constellation: CONSTELLATION_DEFAULT_LOGO,
  Ethereum: ETHEREUM_DEFAULT_LOGO,
  Avalanche: AVALANCHE_DEFAULT_LOGO,
  BSC: BSC_DEFAULT_LOGO,
  Polygon: POLYGON_DEFAULT_LOGO,
};

const DEFAULT_DAG_DECIMALS = 8;

export interface IAssetsController {
  clearCustomToken: () => void;
  addCustomERC20Asset: (
    networkType: string,
    address: string,
    name: string,
    symbol: string,
    decimals: string
  ) => Promise<void>;
  addCustomL0Token: (
    l0endpoint: string,
    l1endpoint: string,
    address: string,
    name: string,
    symbol: string,
    chainId?: string,
    logo?: string
  ) => Promise<void>;
  removeCustomERC20Asset: (asset: IAssetInfoState) => void;
  fetchSupportedAssets: () => Promise<void>;
  fetchERC20Assets: () => Promise<void>;
  searchERC20Assets: (value: string) => Promise<void>;
  addERC20AssetFn: (asset: IAssetInfoState) => Promise<void>;
  removeERC20AssetFn: (asset: IAssetInfoState) => void;
  clearSearchAssets: () => void;
  fetchQuote: (data: GetQuoteRequest) => Promise<void>;
  fetchPaymentRequest: (data: PaymentRequestBody) => Promise<void>;
  setRequestId: (value: string) => void;
  clearErrors: () => void;
  clearPaymentRequest: () => void;
}

const AssetsController = (): IAssetsController => {
  let { activeNetwork }: IVaultState = store.getState().vault;

  if (!activeNetwork) return undefined;

  const clearCustomToken = (): void => {
    store.dispatch(clearCustomAsset());
  };

  const fetchERC20Assets = async (): Promise<void> => {
    await store.dispatch<any>(getERC20Assets());
  };

  const searchERC20Assets = async (value: string): Promise<void> => {
    await store.dispatch<any>(search(value));
  };

  const clearSearchAssets = (): void => {
    store.dispatch(clearSearch());
  };

  const addCustomL0Token = async (
    l0endpoint: string,
    l1endpoint: string,
    address: string,
    name: string,
    symbol: string,
    chainId?: string,
    logo?: string
  ): Promise<void> => {
    const accountController = getAccountController();
    const { activeNetwork, activeWallet, customAssets } = store.getState().vault;
    const assets = store.getState().assets;

    const network = !!chainId ? chainId : activeNetwork[KeyringNetwork.Constellation];
    const deafultLogo = !!logo ? logo : DEFAULT_LOGOS[KeyringNetwork.Constellation];

    const newL0Asset: IAssetInfoState = {
      id: `${address}-${network}`,
      address,
      label: name,
      symbol,
      decimals: DEFAULT_DAG_DECIMALS,
      type: AssetType.Constellation,
      logo: deafultLogo,
      network,
      l0endpoint,
      l1endpoint,
      custom: true,
    };

    const asset = Object.keys(assets).find((assetId) => assetId === newL0Asset.id);
    const assetCustom = customAssets.find((asset) => asset.id === newL0Asset.id);
    const dagAddress = activeWallet?.assets?.find(
      (asset) => asset.id === AssetType.Constellation
    )?.address;
    if (!asset && !assetCustom) {
      store.dispatch(addCustomAsset(newL0Asset));
      store.dispatch(addERC20Asset(newL0Asset));
      store.dispatch(
        addAsset({
          id: newL0Asset.id,
          type: newL0Asset.type,
          label: newL0Asset.label,
          address: dagAddress,
          contractAddress: newL0Asset.address,
        })
      );
      await accountController.assetsBalanceMonitor.start();
    } else {
      throw new Error(`Asset with address ${address} already exists`);
    }
  };

  const addCustomERC20Asset = async (
    networkType: string,
    address: string,
    name: string,
    symbol: string,
    decimals: string
  ): Promise<void> => {
    if (!validateAddress(address)) return;

    const { activeNetwork } = store.getState().vault;
    const assets = store.getState().assets;
    const currentNetwork = getNetworkFromChainId(networkType);
    const network = activeNetwork[currentNetwork as keyof ActiveNetwork];
    let logo = DEFAULT_LOGOS[currentNetwork as keyof typeof DEFAULT_LOGOS];
    let tokenData;
    const platform = getPlatformFromMainnet(networkType);

    try {
      tokenData = await (
        await fetch(
          `${TOKEN_INFO_API}/${platform}/contract/${address}?${COINGECKO_API_KEY_PARAM}`
        )
      ).json();
    } catch (err) {
      console.log('Token Error:', err);
    }

    if (!tokenData?.error && !!tokenData?.image?.small) {
      logo = tokenData.image.small;
    }

    const newAsset: IAssetInfoState = {
      id: `${address}-${network}`,
      address,
      label: name,
      symbol,
      decimals: parseInt(decimals),
      type: AssetType.ERC20,
      priceId: tokenData?.id || '',
      logo,
      network,
      custom: true,
    };

    const asset = Object.keys(assets).find((assetId) => assetId === newAsset.id);
    if (!asset) {
      store.dispatch(addCustomAsset(newAsset));
      addERC20AssetFn(newAsset);
    }
  };

  const removeCustomERC20Asset = (asset: IAssetInfoState): void => {
    removeERC20AssetFn(asset);
  };

  const addERC20AssetFn = async (asset: IAssetInfoState): Promise<void> => {
    const accountController = getAccountController();
    const { activeWallet } = store.getState().vault;
    const ethAddress = activeWallet?.assets?.find(
      (asset) => asset.type === AssetType.Ethereum
    )?.address;
    store.dispatch(addERC20Asset(asset));
    store.dispatch(
      addAsset({
        id: asset.id,
        type: asset.type,
        label: asset.label,
        address: ethAddress,
        contractAddress: asset.address,
      })
    );
    const assetInfo = await accountController.networkController.getTokenInfo(
      asset.address,
      asset.network
    );
    if (assetInfo && assetInfo.decimals !== asset.decimals) {
      store.dispatch(
        updateAssetDecimals({ assetId: asset.id, decimals: assetInfo.decimals })
      );
    }
    await accountController.assetsBalanceMonitor.start();
  };

  const removeERC20AssetFn = (asset: IAssetInfoState): void => {
    store.dispatch(removeAsset(asset));
    store.dispatch(removeERC20Asset(asset));
  };

  const fetchSupportedAssets = async (): Promise<void> => {
    await store.dispatch<any>(getSupportedAssets());
  };

  const fetchQuote = async (data: GetQuoteRequest): Promise<void> => {
    await store.dispatch<any>(getQuote(data));
  };

  const fetchPaymentRequest = async (data: PaymentRequestBody): Promise<void> => {
    await store.dispatch<any>(paymentRequest(data));
  };

  const setRequestId = (value: string): void => {
    store.dispatch(setRequestIdDispatch(value));
  };

  const clearErrors = (): void => {
    store.dispatch(clearErrorsDispatch());
  };

  const clearPaymentRequest = (): void => {
    store.dispatch(clearPaymentRequestDispatch());
  };

  return {
    clearCustomToken,
    addCustomERC20Asset,
    addCustomL0Token,
    removeCustomERC20Asset,
    fetchSupportedAssets,
    searchERC20Assets,
    clearSearchAssets,
    fetchERC20Assets,
    addERC20AssetFn,
    removeERC20AssetFn,
    fetchQuote,
    fetchPaymentRequest,
    setRequestId,
    clearErrors,
    clearPaymentRequest,
  };
};

export default AssetsController;
