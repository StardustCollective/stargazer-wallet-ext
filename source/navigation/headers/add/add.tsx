///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import defaultHeader from '../default';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';

///////////////////////////
// Interface
///////////////////////////

interface IAddHeader {
  navigation: any;
  onRightIconClick: () => void;
}

///////////////////////////
// Header
///////////////////////////

const addHeader = ({ navigation, onRightIconClick }: IAddHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerRight: () => (
      <IconButton
        id={'header-addButton'}
        className={styles.linkIcon}
        onClick={onRightIconClick}
      >
        <AddIcon className={styles.buttonRight} />
      </IconButton>
    ),
  };
};

export default addHeader;
