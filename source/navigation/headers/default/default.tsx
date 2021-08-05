///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import config from '../config';

///////////////////////////
// Styles
///////////////////////////

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';
import commonStyles from './../styles.scss';

///////////////////////////
// Interfaces
///////////////////////////
interface IDefaultHeader {
  navigation: any
}

///////////////////////////
// Header
///////////////////////////

const defaultHeader = ({
  navigation,
}: IDefaultHeader) => {

  const index = navigation.dangerouslyGetState().index

  const onBackButtonClicked = () => {
    navigation.goBack();
  }

  const renderHeaderLeft = () => {

    if (index > 0) {
      return (
      <IconButton
        className={`${styles.buttonLeft} ${styles.more}`}
        onClick={onBackButtonClicked}
      >
        <ArrowBackIcon className={styles.buttonLeft} />
      </IconButton>)
    }
    // Hack: The header title will not center unless there is 
    // both a headerLeft and headerRight. So we insert an 
    // empty div to meet the requirement.
    return (<div className={commonStyles.emptyDiv}></div>);

  }

  return {
    ...config,
    headerLeft: () => renderHeaderLeft(),
    headerRight: () => (
      <div className={commonStyles.emptyDiv}></div>
    ),
  }
};

export default defaultHeader;