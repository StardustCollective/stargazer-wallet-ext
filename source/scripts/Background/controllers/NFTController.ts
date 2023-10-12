import store from 'state/store';
import {
  clearCollections,
  clearSelectedCollection,
  clearSelectedNFT,
  setCollections,
  setCollectionsLoading,
  setSelectedCollection,
  setSelectedNFT,
  setSelectedNFTLoading,
} from 'state/nfts';
import {
  ICollectionData,
  IOpenSeaCollection,
  IOpenSeaCollectionWithChain,
  IOpenSeaDetailedNFT,
  IOpenSeaNFT,
  OpenSeaSupportedChains,
} from 'state/nfts/types';
import { OPENSEA_API_V2 } from 'constants/index';
import { KeyringAssetType, KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { AssetType, Network } from 'state/vault/types';
import { OPENSEA_CHAINS_MAP } from 'utils/opensea';

export interface INFTController {
  setCollectionsLoading: (loading: boolean) => void;
  setCollections: (collections: ICollectionData) => void;
  setSelectedNFTLoading: (loading: boolean) => void;
  setSelectedNFT: (nft: IOpenSeaDetailedNFT) => void;
  setSelectedCollection: (collection: IOpenSeaCollectionWithChain) => void;
  clearSelectedNFT: () => void;
  clearSelectedCollection: () => void;
  clearCollections: () => void;
  fetchAllNfts: () => Promise<void>;
  fetchNFTDetails: (
    chain: OpenSeaSupportedChains,
    address: string,
    id: string
  ) => Promise<void>;
}

class NFTController implements INFTController {
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

  setSelectedCollection(collection: IOpenSeaCollectionWithChain) {
    store.dispatch(setSelectedCollection(collection));
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

  private async fetchNftsByChain(
    walletAddress: string,
    chain: OpenSeaSupportedChains
  ): Promise<IOpenSeaNFT[]> {
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
  }

  private async fetchCollection(collectionId: string): Promise<IOpenSeaCollection> {
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
          const collectionData = await this.fetchCollection(collectionId);
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
          const nftsResponse = await this.fetchNftsByChain(ethAddress, openSeaChain);
          const chainNfts = {
            chain: openSeaChain,
            items: nftsResponse,
          };
          allNfts.push(chainNfts);
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
      const endpointBase = `${OPENSEA_API_V2}/chain/${chain}/contract/${address}/nfts/${id}`;
      const headers = { headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY } };
      const response = await fetch(endpointBase, headers);
      const responseJson = await response.json();
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
