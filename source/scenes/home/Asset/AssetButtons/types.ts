export interface IAssetButtonsContainer {
  setShowQrCode?: (isVisible: boolean) => void;
  onSendClick: () => void;
  assetId?: string;
}

export interface IAssetButtons {
  onBuyPressed: () => void;
  onSendPressed: () => void;
  onReceivePressed: () => void;
  assetBuyable: boolean;
}
