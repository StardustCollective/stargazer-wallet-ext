///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import clsx from 'clsx';
import SearchIcon from 'assets/images/svg/search.svg';

///////////////////////////
// Styles
///////////////////////////

import styles from './SearchInput.scss';

export interface ISearchInput extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  placeholder?: string;
  onChange: (text: any) => any;
  extraStyles?: any;
  extraInputStyles?: any;
  placeholderTextColor?: string;
  selectionColor?: string;
}

const SearchInput: FC<ISearchInput> = ({
  value,
  onChange,
  placeholder = 'Search',
  placeholderTextColor = 'black',
  selectionColor = 'white',
  extraStyles = {},
  extraInputStyles = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusedStyle = isFocused && styles.focused;

  return (
    <div className={clsx(styles.container, focusedStyle, extraStyles)}>
      <img src={`/${SearchIcon}`} className={styles.icon} alt="Search icon" />
      <input
        className={clsx(styles.input, extraInputStyles)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
