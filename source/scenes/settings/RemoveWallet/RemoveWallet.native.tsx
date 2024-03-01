import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import RemoveWalletHeader from './RemoveWalletHeader';
import IRemoveWalletSettings from './types';
import { CANCEL, REMOVE, SUBTITLE, TITLE } from './constants';
import styles from './styles';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  wallet,
  loading,
  handleCancel,
  handleRemoveWallet,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <RemoveWalletHeader wallet={wallet} title={TITLE} subtitle={SUBTITLE} />
      <View style={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={CANCEL}
          extraStyles={styles.button}
          onPress={handleCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.ERROR_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={REMOVE}
          loading={loading}
          extraStyles={styles.button}
          onPress={handleRemoveWallet}
        />
      </View>
    </ScrollView>
  );
};

export default RemoveWallet;
