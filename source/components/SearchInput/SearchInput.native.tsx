///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, TextInput } from 'react-native';
import SearchIcon from 'assets/images/svg/search.svg'

///////////////////////////
// Types
///////////////////////////

import ISearchInput from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const SearchInput: FC<ISearchInput> = ({ value, onChange }) => {

  return (
    <View style={styles.container}>
      <SearchIcon style={styles.icon} width={16} height={16} fill='white' />
      <TextInput
        style={styles.input}
        value={value}
        placeholder='Search'
        placeholderTextColor='grey'
        selectionColor='white'
        onChange={(e) => onChange(e.nativeEvent.text)}
      />
    </View>
  )
}

export default SearchInput;