import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Icon from 'components/Icon';
import TextV3 from 'components/TextV3';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';
import AddWalletSettings from './types';

const ICON_SIZE = 36;

const AddWallet: FC<AddWalletSettings> = ({
  onCreateNewWalletClicked,
  onImportWalletClicked,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onCreateNewWalletClicked}>
        <View testID="addWallet-createNewWallet" style={styles.menu}>
          <View style={styles.stargazerIconWrapper}>
            <StargazerIcon width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
            Create New Wallet
          </TextV3.Body>
          <Icon
            type="font_awesome"
            name="chevron-right"
            iconContainerStyles={styles.iconWrapper}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onImportWalletClicked}>
        <View testID="addWallet-importWallet" style={styles.menu}>
          <View style={styles.stargazerIconWrapper}>
            <StargazerIcon width={ICON_SIZE} height={ICON_SIZE} />
          </View>
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
            Import Wallet
          </TextV3.Body>
          <Icon
            type="font_awesome"
            name="chevron-right"
            iconContainerStyles={styles.iconWrapper}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AddWallet;
