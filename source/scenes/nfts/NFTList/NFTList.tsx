import React, { FC } from 'react';
import { NFTListProps } from './types';
import TextV3 from 'components/TextV3';
import SearchInput from 'components/SearchInput';
import LoadingList from '../LoadingList';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import CardNFT from 'components/CardNFT';
import { IOpenSeaNFT } from 'state/nfts/types';
import { formatNumber } from 'scenes/home/helpers';
import styles from './NFTList.scss';
import { NO_NFTS_FOUND, SEARCH_PLACEHOLDER } from './constants';
import { PLACEHOLDER_IMAGE } from 'constants/index';

const NFTList: FC<NFTListProps> = ({
  loading,
  selectedCollection,
  data,
  hasItems,
  searchValue,
  onPressNFT,
  onSearch,
}) => {
  const showLoading = loading;
  const showEmptyList = !data?.length && !hasItems;
  const showNFTList = !!data?.length || hasItems;

  const renderNftItem = (item: IOpenSeaNFT) => {
    const nftLogo = !!item?.image_url ? item.image_url : PLACEHOLDER_IMAGE;
    const quantity = !isNaN(item.quantity) ? formatNumber(item.quantity, 0, 0) : '1';
    return (
      <CardNFT
        key={item.identifier}
        title={item.name}
        subtitle={quantity}
        logo={nftLogo}
        chain={selectedCollection?.chain}
        onPress={() => onPressNFT(item)}
      />
    );
  };

  const renderNoNfts = () => {
    return (
      <div className={styles.noDataContainer}>
        <img src={`/${StargazerCard}`} height={72} />
        <TextV3.BodyStrong color={COLORS_ENUMS.GRAY_100} extraStyles={styles.noFoundText}>
          {NO_NFTS_FOUND}
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

  if (showNFTList) {
    const hasItems = !!data?.length;
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
            {data.map((item) => renderNftItem(item))}
          </div>
        ) : (
          renderNoNfts()
        )}
      </div>
    );
  }

  return null;
};

export default NFTList;
