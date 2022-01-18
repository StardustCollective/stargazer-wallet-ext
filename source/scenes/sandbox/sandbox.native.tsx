import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';
import CircleIcon from 'components/CircleIcon';
import Card from 'components/Card';
import PurpleSlider from 'components/PurpleSlider';
import { Tooltip } from 'react-native-elements';
import Icon from 'components/Icon';
import ToastAlert from 'components/ToastAlert';
import TooltipComponent from 'components/Tooltip';
import { Image } from 'react-native-elements';
import FileSelect from 'components/FileSelect';

const asset = {
  address: '0x0AbdAce70D3790235af448C88547603b945604ea',
  decimals: 18,
  id: '0x0AbdAce70D3790235af448C88547603b945604ea',
  isDefault: false,
  label: 'district0x',
  logo: 'https://assets.coingecko.com/coins/images/849/small/district0x.png?1547223762',
  network: 'mainnet',
  priceId: 'district0x',
  symbol: 'DNT',
  type: 'erc20',
};

import ConstellationIcon from 'assets/images/svg/constellation.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import StargazerIcon from 'assets/images/svg/stargazerLogoV3.svg';

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 50,
  },
});

const iconStyles = StyleSheet.create({
  icon: {
    backgroundColor: 'white',
    border: '1px solid gray',
  },
  iconPurple: {
    backgroundColor: 'purple',
  },
});

const Sandbox = () => {
  const [value, setValue] = useState(5);
  return (
    <SafeAreaView>
      <Text> SandBox</Text>
      <Card>
        <CircleIcon logo={asset.logo} label={asset.label}></CircleIcon>
        <Text>Hello word</Text>
        <PurpleSlider
          min={0}
          max={200}
          onChange={setValue}
          step={1}
          value={value}
        />
        <ToastAlert message="Hello this is a toast talert"></ToastAlert>
        <TooltipComponent body="HELLO I AM A TOOLTIP" arrow={true}>
            <Text> Click on me to open tooltip with component</Text>
        </TooltipComponent>
        <View style={styles.view}>
          <Tooltip
            containerStyle={{ color: 'white' }}
            popover={<Text style={{ color: 'white' }}>no caret!</Text>}
            withPointer={false}
          >
            <Text>without caret</Text>
          </Tooltip>
        </View>
        <Text>HELLO CHANGE</Text>
        <Icon Component="success"/>
        <FileSelect/>
      </Card>
    </SafeAreaView>
  );
};

export default Sandbox;
