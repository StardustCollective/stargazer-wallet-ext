import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';

import Select from 'components/Select';

import styles from './styles';

import INetworkSettings from './types';

const NetworksComponent: FC<INetworkSettings> = ({ networkOptions }) => {
  // pass in open state methods so we can not have multiple dropdowns open on the same page
  const [openNetwork1, setOpenNetwork1] = useState(false);
  const [openNetwork2, setOpenNetwork2] = useState(false);
  const onOpenNetwork1 = () => {
    setOpenNetwork2(false);
  };

  const onOpenNetwork2 = () => {
    setOpenNetwork1(false);
  };

  return (
    <View style={styles.wrapper}>
      {networkOptions.map((network, i) => {
        const openProps = {
          open: i === 0 ? openNetwork1 : openNetwork2,
          setOpen: i === 0 ? setOpenNetwork1 : setOpenNetwork2,
          onOpen: i === 0 ? onOpenNetwork1 : onOpenNetwork2,
        };

        return (
          <View key={network.key} style={network.containerStyle}>
            <Text style={styles.label}>{network.label}</Text>
            <Select
              value={network.value}
              onChange={network.onChange}
              options={network.options}
              extraProps={{ ...network.extraProps, ...openProps }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default NetworksComponent;
