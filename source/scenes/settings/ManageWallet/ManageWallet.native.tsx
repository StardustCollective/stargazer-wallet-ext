import React, { FC, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ellipsis } from 'scenes/home/helpers';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Sheet from 'components/Sheet';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import Menu from 'components/Menu';
import CopyIcon from 'assets/images/svg/copy.svg';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  DAG_NETWORK,
  ETH_NETWORK,
  AVALANCHE_NETWORK,
  BSC_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';
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
  dagAddress,
  ethAddress,
}) => {
  const [isWalletAddressesOpen, setIsWalletAddressesOpen] = useState(false);
  const [itemCopied, setItemCopied] = useState('');
  const [label, setLabel] = useState();
  const isButtonDisabled = label === wallet.label || label === '' || !label;

  useEffect(() => {
    setLabel(watch('name'));
  }, [watch('name')]);

  const handleCopy = (id: string, text: string) => {
    setItemCopied(id);
    copyText(text);
  };

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
            onClick: () => setIsWalletAddressesOpen(true),
            labelRight: '5',
          },
        ]
      : [
          {
            title: ellipsis(wallet.accounts[0].address, 17, 6),
            titleStyles: styles.titleAddress,
            onClick: () => copyText(wallet.accounts[0].address),
            showArrow: false,
            rightIcon: !isCopied && <CopyIcon height={20} width={30} />,
            labelRight: isCopied ? 'Copied!' : '',
            labelRightStyles: styles.copiedLabel,
          },
        ];

  const walletAddresesContent = [
    {
      title: DAG_NETWORK.main2.network,
      subtitle: ellipsis(dagAddress),
      onClick: () => handleCopy(DAG_NETWORK.main2.network, dagAddress),
      rightIcon: (!isCopied || itemCopied !== DAG_NETWORK.main2.network) && (
        <CopyIcon height={20} width={30} />
      ),
      labelRight: isCopied && itemCopied === DAG_NETWORK.main2.network ? 'Copied!' : '',
      icon: DAG_NETWORK.main2.logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
    {
      title: ETH_NETWORK.mainnet.network,
      subtitle: ellipsis(ethAddress),
      onClick: () => handleCopy(ETH_NETWORK.mainnet.network, ethAddress),
      rightIcon: (!isCopied || itemCopied !== ETH_NETWORK.mainnet.network) && (
        <CopyIcon height={20} width={30} />
      ),
      labelRight: isCopied && itemCopied === ETH_NETWORK.mainnet.network ? 'Copied!' : '',
      icon: ETH_NETWORK.mainnet.logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
    {
      title: AVALANCHE_NETWORK['avalanche-mainnet'].network,
      subtitle: ellipsis(ethAddress),
      onClick: () =>
        handleCopy(AVALANCHE_NETWORK['avalanche-mainnet'].network, ethAddress),
      rightIcon: (!isCopied ||
        itemCopied !== AVALANCHE_NETWORK['avalanche-mainnet'].network) && (
        <CopyIcon height={20} width={30} />
      ),
      labelRight:
        isCopied && itemCopied === AVALANCHE_NETWORK['avalanche-mainnet'].network
          ? 'Copied!'
          : '',
      icon: AVALANCHE_NETWORK['avalanche-mainnet'].logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
    {
      title: BSC_NETWORK.bsc.network,
      subtitle: ellipsis(ethAddress),
      onClick: () => handleCopy(BSC_NETWORK.bsc.network, ethAddress),
      rightIcon: (!isCopied || itemCopied !== BSC_NETWORK.bsc.network) && (
        <CopyIcon height={20} width={30} />
      ),
      labelRight: isCopied && itemCopied === BSC_NETWORK.bsc.network ? 'Copied!' : '',
      icon: BSC_NETWORK.bsc.logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
    {
      title: POLYGON_NETWORK.matic.network,
      subtitle: ellipsis(ethAddress),
      onClick: () => handleCopy(POLYGON_NETWORK.matic.network, ethAddress),
      rightIcon: (!isCopied || itemCopied !== POLYGON_NETWORK.matic.network) && (
        <CopyIcon height={20} width={30} />
      ),
      labelRight:
        isCopied && itemCopied === POLYGON_NETWORK.matic.network ? 'Copied!' : '',
      icon: POLYGON_NETWORK.matic.logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <TextV3.Caption extraStyles={styles.label}>Wallet</TextV3.Caption>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
        leftIcon={
          <TextV3.LabelSemiStrong
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.inputLabel}
          >
            Wallet Name
          </TextV3.LabelSemiStrong>
        }
      />
      <Menu items={walletAddressesItems} containerStyle={styles.addressesContainer} />
      <Menu title="Backup Options" items={menuItems} />

      <Menu
        containerStyle={styles.removeWalletContainer}
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
            type={BUTTON_TYPES_ENUM.GRAY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Cancel"
            extraStyles={styles.cancel}
            extraContainerStyles={styles.buttonContainer}
            onPress={onCancelClicked}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Save"
            extraContainerStyles={styles.buttonContainer}
            disabled={isButtonDisabled}
            submit
            extraStyles={styles.save}
            onPress={handleSubmit((data) => {
              onSubmit(data);
            })}
          />
        </View>
      </View>
      <Sheet
        isVisible={isWalletAddressesOpen}
        onClosePress={() => setIsWalletAddressesOpen(false)}
        height={520}
        title={{
          label: wallet.label,
          align: 'left',
        }}
      >
        <Menu title="Wallet Addresses" items={walletAddresesContent} />
      </Sheet>
    </ScrollView>
  );
};

export default ManageWallet;
