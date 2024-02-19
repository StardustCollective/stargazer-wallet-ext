///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import SearchIcon from 'assets/images/svg/search.svg';
import CircularProgress from '@material-ui/core/CircularProgress';

///////////////////////////
// Helpers
///////////////////////////

import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';

///////////////////////
// Types
///////////////////////

import IConfirmationInfo from './types';
import { ISearchCurrency, ICurrencyNetwork } from 'state/swap/types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './TokenList.scss';

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

const ConfirmDetails: FC<IConfirmationInfo> = ({
  currencyData,
  searchValue,
  isLoading,
  action,
  onTokenCellPressed,
  onSearchChange,
  balances,
}) => {
  const RenderFromItem = (currencyData: ISearchCurrency[]) => {
    return currencyData?.map((item: ISearchCurrency) => {
      return (
        <div
          key={item.code}
          className={styles.tokenCell}
          onClick={() => onTokenCellPressed(item, item.networks[0])}
        >
          <div className={styles.tokenCellLeft}>
            <img src={item.icon} className={styles.tokenIcon} />
            <div className={styles.tokenCellLeftText}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                {item.code}
              </TextV3.CaptionStrong>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{item.name}</TextV3.Caption>
            </div>
          </div>
          <div className={styles.tokenCellRight}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{`${formatStringDecimal(
              formatNumber(Number(balances[item.id]), 16, 20),
              4
            )}`}</TextV3.CaptionStrong>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              {item.networks[0].name}
            </TextV3.Caption>
          </div>
        </div>
      );
    });
  };

  const RenderToItem = (currencyData: ISearchCurrency[]) => {
    return currencyData?.map((item: ISearchCurrency) => {
      return item?.networks?.map((network: ICurrencyNetwork) => {
        return (
          <div key={item.code + network.name}>
            <div
              className={styles.tokenCell}
              onClick={() => onTokenCellPressed(item, network)}
            >
              <div className={styles.tokenCellLeft}>
                <img src={item.icon} className={styles.tokenIcon} />
                <div className={styles.tokenCellLeftText}>
                  <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                    {item.code}
                  </TextV3.CaptionStrong>
                  <TextV3.Caption
                    extraStyles={styles.currencyName}
                    color={COLORS_ENUMS.BLACK}
                  >
                    {item.name}
                  </TextV3.Caption>
                </div>
              </div>
              <div className={styles.tokenCellRight}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                  {network.network}
                </TextV3.CaptionStrong>
                <TextV3.Caption color={COLORS_ENUMS.BLACK}>{network.name}</TextV3.Caption>
              </div>
            </div>
          </div>
        );
      });
    });
  };

  const ListEmptyComponent = () => {
    if (action === SWAP_ACTIONS.FROM) {
      return (
        <div className={styles.listEmpty}>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_COINS_AVAILABLE}</TextV3.Body>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>{PLEASE_ADD_FUNDS}</TextV3.Body>
        </div>
      );
    } else {
      return (
        <div className={styles.listEmpty}>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>{NO_COINS_FOUND}</TextV3.Body>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      {action === SWAP_ACTIONS.TO && (
        <div className={styles.header}>
          <div className={styles.search}>
            <div className={styles.searchIcon}>
              <img src={`/${SearchIcon}`} />
            </div>
            <TextInput
              value={searchValue}
              placeholder={SEARCH_STRING}
              classes={{ root: styles.searchInput }}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}
      {isLoading ? (
        <div className={styles.listEmpty}>
          <CircularProgress />
        </div>
      ) : currencyData === null || currencyData?.length === 0 ? (
        <>
          <ListEmptyComponent />
        </>
      ) : (
        <div className={styles.list}>
          {action === SWAP_ACTIONS.TO
            ? RenderToItem(currencyData)
            : RenderFromItem(currencyData)}
        </div>
      )}
    </div>
  );
};

export default ConfirmDetails;
