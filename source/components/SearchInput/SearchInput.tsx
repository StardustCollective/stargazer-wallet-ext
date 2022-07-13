///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import SearchIcon from 'assets/images/svg/search.svg';

///////////////////////////
// Types
///////////////////////////

import ISearchInput from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './SearchInput.scss';

const SearchInput: FC<ISearchInput> = ({ value, onChange }) => {

  return (
    <div className={styles.container}>
      <img src={`/${SearchIcon}`} className={styles.icon} alt="Search icon" />
      <input 
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search'
      />
    </div>
  )
}

export default SearchInput;