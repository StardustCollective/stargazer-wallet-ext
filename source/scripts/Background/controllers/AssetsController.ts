import { addAsset, removeAsset, updateAssetDecimals } from 'state/assets';
import store from 'state/store';
import IVaultState, { ActiveNetwork, AssetType } from 'state/vault/types';
import {
  ETHEREUM_DEFAULT_LOGO,
  AVALANCHE_DEFAULT_LOGO,
  BSC_DEFAULT_LOGO,
  POLYGON_DEFAULT_LOGO,
  CONSTELLATION_DEFAULT_LOGO,
  BASE_DEFAULT_LOGO,
} from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import {
  clearBestDeal as clearBestDealDispatch,
  clearResponse as clearResponseDispatch,
  clearErrors as clearErrorsDispatch,
  clearPaymentRequest as clearPaymentRequestDispatch,
  setRequestId as setRequestIdDispatch,
  setSelectedProvider as setSelectedProviderDispatch,
} from 'state/providers';
import {
  getBestDeal,
  getDefaultTokens,
  getQuote,
  getSupportedAssets,
  paymentRequest,
} from 'state/providers/api';
import {
  GetBestDealRequest,
  GetQuoteRequest,
  IProviderInfoState,
  PaymentRequestBody,
} from 'state/providers/types';
import {
  getNetworkFromChainId,
  getPlatformFromMainnet,
  validateAddress,
} from './EVMChainController/utils';
import { getERC20Assets, search } from 'state/erc20assets/api';
import {
  addActiveWalletAsset,
  removeActiveWalletAsset,
  addCustomAsset,
} from 'state/vault';
import { IAssetInfoState } from 'state/assets/types';
import { clearCustomAsset, clearSearchAssets as clearSearch } from 'state/erc20assets';
import { getAccountController } from 'utils/controllersUtils';
import { getDagAddress, getEthAddress } from 'utils/wallet';
import {
  clearClaimAddress as clearClaimAddressFn,
  clearClaim as clearClaimFn,
  clearClaimHash as clearClaimHashFn,
  setElpacaHidden as setElpacaHiddenFn,
} from 'state/user';
import { ExternalApi } from 'utils/httpRequests/apis';
import { ExternalService } from 'utils/httpRequests/constants';

// Default logos
const DEFAULT_LOGOS = {
  Constellation: CONSTELLATION_DEFAULT_LOGO,
  Ethereum: ETHEREUM_DEFAULT_LOGO,
  Avalanche: AVALANCHE_DEFAULT_LOGO,
  BSC: BSC_DEFAULT_LOGO,
  Polygon: POLYGON_DEFAULT_LOGO,
  Base: BASE_DEFAULT_LOGO,
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
  addCustomL0Token: (params: {
    l0endpoint: string;
    l1endpoint?: string;
    dl1endpoint?: string;
    address: string;
    name: string;
    symbol: string;
    chainId?: string;
    logo?: string;
  }) => Promise<void>;
  removeCustomERC20Asset: (asset: IAssetInfoState) => void;
  fetchSupportedAssets: () => Promise<void>;
  fetchERC20Assets: () => Promise<void>;
  searchERC20Assets: (value: string) => Promise<void>;
  addAssetFn: (asset: IAssetInfoState) => Promise<void>;
  removeERC20AssetFn: (asset: IAssetInfoState) => void;
  clearSearchAssets: () => void;
  fetchQuote: (data: GetQuoteRequest) => Promise<void>;
  fetchBestDeal: (data: GetBestDealRequest) => Promise<void>;
  fetchPaymentRequest: (data: PaymentRequestBody) => Promise<void>;
  setRequestId: (value: string) => void;
  setElpacaHidden: (value: boolean) => void;
  clearErrors: () => void;
  clearBestDeal: () => void;
  clearResponse: () => void;
  clearClaim: () => void;
  clearClaimHash: () => void;
  clearClaimAddress: () => void;
  setSelectedProvider: (provider: IProviderInfoState) => void;
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

  const addCustomL0Token = async ({
    l0endpoint,
    l1endpoint,
    dl1endpoint,
    address,
    name,
    symbol,
    chainId,
    logo,
  }: {
    l0endpoint: string;
    l1endpoint?: string;
    dl1endpoint?: string;
    address: string;
    name: string;
    symbol: string;
    chainId?: string;
    logo?: string;
  }): Promise<void> => {
    const accountController = getAccountController();
    const { activeNetwork, activeWallet } = store.getState().vault;

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
      l1endpoint: l1endpoint ?? null,
      dl1endpoint: dl1endpoint ?? null,
      custom: true,
    };

    const dagAddress = activeWallet?.assets?.find(
      (asset) => asset.id === AssetType.Constellation
    )?.address;
    store.dispatch(addCustomAsset(newL0Asset));
    store.dispatch(addAsset(newL0Asset));
    store.dispatch(
      addActiveWalletAsset({
        id: newL0Asset.id,
        type: newL0Asset.type,
        label: newL0Asset.label,
        address: dagAddress,
        contractAddress: newL0Asset.address,
      })
    );

    accountController.assetsBalanceMonitor.start();
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
    const currentNetwork = getNetworkFromChainId(networkType);
    const network = activeNetwork[currentNetwork as keyof ActiveNetwork];
    let logo = DEFAULT_LOGOS[currentNetwork as keyof typeof DEFAULT_LOGOS];
    let tokenData;
    const platform = getPlatformFromMainnet(networkType);

    try {
      const tokenDataResponse = await ExternalApi.get(
        `${ExternalService.CoinGecko}/coins/${platform}/contract/${address}`
      );
      tokenData = tokenDataResponse?.data || {};
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

    store.dispatch(addCustomAsset(newAsset));
    addAssetFn(newAsset);
  };

  const removeCustomERC20Asset = (asset: IAssetInfoState): void => {
    removeERC20AssetFn(asset);
  };

  const addAssetFn = async (asset: IAssetInfoState): Promise<void> => {
    const accountController = getAccountController();

    const { activeWallet } = store.getState().vault;
    const isDagAsset = AssetType.Constellation === asset.type;
    const address = isDagAsset
      ? getDagAddress(activeWallet)
      : getEthAddress(activeWallet);

    store.dispatch(addAsset(asset));
    store.dispatch(
      addActiveWalletAsset({
        id: asset.id,
        type: asset.type,
        label: asset.label,
        address,
        contractAddress: asset.address,
      })
    );
    if (!isDagAsset) {
      const assetInfo = await accountController.networkController.getTokenInfo(
        asset.address,
        asset.network
      );
      if (assetInfo && assetInfo.decimals !== asset.decimals) {
        store.dispatch(
          updateAssetDecimals({ assetId: asset.id, decimals: assetInfo.decimals })
        );
      }
    }
    await accountController.assetsBalanceMonitor.start();
  };

  const removeERC20AssetFn = (asset: IAssetInfoState): void => {
    store.dispatch(removeActiveWalletAsset(asset));
    store.dispatch(removeAsset(asset));
  };

  const fetchSupportedAssets = async (): Promise<void> => {
    await store.dispatch<any>(getDefaultTokens());
    await store.dispatch<any>(getSupportedAssets());
  };

  const fetchQuote = async (data: GetQuoteRequest): Promise<void> => {
    await store.dispatch<any>(getQuote(data));
  };

  const fetchBestDeal = async (data: GetBestDealRequest): Promise<void> => {
    await store.dispatch<any>(getBestDeal(data));
  };

  const setElpacaHidden = (value: boolean) => {
    store.dispatch<any>(setElpacaHiddenFn(value));
  };

  const clearClaim = () => {
    store.dispatch<any>(clearClaimFn());
  };

  const clearClaimHash = () => {
    store.dispatch<any>(clearClaimHashFn());
  };

  const clearClaimAddress = () => {
    store.dispatch<any>(clearClaimAddressFn());
  };

  const clearBestDeal = (): void => {
    store.dispatch<any>(clearBestDealDispatch());
  };

  const clearResponse = (): void => {
    store.dispatch<any>(clearResponseDispatch());
  };

  const fetchPaymentRequest = async (data: PaymentRequestBody): Promise<void> => {
    await store.dispatch<any>(paymentRequest(data));
  };

  const setSelectedProvider = (provider: IProviderInfoState): void => {
    store.dispatch(setSelectedProviderDispatch(provider));
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
    addAssetFn,
    removeERC20AssetFn,
    fetchQuote,
    fetchBestDeal,
    fetchPaymentRequest,
    setRequestId,
    setSelectedProvider,
    setElpacaHidden,
    clearErrors,
    clearPaymentRequest,
    clearBestDeal,
    clearResponse,
    clearClaim,
    clearClaimHash,
    clearClaimAddress,
  };
};

export default AssetsController;
