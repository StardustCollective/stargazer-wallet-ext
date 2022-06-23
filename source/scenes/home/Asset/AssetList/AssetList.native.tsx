///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import AssetWithToggle from 'components/AssetWithToggle';

///////////////////////////
// Types
///////////////////////////

import { IAssetList } from './types';
import { IAssetInfoState } from 'state/assets/types';
import { ERC20Asset } from 'state/erc20assets/types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
const ACTIVITY_INDICATOR_SIZE = 'small';

const AssetList: FC<IAssetList> = ({ assets, loading, constellationAssets, erc20assets, toggleAssetItem }) => {

  const renderAssetList = () => {
    return (
      <>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle}>Constellation Ecosystem</TextV3.CaptionStrong>
        {constellationAssets?.length 
          && constellationAssets.map((item: IAssetInfoState) => {
            const selected = !!assets[item.id];
            return <AssetWithToggle 
                      id={item.id}
                      symbol={item.symbol} 
                      logo={item.logo} 
                      label={item.label} 
                      selected={selected} 
                      toggleItem={(value) => toggleAssetItem(item, value)} />;
          })
        }
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle}>All ERC-20 Tokens</TextV3.CaptionStrong>
        {erc20assets?.length 
          && erc20assets.map((item: ERC20Asset) => {
            if (item.symbol === 'eth') return null;
            const selected = !!assets[item.id];
            return <AssetWithToggle 
                      id={item.id}
                      symbol={item.symbol.toUpperCase()} 
                      logo={item.image} 
                      label={item.name} 
                      selected={selected} 
                      toggleItem={(value) => toggleAssetItem(item, value)} />;
          })
        }
      </>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
      {loading ? <ActivityIndicator style={styles.loadingContainer} size={ACTIVITY_INDICATOR_SIZE} /> : renderAssetList()}
    </ScrollView>
  );
};

export default AssetList;
