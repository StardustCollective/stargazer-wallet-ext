import React, { FC } from 'react';
import { View, ScrollView, Image } from 'react-native';
import TextV3 from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import NFTAttributeItem from 'components/NFTAttributeItem';
import LoadingDetails from '../LoadingDetails';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import LaunchIcon from 'assets/images/svg/launch.svg';
import { formatNumber } from 'scenes/home/helpers';
import { NFTDetailsProps } from './types';
import styles from './styles';
import {
  ATTRIBUTES,
  DESCRIPTION,
  NFT_NOT_FOUND,
  SEND_NFT,
  VIEW_ON_OPENSEA,
} from './constants';

const NFTDetails: FC<NFTDetailsProps> = ({
  logo,
  quantity,
  selectedNFT,
  onPressSendNFT,
  onPressViewOpenSea,
}) => {
  const { data, error, loading } = selectedNFT;

  const showLoading = loading;
  const showNotFound = !data || !!error;
  const showNFTDetails = !!data;

  if (showLoading) {
    return (
      <View style={[styles.container, styles.contentContainer]}>
        <LoadingDetails />
      </View>
    );
  }

  if (showNotFound) {
    return (
      <View style={styles.noDataContainer}>
        <StargazerCard height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NFT_NOT_FOUND}
        </TextV3.BodyStrong>
      </View>
    );
  }

  if (showNFTDetails) {
    const quantityLabel = !isNaN(quantity) ? formatNumber(quantity, 0, 0) : '1';

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Image source={{ uri: logo }} style={styles.image} />
        <View style={styles.titleContainer}>
          <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
            {data?.name || '-'}
          </TextV3.Header>
          <TextV3.Body color={COLORS_ENUMS.SECONDARY_TEXT}>
            Items: {quantityLabel}
          </TextV3.Body>
        </View>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={SEND_NFT}
          onPress={onPressSendNFT}
          extraStyles={styles.sendButton}
        />
        <View style={styles.descriptionContainer}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle}>
            {DESCRIPTION}
          </TextV3.BodyStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {!!data?.description ? data.description : '-'}
          </TextV3.CaptionRegular>
        </View>
        {!!data?.traits?.length && (
          <View style={styles.attributesContainer}>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle}>
              {ATTRIBUTES}
            </TextV3.BodyStrong>
            <View style={styles.attributesItemsContainer}>
              {data.traits.map((trait) => (
                <NFTAttributeItem
                  key={trait.trait_type}
                  type={trait.trait_type}
                  value={trait.value}
                />
              ))}
            </View>
          </View>
        )}
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={VIEW_ON_OPENSEA}
          onPress={onPressViewOpenSea}
          extraStyles={styles.sendButton}
          extraTitleStyles={styles.sendTitleButton}
          icon={<LaunchIcon />}
          iconRight
        />
      </ScrollView>
    );
  }

  return null;
};

export default NFTDetails;
