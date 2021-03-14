import React, { Fragment, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import AddCircle from '@material-ui/icons/AddCircle';

import TextInput from 'components/TextInput';
import styles from './AddAsset.scss';
import SearchIcon from 'assets/images/svg/search.svg';

import IWalletState from 'state/wallet/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';

const AddAsset = () => {
  const [filteredAssets, setFilteredAssets] = useState<
    Array<IAssetInfoState>
  >();
  const [keyword, setKeyword] = useState('');
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];

  useEffect(() => {
    setFilteredAssets(
      Object.values(account.assets)
        .filter((asset) => assets[asset.id].name.includes(keyword))
        .map((asset) => assets[asset.id])
    );
  }, []);

  return (
    <section className={styles.addAsset}>
      <div className={styles.searchInput}>
        <img src={SearchIcon} />
        <TextInput
          placeholder="Search by name ticker or contract"
          fullWidth
          value={keyword}
          name="address"
          // inputRef={register}
          onChange={(e) => setKeyword(e.target.value)}
          // variant={addressInputClass}
        />
      </div>
      <div className={styles.assets}>
        <ul>
          {filteredAssets &&
            filteredAssets.map((asset) => {
              return (
                <Fragment key={uuid()}>
                  <li
                    onClick={() => {
                      // TODO
                    }}
                  >
                    <div>
                      <div className={styles.iconWrapper}>
                        <img src={asset.logo}></img>
                      </div>
                      <span>{asset.name}</span>
                    </div>
                    <AddCircle
                      // className={styles.addAssets}
                      onClick={() => {
                        // TODO
                        console.log('Add Token');
                      }}
                    />
                  </li>
                </Fragment>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default AddAsset;
