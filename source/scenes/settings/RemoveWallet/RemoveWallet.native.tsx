import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';

import styles from './styles';

import IRemoveWalletSettings from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  goBack,
  wallet,
  isSeedWallet,
  handleSubmit,
  register,
  control,
  onSubmit,
}) => {
  return (
    <View style={styles.removeAccount}>
      {wallet && (
        <View style={styles.subheading}>
          <TextV3.Caption extraStyles={styles.subheadingText}>Account name:</TextV3.Caption>
          <View style={styles.accountNameWrapper}>
            <Text style={styles.accountName}>{wallet.label}</Text>
          </View>
        </View>
      )}

      <TextV3.Caption extraStyles={StyleSheet.compose(styles.text, styles.formText)}>
        Please enter your wallet password:
      </TextV3.Caption>
      <TextInput
        control={control}
        type="password"
        // type="text"
        name="password"
        visiblePassword
        fullWidth
        inputRef={register}
        inputStyles={styles.input}
        inputContainerStyle={styles.inputWrapper}
      />
      <View>
        {isSeedWallet && (
          <TextV3.Body color={COLORS_ENUMS.DARK_GRAY} extraStyles={StyleSheet.compose(styles.text, styles.formText)}>
            This wallet will be removed from Stargazer. You will need to provide the recovery seed phrase in order to
            restore it.
          </TextV3.Body>
        )}
        {!isSeedWallet && (
          <TextV3.Body color={COLORS_ENUMS.DARK_GRAY} extraStyles={StyleSheet.compose(styles.text, styles.formText)}>
            This account will be removed from Stargazer. You will need to provide the private key in order to restore
            it.
          </TextV3.Body>
        )}
      </View>
      <View style={styles.actions}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
          size={BUTTON_SIZES_ENUM.SMALL}
          title="Cancel"
          extraTitleStyles={styles.close}
          extraStyles={StyleSheet.compose(styles.button, styles.close)}
          onPress={goBack}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.SMALL}
          title="Confirm"
          extraStyles={styles.button}
          onPress={() => console.log('submit')}
        />
      </View>
    </View>
  );
};

export default RemoveWallet;
