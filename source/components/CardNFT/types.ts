import { OpenSeaSupportedChains } from 'state/nfts/types';

export default interface ICardNFT {
  title: string;
  subtitle: string;
  chain: OpenSeaSupportedChains;
  logo: string;
  onPress: () => void;
}
