import { IOpenSeaDetailedNFT } from 'state/nfts/types';
import { Control, FieldValues, OnSubmit } from 'react-hook-form';
import { IAssetInfoState } from 'state/assets/types';

export type INFTSend = {
  navigation: any;
  route: any;
};

export type NFTSendProps = {
  logo: string;
  address: string;
  quantity: string;
  isERC721: boolean;
  selectedNFT: IOpenSeaDetailedNFT;
  control?: Control<FieldValues>;
  mainAsset: IAssetInfoState;
  errors: any;
  buttonDisabled: boolean;
  isValidAddress: boolean;
  amount?: number;
  handleQRscan: (data: string) => void;
  onButtonPress: () => void;
  register: () => void;
  handleAddressChange: (value: string) => void;
  handleQuantityChange: (value: string) => void;
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  gas: {
    prices: number[];
    price: number;
    fee: number;
    speedLabel: string;
    basePriceId: string;
  };
  onGasPriceChange: (_: any, val: number | number[]) => void;
};
