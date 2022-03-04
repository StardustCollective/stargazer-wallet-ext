import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

import PrivKeyIcon from '@material-ui/icons/VpnKey';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';

import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import IManageWalletSettings from './types';

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from '../../../assets/styles/_variables.native';

const ManageWallet: FC<IManageWalletSettings> = ({
  walletId,
  handleSubmit,
  register,
  control,
  wallets,
  wallet,
  onSubmit,
  onCancelClicked,
  onShowRecoveryPhraseClicked,
  onDeleteWalletClicked,
  onShowPrivateKeyClicked,
}) => {
  const cancelButtonStyles = StyleSheet.flatten([styles.button, styles.cancel]);
  const submitButtonStyles = StyleSheet.flatten([styles.button]);
  return (
    <View style={styles.wrapper}>
      <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        Name
      </TextV3.Caption>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
      <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        Backup Options
      </TextV3.Caption>
      {wallet.type !== KeyringWalletType.MultiChainWallet ? (
        <TouchableOpacity onPress={onShowRecoveryPhraseClicked}>
          <View style={styles.menu}>
            <Icon
              type="material"
              name="description"
              iconStyles={styles.icon}
              iconContainerStyles={{ marginLeft: 12 }}
            />
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
              Show Recovery Phrase
            </TextV3.Caption>
            <Icon type="font_awesome" name="chevron-right" iconContainerStyles={styles.iconWrapper} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onShowPrivateKeyClicked}>
          <View style={styles.menu}>
            <Icon name="lock" type="material" iconStyles={styles.icon} iconContainerStyles={{ marginLeft: 12 }} />
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
              Export private key
            </TextV3.Caption>
            <Icon type="font_awesome" name="chevron-right" iconContainerStyles={styles.iconWrapper} />
          </View>
        </TouchableOpacity>
      )}
      <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.text}>
        If you lose access to this wallet, your funds will be lost, unless you back up!
      </TextV3.Body>
      <TouchableOpacity onPress={onDeleteWalletClicked}>
        <View style={styles.menu}>
          <Icon name="delete" type="font_awesome" iconStyles={styles.icon} iconContainerStyles={{ marginLeft: 12 }} />
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.menuText}>
            Delete Wallet
          </TextV3.Body>
          <Icon type="font_awesome" name="chevron-right" iconContainerStyles={styles.iconWrapper} />
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <View style={styles.buttons}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Cancel"
            extraStyles={cancelButtonStyles}
            extraTitleStyles={styles.buttonCancelText}
            onPress={onCancelClicked}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Save"
            submit
            extraStyles={submitButtonStyles}
            onPress={handleSubmit((data) => {
              onSubmit(data);
            })}
          />
        </View>
      </View>
    </View>
  );
};

export default ManageWallet;
