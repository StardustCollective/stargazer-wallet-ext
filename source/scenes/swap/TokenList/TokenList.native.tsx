///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import SearchIcon from 'assets/images/svg/search.svg'

///////////////////////
// Types
///////////////////////

import ITokenList from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////
// constants
///////////////////////

import {
  SEARCH_STRING
} from './constants';

const SEARCH_ICON_SIZE = 16;
const SEARCH_ICON_COLOR = 'white';
const SEARCH_BAR_PLACEHOLDER_TEXT_COLOR = 'grey';
const SEARCH_BAR_SELECTION_COLOR = 'white';
const ACTIVITY_INDICATOR_SIZE = 'large';

///////////////////////
// Scene
///////////////////////

const ConfirmDetails: FC<ITokenList> = ({
  onTokenCellPressed,
  currencyData,
  onSearchChange,
  searchValue,
  isLoading,
}) => {

  const RenderItem = ({ item }) => {
    return item.networks.map((network) => {
      return (
        <>
          <TouchableOpacity style={styles.tokenCell} onPress={() => onTokenCellPressed(item, network)} >
            <View style={styles.tokenCellLeft}>
              <Image source={{ uri: item.icon }} style={styles.tokenIcon} />
              <View>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{item.code}</TextV3.CaptionStrong>
                <TextV3.Caption color={COLORS_ENUMS.BLACK}>{item.name}</TextV3.Caption>
              </View>
            </View>
            <View style={styles.tokenCellRight}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{network.network}</TextV3.CaptionStrong>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{network.name}</TextV3.Caption>
            </View>
          </TouchableOpacity>
        </>
      )
    })
  }

  const ListEmptyComponent = () => {
    return (
      <View style={styles.activityIndicator}>
        {isLoading ? (
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} />
        ) :
        (
          <TextV3.Body color={COLORS_ENUMS.BLACK}>Coin not found...</TextV3.Body>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.search}>
          <View style={styles.searchIcon}>
            <SearchIcon width={SEARCH_ICON_SIZE} height={SEARCH_ICON_SIZE} fill={SEARCH_ICON_COLOR} />
          </View>
          <TextInput
            style={styles.searchInput}
            value={searchValue}
            placeholder={SEARCH_STRING}
            placeholderTextColor={SEARCH_BAR_PLACEHOLDER_TEXT_COLOR}
            selectionColor={SEARCH_BAR_SELECTION_COLOR}
            onChange={(e) => onSearchChange(e.nativeEvent.text)}
          />
        </View>
      </View>
      <FlatList
        ListEmptyComponent={ListEmptyComponent}
        data={currencyData}
        renderItem={RenderItem}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      />
    </View>
  );
};

export default ConfirmDetails;
