import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import IRemoveWalletSettings from './types';

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
          <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.subheadingText}>
            Account name:
          </TextV3.Description>
          <View style={styles.accountNameWrapper}>
            <Text style={styles.accountName}>{wallet.label}</Text>
          </View>
        </View>
      )}

      <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={StyleSheet.compose(styles.text, styles.formText)}>
        Please enter your wallet password:
      </TextV3.Description>
      <TextInput
        control={control}
        type="password"
        name="password"
        visiblePassword
        fullWidth
        inputRef={register}
        inputStyles={styles.input}
        inputContainerStyle={styles.inputWrapper}
      />
      <View>
        {isSeedWallet && (
          <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.formText} å>
            This wallet will be removed from Stargazer. You will need to provide the recovery seed phrase in order to
            restore it.
          </TextV3.Description>
        )}
        {!isSeedWallet && (
          <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} ç>
            This account will be removed from Stargazer. You will need to provide the private key in order to restore
            it.
          </TextV3.Description>
        )}
      </View>
      <View style={styles.actions}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.SMALL}
          title="Cancel"
          onPress={goBack}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.SMALL}
          title="Confirm"
          onPress={handleSubmit((data) => {
            onSubmit(data);
          })}
        />
      </View>
    </View>
  );
};

export default RemoveWallet;
