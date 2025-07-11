export const CYPHEROCK_USB_IDS = {
  vendorId: 0x3503,
  productId: 0x0103,
};

export const CYPHEROCK_CHAIN_IDS = {
  ETH_MAINNET: 1,
  // Add other chain IDs if necessary for other apps in the future
};

export const CYPHEROCK_DERIVATION_PATHS = {
  ETH_MAINNET: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  DAG_MAINNET: [0x80000000 + 44, 0x80000000 + 1137, 0x80000000, 0, 0],
  // Add other derivation paths if necessary
};
