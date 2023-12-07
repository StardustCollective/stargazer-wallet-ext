import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import { AssetType } from 'state/vault/types';

export const getKeyringAssetType = (type: AssetType): KeyringAssetType => {
  switch (type) {
    case AssetType.Constellation:
      return KeyringAssetType.DAG;
    case AssetType.Ethereum:
      return KeyringAssetType.ETH;
    default:
      return KeyringAssetType.ERC20;
  }
};
