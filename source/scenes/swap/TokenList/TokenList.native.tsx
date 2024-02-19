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
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

///////////////////////////
// Helpers
///////////////////////////

import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';

///////////////////////
// Images
///////////////////////

import SearchIcon from 'assets/images/svg/search.svg';

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

import { SWAP_ACTIONS } from 'scenes/swap/constants';
import {
  SEARCH_STRING,
  NO_COINS_FOUND,
  NO_COINS_AVAILABLE,
  PLEASE_ADD_FUNDS,
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
  action,
  balances,
}) => {
  const RenderFromItem = ({ item }) => {
    return (
      <View key={item?.code}>
        <TouchableOpacity
          style={styles.tokenCell}
          onPress={() => onTokenCellPressed(item, item.networks[0])}
        >
          <View style={styles.tokenCellLeft}>
            <Image source={{ uri: item?.icon }} style={styles.tokenIcon} />
            <View>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                {item?.code}
              </TextV3.CaptionStrong>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{item?.name}</TextV3.Caption>
            </View>
          </View>
          <View style={styles.tokenCellRight}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{`${formatStringDecimal(
              formatNumber(Number(balances[item?.id]), 16, 20),
              4
            )}`}</TextV3.CaptionStrong>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              {item.networks[0].name}
            </TextV3.Caption>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderToItem = ({ item }) => {
    return item?.networks.map((network) => {
      return (
        <View key={item?.code + network?.name}>
          <TouchableOpacity
            style={styles.tokenCell}
            onPress={() => onTokenCellPressed(item, network)}
          >
            <View style={styles.tokenCellLeft}>
              <Image source={{ uri: item?.icon }} style={styles.tokenIcon} />
              <View>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {item?.code}
                </TextV3.CaptionStrong>
                <TextV3.Caption color={COLORS_ENUMS.BLACK}>{item?.name}</TextV3.Caption>
              </View>
            </View>
            <View style={styles.tokenCellRight}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                {network?.network}
              </TextV3.CaptionStrong>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{network?.name}</TextV3.Caption>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const ListEmptyComponent = () => {
    return (
      <View style={styles.listEmptyContainer}>
        {isLoading ? (
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} />
        ) : action === SWAP_ACTIONS.TO ? (
          <>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_COINS_FOUND}</TextV3.Body>
          </>
        ) : (
          <>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_COINS_AVAILABLE}</TextV3.Body>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>{PLEASE_ADD_FUNDS}</TextV3.Body>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {action === SWAP_ACTIONS.TO && (
        <View style={styles.header}>
          <View style={styles.search}>
            <View style={styles.searchIcon}>
              <SearchIcon
                width={SEARCH_ICON_SIZE}
                height={SEARCH_ICON_SIZE}
                fill={SEARCH_ICON_COLOR}
              />
            </View>
            <TextInput
              style={styles.searchInput}
              value={searchValue}
              placeholder={SEARCH_STRING}
              placeholderTextColor={SEARCH_BAR_PLACEHOLDER_TEXT_COLOR}
              selectionColor={SEARCH_BAR_SELECTION_COLOR}
              returnKeyType="done"
              onChange={(e) => onSearchChange(e.nativeEvent.text)}
            />
          </View>
        </View>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          ListEmptyComponent={ListEmptyComponent}
          data={currencyData}
          renderItem={action === SWAP_ACTIONS.TO ? RenderToItem : RenderFromItem}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContentContainer}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ConfirmDetails;
