import React, { FC } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import VerifiedIcon from 'assets/images/svg/check-green.svg';

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import IModifyContactSettings from './types';

const ModifyContact: FC<IModifyContactSettings> = ({
  control,
  handleSubmit,
  onSubmit,
  selected,
  hideStatusIcon,
  contacts,
  register,
  disabled,
  isValidAddress,
  handleAddressChange,
  onClickCancel,
}) => {
  const addressStyle = StyleSheet.flatten([styles.input, isValidAddress ? styles.verified : {}]);

  return (
    <View style={styles.wrapper}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK}>Contact Name</TextV3.Caption>
      <TextInput
        control={control}
        name="name"
        type="text"
        fullWidth
        inputContainerStyle={styles.input}
        defaultValue={selected && contacts[selected].name}
        inputRef={register}
      />
      <Text>Address</Text>
      <View style={styles.inputWrap}>
        <View style={styles.statusIcon}>
          <VerifiedIcon />
        </View>
        <TextInput
          control={control}
          name="address"
          type="text"
          fullWidth
          inputContainerStyle={addressStyle}
          defaultValue={address}
          onChange={handleAddressChange}
          value={address}
          inputRef={register}
        />
      </View>
      <Text>Memo</Text>
      <TextInput
        name="memo"
        fullWidth
        multiline
        variant={styles.textareaText}
        defaultValue={selected && contacts[selected].memo}
        inputRef={register}
      />
      <View style={styles.actions}>
        <ButtonV3 
          title="Cancel" 
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE } 
          extraStyle={styles.cancel} 
          onPress={onClickCancel}/>
        <ButtonV3 
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE} 
          extraStyle={styles.save} 
          disabled={disabled} 
          title="Submit" 
          onPress={handleSubmit(data => onSubmit(data)}/>
      </View>
    </View>
  );
};

export default ModifyContact;
