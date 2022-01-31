import React, { FC } from 'react';
import { Image } from 'react-native-elements';

import styles from './styles';

interface ICircleIcon {
  logo: string;
  label: string;
}

const CircleIcon: FC<ICircleIcon> = ({ logo, label }) => {
  console.log( 'logo', logo);
  const uri = logo.startsWith('http') ? logo : '/' + logo;
  
  if(logo.startsWith('http')) {
    return (
        <Image 
          containerStyle={styles.logoWrapper}
          accessible
          accessibilityLabel={label}
          source={{uri: logo, height:23}}/>
    );
  }
}

export default CircleIcon;