import React, { FC, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { ellipsis } from 'scenes/home/helpers';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import Menu from 'components/Menu';
import CopyIcon from 'assets/images/svg/copy.svg';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import IManageWalletSettings from './types';
import styles from './styles';

const ManageWallet: FC<IManageWalletSettings> = ({
  handleSubmit,
  register,
  control,
  wallet,
  onSubmit,
  onCancelClicked,
  onShowRecoveryPhraseClicked,
  onDeleteWalletClicked,
  onShowPrivateKeyClicked,
  watch,
  isCopied,
  copyText,
}) => {
  const cancelButtonStyles = StyleSheet.flatten([styles.button, styles.cancel]);
  const submitButtonStyles = StyleSheet.flatten([styles.button]);
  const [label, setLabel] = useState();
  const isButtonDisabled = label === wallet.label;

  useEffect(() => {
    if (watch('name')) {
      setLabel(watch('name'));
    }
  }, [watch('name')]);

  const menuItems =
    wallet.type === KeyringWalletType.MultiChainWallet
      ? [
          {
            title: 'Show Recovery Phrase',
            onClick: onShowRecoveryPhraseClicked,
          },
          {
            title: 'Show Private Key',
            onClick: onShowPrivateKeyClicked,
          },
        ]
      : [
          {
            title: 'Show Private Key',
            onClick: onShowPrivateKeyClicked,
          },
        ];

  const walletAddressesItems =
    wallet.type === KeyringWalletType.MultiChainWallet
      ? [
          {
            title: 'Wallet Addresses',
            onClick: () => console.log('test'),
            labelRight: 5,
          },
        ]
      : [
          {
            title: ellipsis(wallet.accounts[0].address, 17, 6),
            titleStyles: styles.titleAddress,
            onClick: () => copyText(wallet.accounts[0].address),
            showArrow: false,
            rightIcon: <CopyIcon height={20} width={20} />,
          },
        ];

  return (
    <View style={styles.wrapper}>
      <TextV3.Caption extraStyles={styles.label}>Wallet</TextV3.Caption>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        inputContainerStyle={styles.inputContainer}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
      <Menu items={walletAddressesItems} containerStyle={styles.menuContainer} />
      <Menu
        title="Backup Options"
        items={menuItems}
        containerStyle={styles.menuContainer}
      />

      <Menu
        items={[
          {
            title: 'Remove Wallet',
            onClick: onDeleteWalletClicked,
            titleStyles: styles.removeText,
          },
        ]}
      />
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
            disabled={isButtonDisabled}
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
