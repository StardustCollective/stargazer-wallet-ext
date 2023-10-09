import { addERC20Asset, removeERC20Asset, updateAssetDecimals } from 'state/assets';
import {
  ICollectionData,
  IOpenSeaCollection,
  IOpenSeaNFT,
  OpenSeaSupportedChains,
} from 'state/nfts/types';
import store from 'state/store';
import IVaultState, { ActiveNetwork, AssetType, Network } from 'state/vault/types';
import {
  TOKEN_INFO_API,
  OPENSEA_API_V2,
  ETHEREUM_DEFAULT_LOGO,
  AVALANCHE_DEFAULT_LOGO,
  BSC_DEFAULT_LOGO,
  POLYGON_DEFAULT_LOGO,
  COINGECKO_API_KEY_PARAM,
  CONSTELLATION_DEFAULT_LOGO,
} from 'constants/index';
import { KeyringAssetType, KeyringNetwork } from '@stardust-collective/dag4-keyring';
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
import { OPENSEA_CHAINS_MAP } from 'utils/opensea';
import { setCollections, setCollectionsLoading } from 'state/nfts';

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
    symbol: string
  ) => Promise<void>;
  removeCustomERC20Asset: (asset: IAssetInfoState) => void;
  fetchNftsByChain: (
    address: string,
    chain: OpenSeaSupportedChains
  ) => Promise<IOpenSeaNFT[]>;
  fetchAllNfts: () => Promise<void>;
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

  const fetchNftsByChain = async (
    walletAddress: string,
    chain: OpenSeaSupportedChains
  ): Promise<IOpenSeaNFT[]> => {
    try {
      let accumulatedData: IOpenSeaNFT[] = [];

      const endpointBase = `${OPENSEA_API_V2}/chain/${chain}/account/${walletAddress}/nfts`;

      const recursiveFetch = async (url: string): Promise<void> => {
        const headers = { headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY } };
        const response = await fetch(url, headers);
        const responseJson = await response.json();
        const nfts = !!responseJson?.nfts ? responseJson.nfts : [];
        accumulatedData = accumulatedData.concat(nfts);

        // OpenSea has a limit of 50 nfts per request. https://docs.opensea.io/reference/list_nfts_by_account
        // If "next" is included in the response, it means that there're more records to fetch.
        if (!!responseJson?.next) {
          const urlWithNext = `${endpointBase}?next=${responseJson.next}`;
          await recursiveFetch(urlWithNext);
        }
      };

      await recursiveFetch(endpointBase);

      return accumulatedData;
    } catch (error) {
      console.log('ERROR: fetchNftsByChain', error);
      return [];
    }
  };

  const fetchCollection = async (collectionId: string): Promise<IOpenSeaCollection> => {
    try {
      const endpointBase = `${OPENSEA_API_V2}/collections/${collectionId}`;
      const headers = { headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY } };
      const response = await fetch(endpointBase, headers);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log('ERROR: fetchCollection', error);
      return null;
    }
  };

  const groupNftsByCollection = (
    items: IOpenSeaNFT[]
  ): { [id: string]: IOpenSeaNFT[] } => {
    const groups = items.reduce((result: { [id: string]: IOpenSeaNFT[] }, object) => {
      const { collection } = object;

      if (!result[collection]) {
        result[collection] = [];
      }

      result[collection].push(object);

      return result;
    }, {});

    return groups;
  };

  const buildCollectionsData = async (
    allNfts: { chain: OpenSeaSupportedChains; items: IOpenSeaNFT[] }[]
  ) => {
    let collections: ICollectionData = {};

    for (const nftsData of allNfts) {
      if (nftsData.items.length) {
        // Group NFTs by collection
        const nftsByCollection = groupNftsByCollection(nftsData.items);
        for (const collectionId of Object.keys(nftsByCollection)) {
          // Fetch collection info
          const collectionData = await fetchCollection(collectionId);
          // Add "chain" and "nfts" for each collection
          collections[collectionId] = {
            ...collectionData,
            chain: nftsData.chain,
            nfts: nftsByCollection[collectionId],
          };
        }
      }
    }

    return collections;
  };

  const fetchAllNfts = async (): Promise<void> => {
    const { activeNetwork, activeWallet } = store.getState().vault;
    const { supportedAssets, assets } = activeWallet;

    const supportsEth = supportedAssets?.includes(KeyringAssetType.ETH);
    const ethAddress = assets?.find((asset) => asset?.id === AssetType.Ethereum)?.address;

    if (supportsEth && ethAddress) {
      const ethNetwork = OPENSEA_CHAINS_MAP[activeNetwork[KeyringNetwork.Ethereum]];
      const polygonNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.Polygon]];
      const avalancheNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.Avalanche]];
      const bscNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.BSC]];

      const openSeaChains = [ethNetwork, polygonNetwork, avalancheNetwork, bscNetwork];

      let allNfts: { chain: OpenSeaSupportedChains; items: IOpenSeaNFT[] }[] = [];

      store.dispatch(setCollectionsLoading(true));

      // Fetch NFTs for each active chain
      await Promise.all(
        openSeaChains.map(async (openSeaChain) => {
          const nftsResponse = await fetchNftsByChain(ethAddress, openSeaChain);
          const chainNfts = {
            chain: openSeaChain,
            items: nftsResponse,
          };
          allNfts.push(chainNfts);
        })
      );

      // Build collections object
      const collections = await buildCollectionsData(allNfts);
      store.dispatch(setCollections(collections));
      store.dispatch(setCollectionsLoading(false));
    }
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
    symbol: string
  ): Promise<void> => {
    const accountController = getAccountController();
    const { activeNetwork, activeWallet } = store.getState().vault;
    const assets = store.getState().assets;

    const network = activeNetwork[KeyringNetwork.Constellation];
    const deafultLogo = DEFAULT_LOGOS[KeyringNetwork.Constellation];

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
    const dagAddress = activeWallet?.assets?.find(
      (asset) => asset.id === AssetType.Constellation
    )?.address;
    if (!asset) {
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
    fetchNftsByChain,
    fetchAllNfts,
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
