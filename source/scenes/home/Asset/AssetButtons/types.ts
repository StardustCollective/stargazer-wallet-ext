export interface IAssetButtonsContainer {
  setShowQrCode?: (isVisible: boolean) => void;
  onSendClick: () => void;
  assetId?: string;
}

export interface IAssetButtons {
  onSwapPressed: () => void
  onBuyPressed: () => void;
  onSendPressed: () => void;
  onReceivePressed: () => void;
  assetBuyable: boolean;
}
