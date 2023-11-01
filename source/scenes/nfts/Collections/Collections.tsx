import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import LoadingList from '../LoadingList';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaCollectionWithChain } from 'state/nfts/types';
import { NFTS_NOT_FOUND, SEARCH_PLACEHOLDER } from './constants';
import { PLACEHOLDER_IMAGE } from 'constants/index';
import { CollectionsProps } from './types';
import styles from './Collections.scss';

const Collections: FC<CollectionsProps> = ({
  collections,
  onPressCollection,
  searchValue,
  onSearch,
  hasItems,
}) => {
  const { data, error, loading } = collections;

  const showLoading = loading;
  const showEmptyList = (!!data && !Object.keys(data).length && !hasItems) || !!error;
  const showCollectionList = (!!data && Object.keys(data).length) || hasItems;

  const renderCollectionItem = (item: IOpenSeaCollectionWithChain) => {
    const collectionLogo = !!item?.image_url
      ? item.image_url
      : !!item?.nfts[0]?.image_url
      ? item.nfts[0].image_url
      : PLACEHOLDER_IMAGE;

    return (
      <CardNFT
        key={item.collection}
        title={item.name}
        subtitle={item.nfts.length.toString()}
        logo={collectionLogo}
        chain={item.chain}
        onPress={() => onPressCollection(item)}
      />
    );
  };

  const renderNoNfts = () => {
    return (
      <div className={styles.noDataContainer}>
        <img src={`/${StargazerCard}`} height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NFTS_NOT_FOUND}
        </TextV3.BodyStrong>
      </div>
    );
  };

  if (showLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder={SEARCH_PLACEHOLDER}
            extraStyles={styles.searchInputContainer}
            disabled={true}
          />
        </div>
        <LoadingList />
      </div>
    );
  }

  if (showEmptyList) {
    return <>{renderNoNfts()}</>;
  }

  if (showCollectionList) {
    const hasItems = !!Object.values(data).length;
    return (
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <SearchInput
            placeholder={SEARCH_PLACEHOLDER}
            value={searchValue}
            onChange={onSearch}
            extraStyles={styles.searchInputContainer}
            extraInputStyles={styles.searchInput}
            disabled={false}
          />
        </div>
        {hasItems ? (
          <div className={styles.itemsContainer}>
            {Object.values(data).map((item) => renderCollectionItem(item))}
          </div>
        ) : (
          renderNoNfts()
        )}
      </div>
    );
  }

  return null;
};

export default Collections;
