import React, { useEffect, useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import Container from 'components/Container';
import { getWalletController } from 'utils/controllersUtils';

import AssetsController from 'scripts/Background/controllers/AssetsController';
import ControllerUtils from 'scripts/Background/controllers/ControllerUtils';

import AddAsset from './AddAsset';

const AddAssetContainer: FC = () => {
  const walletController = getWalletController();
  const history = useHistory();
  const { activeWallet, activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const [filteredAssets, setFilteredAssets] = useState<Array<IAssetInfoState>>();
  const [keyword, setKeyword] = useState('');
  // const account = accounts[activeAccountId];

  const alreadyInWallet = activeWallet.assets.reduce<{ [key: string]: boolean }>(
    (res, a) => ((res[a.address] = true), res),
    {}
  );

  const handleAddAsset = (asset: IAssetInfoState) => {
    if (!asset.address) return;
    walletController.account.addNewToken(asset.address).then(() => {
      history.push('/home');
    });
  };

  useEffect(() => {
    if (activeNetwork[KeyringNetwork.Ethereum] === 'mainnet' && keyword.startsWith('0x')) {
      // TODO: check if this is correct usage of updateFiat
      const util = ControllerUtils();
      AssetsController(util.updateFiat).fetchTokenInfo(keyword);
    }

    const currentNetwork = activeNetwork[KeyringNetwork.Ethereum];
    const lcKeyword = keyword.toLowerCase();

    setFilteredAssets(
      Object.values(assets).filter((asset) => {
        if (asset.network === 'both' || asset.network === currentNetwork) {
          if (asset.type === AssetType.ERC20 && asset.address && !alreadyInWallet[asset.id]) {
            const label = asset.label.toLowerCase();
            return label.includes(lcKeyword) || asset.address.includes(lcKeyword);
          }
        }
        return false;
      })
    );
  }, [keyword, assets]);

  const onChangeAddress = (e: any) => {
    if (e?.nativeEvent?.text) {
      return setKeyword(e.nativeEvent.text);
    }

    return setKeyword(e.target.value);
  };

  return (
    <Container>
      <AddAsset
        handleAddAsset={handleAddAsset}
        onChangeAddress={onChangeAddress}
        filteredAssets={filteredAssets}
        keyword={keyword}
      />
    </Container>
  );
};

export default AddAssetContainer;
