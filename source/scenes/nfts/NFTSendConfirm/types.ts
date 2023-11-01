export type INFTSendConfirm = {
  navigation: any;
  route: any;
};

export type NFTSendConfirmProps = {
  network: string;
  quantity: number;
  sendFrom: string;
  sendTo: string;
  transactionFee: string;
  maxTotal: string;
  nftLogo: string;
  nftName: string;
  loading: boolean;
  isERC721: boolean;
  onButtonPress: () => void;
};
