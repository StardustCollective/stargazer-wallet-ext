import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import TextInput from 'components/TextInput';
import Icon from 'components/Icon';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import INewAccountSettings from './types';

const NewAccount: FC<INewAccountSettings> = ({
  onClickResetStack,
  onShowPhraseClick,
  onSubmit,
  handleSubmit,
  register,
  control,
  accountName,
  loading,
}) => {
  return (
    <View style={styles.newAccount}>
      {accountName ? (
        <>
          <TextV3.Description
            color={COLORS_ENUMS.DARK_GRAY}
          >{`Your new account ${accountName} has been created`}</TextV3.Description>
          <TextV3.Label uppercase color={COLORS_ENUMS.DARK_GRAY}>
            Backup Options
          </TextV3.Label>
          <TouchableOpacity onPress={onShowPhraseClick}>
            <View testID="newAccount-showRecoveryPhrase" style={styles.menu}>
              <View style={styles.menuSectionWrapper}>
                <Icon name="description" fontType="material" />
                <TextV3.Description color={COLORS_ENUMS.DARK_GRAY} extraStyles={styles.menuText}>
                  Show Recovery Phrase
                </TextV3.Description>
              </View>
              <Icon type="font_awesome" name="chevron-right" iconContainerStyles={styles.iconWrapper} />
            </View>
          </TouchableOpacity>
          <TextV3.Description color={COLORS_ENUMS.DARK_GRAY}>
            If you lose access to this wallet, your funds will be lost, unless you back up!
          </TextV3.Description>
          <View style={StyleSheet.compose(styles.actions, styles.centered)}>
            <ButtonV3
              size={BUTTON_SIZES_ENUM.LARGE}
              type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
              title="Finish"
              testID="addWallet-finishButton"
              extraStyles={styles.button}
              onPress={onClickResetStack}
            />
          </View>
        </>
      ) : (
        <View style={styles.newAccountSubWrapper}>
          <TextV3.Label id="newAccount-nameAccountText" color={COLORS_ENUMS.DARK_GRAY}>
            Please name your new account:
          </TextV3.Label>
          <TextInput
            control={control}
            id="newAccount-accountNameInput"
            type="text"
            name="name"
            fullWidth
            inputContainerStyles={styles.inputWrapper}
            inputStyles={styles.input}
            inputRef={register}
          />
          <View style={styles.actions}>
            <ButtonV3
              title="Close"
              testID="newAccount-cancelButton"
              size={BUTTON_SIZES_ENUM.LARGE}
              type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
              extraStyles={styles.button}
              onPress={onClickResetStack}
            />
            <ButtonV3
              title="Next"
              testID="newAccount-confirmButton"
              size={BUTTON_SIZES_ENUM.LARGE}
              type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
              extraStyles={styles.button}
              loading={loading}
              onPress={handleSubmit((data) => onSubmit(data))}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default NewAccount;
