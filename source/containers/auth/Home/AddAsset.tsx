import React, { Fragment, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import AddCircle from '@material-ui/icons/AddCircle';

import TextInput from 'components/TextInput';
import styles from './AddAsset.scss';
import SearchIcon from 'assets/images/svg/search.svg';

import mockAssets from './mockData';
import { Asset } from './types';

const AddAsset = () => {
  const [filteredAssets, setFilteredAssets] = useState<Array<Asset>>();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setFilteredAssets(
      mockAssets.filter((asset: Asset) => asset.name.includes(keyword))
    );
  }, [keyword]);
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
            filteredAssets.map((asset: Asset) => {
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
