import React, { FC } from 'react';
import { View } from 'react-native';

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
  address,
  handleAddressChange,
  onClickCancel,
}) => {
  const addressStyle = isValidAddress ? styles.inputVerfied : undefined;
  const verifiedStyle = hideStatusIcon ? styles.hide : styles.statusIcon;
  return (
    <View style={styles.wrapper}>
      <TextInput
        control={control}
        label="Contact Name"
        name="name"
        type="text"
        fullWidth
        inputContainerStyle={styles.input}
        defaultValue={selected && contacts[selected].name}
        inputRef={register}
        containerStyle={styles.inputWrapper}
      />
      <TextInput
        control={control}
        label="Address"
        name="address"
        type="text"
        fullWidth
        inputContainerStyle={styles.input}
        inputStyle={addressStyle}
        containerStyle={styles.inputWrapper}
        defaultValue={address}
        onChange={(text) => handleAddressChange({ nativeEvent: { text } })}
        inputRef={register}
        leftIcon={!hideStatusIcon && (
          <View style={verifiedStyle}>
            <VerifiedIcon height={15} width={15} lineHeight={0} />
          </View>
        )}
      />
      <TextInput
        control={control}
        label="Memo"
        name="memo"
        fullWidth
        multiline
        containerStyle={styles.textareaWrapper}
        inputContainerStyle={styles.textareaText}
        defaultValue={selected && contacts[selected].memo}
        inputRef={register}
      />
      <View style={styles.actions}>
        <ButtonV3
          title="Cancel"
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
          extraStyles={styles.cancel}
          extraTitleStyles={styles.cancelTitle}
          onPress={onClickCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          extraStyles={styles.save}
          disabled={disabled}
          title="Save"
          onPress={handleSubmit((data) => {
            onSubmit(data);
          })}
        />
      </View>
    </View>
  );
};

export default ModifyContact;
