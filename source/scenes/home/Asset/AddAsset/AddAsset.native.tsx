import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import Icon from 'components/icon';
import ButtonV3 from 'components/ButtonV3';

import Header from 'scenes/common/Header';
import { useController } from 'hooks/index';
import { RootState } from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import SearchIcon from 'assets/images/svg/search.svg';
import { v4 as uuid } from 'uuid';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import AddAssetSettings from './types';
import styles from './styles';

const AddAsset: FC<AddAssetSettings> = ({
  handleAddAsset,
  onChangeAddress,
  register,
  control,
  onSubmit,
  handleSubmit,
  keyword,
  filteredAssets,
}) => {
  return (
    <View style={styles.wrapper}>
      <Header backLink="/home" />
      <TextV3.Label color={COLORS_ENUMS.dark_gray} style={styles.account}>
        Add Asset
      </TextV3.Label>
      <View style={styles.addAsset}>
        <View style={styles.searchInput}>
          <Icon name="search" />
          <TextInput
            register={register}
            control={control}
            placeholder="Search by name ticker or contract"
            fullWidth
            value={keyword}
            name="address"
            onChange={onChangeAddress}
            variant={styles.searchAsset}
          />
        </View>
        <View style={styles.assets}>
          {filteredAssets &&
            filteredAssets.map((asset: IAssetInfoState) => {
              const Logo = asset.logo;
              return (
                <View key={uuid()}>
                  <View>
                    <View>
                      <View style={styles.iconWrapper}>
                        <Logo />
                      </View>
                      <TextV3.Label color={COLORS_ENUMS.DARK_GRAY}>{asset.label}</TextV3.Label>
                    </View>
                    <ButtonV3 buttonStyle={styles.addButton} onPress={() => handleAddAsset(asset)} icon="add-circle" />
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default AddAsset;
