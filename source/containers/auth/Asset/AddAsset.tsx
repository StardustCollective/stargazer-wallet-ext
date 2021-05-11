import React, { Fragment, useEffect, useState } from 'react';
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
import { v4 as uuid } from 'uuid';

const AddAsset = () => {
  const controller = useController();
  const history = useHistory();
  const { activeWallet, activeNetwork }: IVaultState = useSelector(
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

  const alreadyInWallet = activeWallet.assets.reduce<{[key: string]: boolean}>(
    (res, a) => (res[a.address] = true, res ), {}
  );

  const handleAddAsset = (asset: IAssetInfoState) => {
    if (!asset.address) return;
    controller.wallet.account.addNewToken(asset.address).then(() => {
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

    const currentNetwork = activeNetwork[AssetType.Ethereum];
    const lcKeyword = keyword.toLowerCase()

    setFilteredAssets(
      Object.values(assets).filter(asset => {
          if(asset.network === 'both' || asset.network === currentNetwork) {
            if(asset.type === AssetType.ERC20 && asset.address && !alreadyInWallet[asset.id]) {
              const label = asset.label.toLowerCase();
              return label.includes(lcKeyword) || asset.address.includes(lcKeyword);
            }
          }
          return false;
        }
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
                        <span>{asset.label}</span>
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
