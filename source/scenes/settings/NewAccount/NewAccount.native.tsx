///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////////
// Component
///////////////////////////

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import INewAccountSettings from './types';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const NewAccount: FC<INewAccountSettings> = ({
  onClickResetStack,
  onSubmit,
  handleSubmit,
  register,
  control,
}) => {
  return (
    <View style={styles.newAccount}>
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
            onPress={handleSubmit((data) => onSubmit(data))}
          />
        </View>
      </View>
    </View>
  );
};

export default NewAccount;
