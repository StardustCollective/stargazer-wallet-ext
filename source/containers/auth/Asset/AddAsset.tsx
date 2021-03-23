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
import IWalletState, { AssetType } from 'state/wallet/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import SearchIcon from 'assets/images/svg/search.svg';
import styles from './Asset.scss';

const AddAsset = () => {
  const controller = useController();
  const history = useHistory();
  const {
    accounts,
    activeAccountId,
    activeNetwork,
  }: IWalletState = useSelector((state: RootState) => state.wallet);
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const [filteredAssets, setFilteredAssets] = useState<
    Array<IAssetInfoState>
  >();
  const [keyword, setKeyword] = useState('');
  const account = accounts[activeAccountId];

  const handleAddAsset = (id: string, address?: string) => {
    if (!address) return;
    controller.wallet.account
      .addNewAsset(activeAccountId, id, address)
      .then(() => {
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
          !account.assets[asset.id] &&
          (asset.name.toLowerCase().includes(keyword.toLowerCase()) ||
            (asset?.address || '').includes(keyword))
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
                        onClick={() => handleAddAsset(asset.id, asset.address)}
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
