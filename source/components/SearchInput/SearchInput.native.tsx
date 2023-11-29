///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { View, TextInput } from 'react-native';
import SearchIcon from 'assets/images/svg/search.svg';

///////////////////////////
// Types
///////////////////////////

import ISearchInput from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { NEW_COLORS } from 'assets/styles/_variables.native';

const SearchInput: FC<ISearchInput> = ({
  value,
  onChange,
  placeholder = 'Search',
  placeholderTextColor = NEW_COLORS.secondary_text,
  selectionColor = 'white',
  extraStyles = {},
  extraInputStyles = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusedStyle = isFocused && styles.focused;

  return (
    <View style={[styles.container, focusedStyle, extraStyles]}>
      <SearchIcon style={styles.icon} width={16} height={16} />
      <TextInput
        style={[styles.input, extraInputStyles]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        selectionColor={selectionColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.nativeEvent.text)}
        {...props}
      />
    </View>
  );
};

export default SearchInput;
