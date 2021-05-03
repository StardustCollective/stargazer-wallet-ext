import React, { Fragment, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddCircle from '@material-ui/icons/AddCircle';

import TextInput from 'components/TextInput';
import Header from 'containers/common/Header';
import { useController } from 'hooks/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import SearchIcon from 'assets/images/svg/search.svg';
import styles from './Asset.scss';

const AddAsset = () => {
  const controller = useController();
  const history = useHistory();
  const { wallet, activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const [filteredAssets, setFilteredAssets] = useState<
    Array<IAssetInfoState>
  >();
  const [keyword, setKeyword] = useState('');
  // const account = accounts[activeAccountId];

  const alreadyInWallet = wallet.assets.reduce<{[key: string]: boolean}>(
    (_res, a) => ({ [a.id]: true }), {}
  );

  const handleAddAsset = (asset: IAssetInfoState) => {
    if (!asset.contract) return;
    controller.wallet.account.addNewAsset(asset).then(() => {
      history.push('/home');
    });
  };

  useEffect(() => {
    if (
      activeNetwork[AssetType.Ethereum] === 'mainnet' &&
      keyword.startsWith('0x')
    ) {
      controller.assets.fetchTokenInfo(keyword);
    }

    setFilteredAssets(
      Object.values(assets).filter(
        (asset) =>
          (asset.network === 'both' ||
            asset.network === activeNetwork[AssetType.Ethereum]) &&
          !alreadyInWallet[asset.id] &&
          (asset.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (asset?.contract || '').includes(keyword)) &&
          (wallet.supportedAssets || asset.id !== AssetType.Constellation)
      )
    );
  }, [keyword, assets]);

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.account}>Add Asset</section>
      <section className={styles.addAsset}>
        <div className={styles.searchInput}>
          <img src={`/${SearchIcon}`} />
          <TextInput
            placeholder="Search by name ticker or contract"
            fullWidth
            value={keyword}
            name="address"
            onChange={(e) => setKeyword(e.target.value)}
            variant={styles.searchAsset}
          />
        </div>
        <div className={styles.assets}>
          <ul>
            {filteredAssets &&
              filteredAssets.map((asset) => {
                return (
                  <Fragment key={uuid()}>
                    <li>
                      <div>
                        <div className={styles.iconWrapper}>
                          <img src={asset.logo}></img>
                        </div>
                        <span>{asset.name}</span>
                      </div>
                      <IconButton
                        className={styles.addButton}
                        onClick={() => handleAddAsset(asset)}
                      >
                        <AddCircle />
                      </IconButton>
                    </li>
                  </Fragment>
                );
              })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AddAsset;
