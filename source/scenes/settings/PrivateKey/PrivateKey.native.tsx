import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';
import IPrivateKeySettings from './types';

const PrivateKey: FC<IPrivateKeySettings> = ({
  register,
  control,
  handleCopyPrivKey,
  onSubmit,
  handleSubmit,
  checked,
  isCopied,
  wallet,
  privKey,
}) => {
  const privKeyClass = StyleSheet.flatten([
    styles.privKey,
    isCopied ? styles.privKeyCopied : {},
    !checked ? styles.notAllowed : {},
  ]);

  const privKeyTextClass = StyleSheet.flatten([
    styles.privKeyText,
    isCopied ? styles.privKeyTextCopied : {},
  ]);
  return (
    <View style={styles.wrapper}>
      {wallet && (
        <>
          <View style={styles.heading}>
            <TextV3.Label
              color={COLORS_ENUMS.DARK_GRAY}
              extraStyles={styles.text}
              uppercase
            >
              Account name:
            </TextV3.Label>
            <View style={styles.accountNameWrapper}>
              <TextV3.Label
                color={COLORS_ENUMS.DARK_GRAY}
                extraStyles={styles.accountName}
              >
                {wallet.label}
              </TextV3.Label>
            </View>
          </View>
          <View style={styles.content}>
            <TextV3.Description
              color={COLORS_ENUMS.DARK_GRAY}
              extraStyles={styles.contentText}
            >
              Please input your wallet password and press enter:
            </TextV3.Description>
            <TextInput
              control={control}
              type="password"
              name="password"
              visiblePassword
              fullWidth
              inputRef={register}
              inputStyle={styles.input}
            />
            <View style={styles.buttonContainer}>
              <ButtonV3
                size={BUTTON_SIZES_ENUM.LARGE}
                type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
                title="Submit"
                onPress={handleSubmit((data) => onSubmit(data))}
              />
            </View>
            <TextV3.Description
              color={COLORS_ENUMS.DARK_GRAY}
              extraStyles={styles.contentText}
            >
              Click to copy your private key:
            </TextV3.Description>
            <TouchableOpacity onPress={handleCopyPrivKey}>
              <View style={privKeyClass}>
                <TextV3.Label
                  margin={false}
                  extraStyles={privKeyTextClass}
                  color={COLORS_ENUMS.DARK_GRAY}
                >
                  {privKey}
                </TextV3.Label>
              </View>
            </TouchableOpacity>
            <TextV3.Description color={COLORS_ENUMS.DARK_GRAY}>
              Warning: Keep your keys secret! Anyone with your private keys can steal your
              assets .
            </TextV3.Description>
          </View>
        </>
      )}
    </View>
  );
};

export default PrivateKey;
