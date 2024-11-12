import store from 'state/store';
import {
  clearCollections,
  clearSelectedCollection,
  clearSelectedNFT,
  clearTempoNFTInfo,
  clearTransferNFT,
  setCollection,
  setCollections,
  setCollectionsLoading,
  setSelectedCollection,
  setSelectedCollectionLoading,
  setSelectedNFT,
  setSelectedNFTLoading,
  setTempNFTInfo,
  setTransferNFTData,
  setTransferNFTError,
  setTransferNFTLoading,
} from 'state/nfts';
import {
  ICollectionData,
  IOpenSeaCollection,
  IOpenSeaCollectionWithChain,
  IOpenSeaDetailedNFT,
  IOpenSeaNFT,
  ITempNFTInfo,
  OpenSeaSupportedChains,
} from 'state/nfts/types';
import { KeyringAssetType, KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { AssetType, Network } from 'state/vault/types';
import { OPENSEA_CHAINS_MAP, OPENSEA_NETWORK_MAP, isOpenSeaTestnet } from 'utils/opensea';
import { AccountController } from './AccountController';
import { getNetworkNativeToken } from './EVMChainController/utils';
import { ExternalService } from 'utils/httpRequests/constants';
import { ExternalApi } from 'utils/httpRequests/apis';

export interface INFTController {
  setCollectionsLoading: (loading: boolean) => void;
  setCollections: (collections: ICollectionData) => void;
  setSelectedNFTLoading: (loading: boolean) => void;
  setSelectedNFT: (nft: IOpenSeaDetailedNFT) => void;
  setSelectedCollection: (collection: IOpenSeaCollectionWithChain) => void;
  setTempNFTInfo: (tempInfo: ITempNFTInfo) => void;
  setTransferNFTError: (error: any) => void;
  setTransferNFTLoading: (loading: boolean) => void;
  clearSelectedNFT: () => void;
  clearSelectedCollection: () => void;
  clearCollections: () => void;
  clearTempNFTInfo: () => void;
  clearTransferNFT: () => void;
  transferNFT: (nft: ITempNFTInfo, network: string) => Promise<void>;
  fetchAllNfts: () => Promise<void>;
  refreshCollection: (collectionId: string) => Promise<void>;
  fetchNFTDetails: (
    chain: OpenSeaSupportedChains,
    address: string,
    id: string
  ) => Promise<void>;
}

const INSUFICIENT_FUNDS = 'insufficient funds';
const DEFAULT_ERROR_MESSAGE =
  'There was an error with your token transfer. Please try again later.';
const NFT_FETCH_LIMIT = 200;

class NFTController implements INFTController {
  constructor(private accountController: Readonly<AccountController>) {}

  setCollectionsLoading(loading: boolean) {
    store.dispatch(setCollectionsLoading(loading));
  }

  setCollections(collections: ICollectionData) {
    store.dispatch(setCollections(collections));
  }

  setSelectedNFTLoading(loading: boolean) {
    store.dispatch(setSelectedNFTLoading(loading));
  }

  setSelectedNFT(nft: IOpenSeaDetailedNFT) {
    store.dispatch(setSelectedNFT(nft));
  }

  private async fetchBalances(
    collection: IOpenSeaCollectionWithChain,
    contractAddress: string
  ) {
    // Fetch balances for each NFT if collection is ERC1155
    let collectionUpdated = { ...collection };
    const { assets } = store.getState().vault.activeWallet;
    const ethAddress = assets?.find((asset) => asset?.id === AssetType.Ethereum)?.address;
    const nftsWithQuantity = [];
    const chain = collection.chain;
    const network = OPENSEA_NETWORK_MAP[chain].network;

    if (!!ethAddress) {
      const allIds = collection.nfts.map((nft) => nft.identifier);
      const balances = await this.accountController.networkController.getERC1155Balance(
        contractAddress,
        ethAddress,
        allIds,
        network
      );

      if (allIds.length === balances.length) {
        for (let i = 0; i < allIds.length; i++) {
          const balance = balances[i];
          const nftWithBalance = {
            ...collection.nfts[i],
            quantity: balance,
          };
          nftsWithQuantity.push(nftWithBalance);
        }
        collectionUpdated.nfts = nftsWithQuantity;
      }
    }
    return collectionUpdated;
  }

  async setSelectedCollection(collection: IOpenSeaCollectionWithChain) {
    store.dispatch(setSelectedCollectionLoading(true));
    let newCollection = { ...collection };
    const firstNFT = collection.nfts[0];

    // Fetch balances for each NFT if collection is ERC1155
    if (
      !!firstNFT &&
      firstNFT.token_standard === AssetType.ERC1155 &&
      !firstNFT?.quantity
    ) {
      newCollection = await this.fetchBalances(collection, firstNFT.contract);
    }

    store.dispatch(setSelectedCollection(newCollection));
    store.dispatch(setSelectedCollectionLoading(false));
  }

  setTempNFTInfo(tempNFTInfo: ITempNFTInfo) {
    store.dispatch(setTempNFTInfo(tempNFTInfo));
  }

  setTransferNFTError(error: any) {
    store.dispatch(setTransferNFTError(error));
  }

  setTransferNFTLoading(loading: boolean) {
    store.dispatch(setTransferNFTLoading(loading));
  }

  clearSelectedNFT() {
    store.dispatch(clearSelectedNFT());
  }

  clearSelectedCollection() {
    store.dispatch(clearSelectedCollection());
  }

  clearCollections() {
    store.dispatch(clearCollections());
  }

  clearTempNFTInfo() {
    store.dispatch(clearTempoNFTInfo());
  }

  clearTransferNFT() {
    store.dispatch(clearTransferNFT());
  }

  async transferNFT(nft: ITempNFTInfo, network: string) {
    this.setTransferNFTLoading(true);
    try {
      const txHash = await this.accountController.networkController.transferNFT(
        nft,
        network
      );
      if (!!txHash) {
        store.dispatch(setTransferNFTData(txHash));
      } else {
        this.setTransferNFTError(DEFAULT_ERROR_MESSAGE);
      }
    } catch (err: any) {
      let message: string = err?.message || DEFAULT_ERROR_MESSAGE;
      if (err?.message?.includes(INSUFICIENT_FUNDS)) {
        const nativeToken = getNetworkNativeToken(network);
        message = `Balance is too low to cover gas fees. Add ${nativeToken} to your wallet to complete this transaction.`;
      }
      this.setTransferNFTError(message);
      this.setTransferNFTLoading(false);
    }

    this.setTransferNFTLoading(false);
  }

  async refreshCollection(collectionId: string): Promise<void> {
    const { collections } = store.getState().nfts;
    const { activeWallet } = store.getState().vault;
    const { assets } = activeWallet;

    const ethAddress = assets?.find((asset) => asset?.id === AssetType.Ethereum)?.address;
    const collectionData = collections.data[collectionId];
    if (!!ethAddress && !!collectionId) {
      store.dispatch(setSelectedCollectionLoading(true));
      const nftsResponse = await this.fetchNftsByChain(
        ethAddress,
        collectionData.chain,
        collectionId
      );
      const updatedCollection: IOpenSeaCollectionWithChain = {
        ...collectionData,
        nfts: nftsResponse,
      };
      store.dispatch(setCollection({ id: collectionId, data: updatedCollection }));
      await this.setSelectedCollection(updatedCollection);
    }
  }

  private async fetchNftsByChain(
    walletAddress: string,
    chain: OpenSeaSupportedChains,
    collectionId?: string
  ): Promise<IOpenSeaNFT[]> {
    try {
      let accumulatedData: IOpenSeaNFT[] = [];
      const isTestnet = isOpenSeaTestnet(chain);

      const SERVICE = isTestnet
        ? ExternalService.OpenseaTestnet
        : ExternalService.OpenseaMainnet;
      let endpointBase = `${SERVICE}/chain/${chain}/account/${walletAddress}/nfts?limit=${NFT_FETCH_LIMIT}`;
      if (collectionId) {
        endpointBase += `&collection=${collectionId}`;
      }

      const recursiveFetch = async (url: string): Promise<void> => {
        const responseData = await ExternalApi.get(url);
        const responseJson = responseData?.data ?? {};
        const nfts = !!responseJson?.nfts ? responseJson.nfts : [];
        accumulatedData = accumulatedData.concat(nfts);

        // OpenSea has a limit of 200 nfts per request. https://docs.opensea.io/reference/list_nfts_by_account
        // If "next" is included in the response, it means that there're more records to fetch.
        if (!!responseJson?.next) {
          const urlWithNext = `${endpointBase}&next=${responseJson.next}`;
          await recursiveFetch(urlWithNext);
        }
      };

      await recursiveFetch(endpointBase);

      return accumulatedData;
    } catch (error) {
      console.log('ERROR: fetchNftsByChain', error);
      return [];
    }
  }

  private async fetchCollection(
    collectionId: string,
    chain: OpenSeaSupportedChains
  ): Promise<IOpenSeaCollection> {
    try {
      const isTestnet = isOpenSeaTestnet(chain);
      const SERVICE = isTestnet
        ? ExternalService.OpenseaTestnet
        : ExternalService.OpenseaMainnet;
      const endpointBase = `${SERVICE}/collections/${collectionId}`;
      const response = await ExternalApi.get(endpointBase);
      return response?.data ?? {};
    } catch (error) {
      console.log('ERROR: fetchCollection', error);
      return null;
    }
  }

  private groupNftsByCollection(items: IOpenSeaNFT[]): { [id: string]: IOpenSeaNFT[] } {
    const groups = items.reduce((result: { [id: string]: IOpenSeaNFT[] }, object) => {
      const { collection } = object;

      if (!result[collection]) {
        result[collection] = [];
      }

      result[collection].push(object);

      return result;
    }, {});

    return groups;
  }

  private async buildCollectionsData(
    allNfts: { chain: OpenSeaSupportedChains; items: IOpenSeaNFT[] }[]
  ) {
    let collections: ICollectionData = {};

    for (const nftsData of allNfts) {
      if (nftsData.items.length) {
        // Group NFTs by collection
        const nftsByCollection = this.groupNftsByCollection(nftsData.items);
        for (const collectionId of Object.keys(nftsByCollection)) {
          // Fetch collection info
          const collectionData = await this.fetchCollection(collectionId, nftsData.chain);
          // Add "chain" and "nfts" for each collection
          collections[collectionId] = {
            ...collectionData,
            chain: nftsData.chain,
            nfts: nftsByCollection[collectionId],
          };
        }
      }
    }

    // Sorts collections by name
    const sortedCollections = Object.values(collections)
      .sort((colA, colB) => {
        return colA.name > colB.name ? 1 : -1;
      })
      .reduce((accumulator: { [id: string]: IOpenSeaCollectionWithChain }, object) => {
        accumulator[object.collection] = collections[object.collection];

        return accumulator;
      }, {});

    return sortedCollections;
  }

  async fetchAllNfts(): Promise<void> {
    const { activeNetwork, activeWallet } = store.getState().vault;

    if (!activeWallet || !activeNetwork) return;

    const { supportedAssets, assets } = activeWallet;

    const supportsEth = supportedAssets?.includes(KeyringAssetType.ETH);
    const ethAddress = assets?.find((asset) => asset?.id === AssetType.Ethereum)?.address;

    if (supportsEth && ethAddress) {
      // Map Stargazer chains to OpenSea chains
      const ethNetwork = OPENSEA_CHAINS_MAP[activeNetwork[KeyringNetwork.Ethereum]];
      const polygonNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.Polygon]];
      const avalancheNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.Avalanche]];
      const bscNetwork = OPENSEA_CHAINS_MAP[activeNetwork[Network.BSC]];

      const openSeaChains = [ethNetwork, polygonNetwork, avalancheNetwork, bscNetwork];

      let allNfts: { chain: OpenSeaSupportedChains; items: IOpenSeaNFT[] }[] = [];

      this.setCollectionsLoading(true);

      // Fetch NFTs for each active chain
      await Promise.all(
        openSeaChains.map(async (openSeaChain) => {
          if (openSeaChain) {
            const nftsResponse = await this.fetchNftsByChain(ethAddress, openSeaChain);
            const chainNfts = {
              chain: openSeaChain,
              items: nftsResponse,
            };
            allNfts.push(chainNfts);
          }
        })
      );

      // Build collections object
      const collections = await this.buildCollectionsData(allNfts);

      // Store collections in state
      this.setCollections(collections);
      this.setCollectionsLoading(false);
    }
  }

  async fetchNFTDetails(
    chain: OpenSeaSupportedChains,
    address: string,
    id: string
  ): Promise<void> {
    this.setSelectedNFTLoading(true);

    try {
      const isTestnet = isOpenSeaTestnet(chain);
      const SERVICE = isTestnet
        ? ExternalService.OpenseaTestnet
        : ExternalService.OpenseaMainnet;

      const endpointBase = `${SERVICE}/chain/${chain}/contract/${address}/nfts/${id}`;

      const response = await ExternalApi.get(endpointBase);
      const responseJson = response?.data ?? {};

      const nftData = !!responseJson?.nft ? responseJson.nft : null;

      if (!!nftData) {
        // Store NFT data
        this.setSelectedNFT(nftData);
      }
    } catch (err) {
      console.log('ERROR fetchNFTDetails:', err);
      this.clearSelectedNFT();
    }

    this.setSelectedNFTLoading(false);
  }
}

export default NFTController;
