export type INFTSendCompleted = {
  navigation: any;
  route: any;
};

export type NFTSendCompletedProps = {
  address: string;
  onViewTransactionPress: () => void;
  onButtonPress: () => void;
};
