///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';
import { CardStyleInterpolators } from '@react-navigation/stack';

///////////////////////////
// Styles
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from 'assets/images/svg/arrow-rounded-left.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';
import commonStyles from './../styles.scss';

///////////////////////////
// Interfaces
///////////////////////////
interface IDefaultHeader {
  navigation: any;
  onBackPressed?: () => void;
}

///////////////////////////
// Header
///////////////////////////

const defaultHeader = ({ navigation, onBackPressed }: IDefaultHeader) => {
  const onBackButtonClicked = () => {
    navigation.goBack();
  };

  const renderHeaderLeft = () => {
    return (
      <IconButton
        id={'header-backButton'}
        className={`${styles.buttonLeft} ${styles.more}`}
        onClick={onBackPressed || onBackButtonClicked}
      >
        <img src={`/${ArrowLeftIcon}`} />
      </IconButton>
    );
  };

  return {
    ...config,
    headerLeft: () => renderHeaderLeft(),
    headerRight: () => <div className={commonStyles.emptyDiv}></div>,
    animationEnabled: true,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
};

export default defaultHeader;
