import React, { FC } from 'react';
import clsx from 'clsx';
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
import styles from './NFTDetails.scss';
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
      <div className={clsx(styles.container, styles.contentContainer)}>
        <LoadingDetails />
      </div>
    );
  }

  if (showNotFound) {
    return (
      <div className={styles.noDataContainer}>
        <img src={`/${StargazerCard}`} height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NFT_NOT_FOUND}
        </TextV3.BodyStrong>
      </div>
    );
  }

  if (showNFTDetails) {
    const quantityLabel = !isNaN(quantity) ? formatNumber(quantity, 0, 0) : '1';

    return (
      <div className={styles.container}>
        <img src={logo} className={styles.image} />
        <div className={styles.titleContainer}>
          <TextV3.Header color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
            {data?.name || '-'}
          </TextV3.Header>
          <TextV3.Body color={COLORS_ENUMS.SECONDARY_TEXT}>
            Items: {quantityLabel}
          </TextV3.Body>
        </div>
        <div className={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label={SEND_NFT}
            onClick={onPressSendNFT}
            extraStyle={styles.sendButton}
          />
        </div>
        <div className={styles.descriptionContainer}>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.subtitle}>
            {DESCRIPTION}
          </TextV3.BodyStrong>
          <TextV3.CaptionRegular color={COLORS_ENUMS.SECONDARY_TEXT}>
            {!!data?.description ? data.description : '-'}
          </TextV3.CaptionRegular>
        </div>
        {!!data?.traits?.length && (
          <div className={styles.attributesContainer}>
            <div className={styles.subtitle}>
              <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                {ATTRIBUTES}
              </TextV3.BodyStrong>
            </div>
            <div className={styles.attributesItemsContainer}>
              {data.traits.map((trait) => (
                <NFTAttributeItem
                  key={trait.trait_type}
                  type={trait.trait_type}
                  value={trait.value}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            size={BUTTON_SIZES_ENUM.LARGE}
            label={VIEW_ON_OPENSEA}
            onClick={onPressViewOpenSea}
            extraStyle={styles.sendButton}
            rightIcon={<img src={`/${LaunchIcon}`} />}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default NFTDetails;
