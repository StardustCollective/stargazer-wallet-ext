import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import Sheet from 'components/Sheet';
import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import Menu from 'components/Menu';
import { COLORS_ENUMS } from 'assets/styles/colors';
import CopyIcon from 'assets/images/svg/copy.svg';
import { ellipsis } from 'scenes/home/helpers';
import {
  DAG_NETWORK,
  ETH_NETWORK,
  AVALANCHE_NETWORK,
  BSC_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';
import styles from './ManageWallet.scss';
import IManageWalletSettings from './types';

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
  copyText,
  isCopied,
  dagAddress,
  ethAddress,
}) => {
  const [label, setLabel] = useState();
  const [isWalletAddressesOpen, setIsWalletAddressesOpen] = useState(false);
  const [itemCopied, setItemCopied] = useState('');
  const isButtonDisabled = label === wallet.label || label === '' || !label;
  const isHardwareWallet = [
    KeyringWalletType.BitfiAccountWallet,
    KeyringWalletType.LedgerAccountWallet,
  ].includes(wallet.type);

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
            rightIcon: !isCopied && <img src={`/${CopyIcon}`} alt="copy" />,
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
        <img src={`/${CopyIcon}`} alt="copy" />
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
        <img src={`/${CopyIcon}`} alt="copy" />
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
        <img src={`/${CopyIcon}`} alt="copy" />
      ),
      labelRight:
        isCopied && itemCopied === AVALANCHE_NETWORK['avalanche-mainnet'].network
          ? 'Copied!'
          : '',
      icon: AVALANCHE_NETWORK['avalanche-mainnet'].logo,
      showArrow: false,
      labelRightStyles: clsx(styles.copiedLabel),
    },
    {
      title: BSC_NETWORK.bsc.network,
      subtitle: ellipsis(ethAddress),
      onClick: () => handleCopy(BSC_NETWORK.bsc.network, ethAddress),
      rightIcon: (!isCopied || itemCopied !== BSC_NETWORK.bsc.network) && (
        <img src={`/${CopyIcon}`} alt="copy" />
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
        <img src={`/${CopyIcon}`} alt="copy" />
      ),
      labelRight:
        isCopied && itemCopied === POLYGON_NETWORK.matic.network ? 'Copied!' : '',
      icon: POLYGON_NETWORK.matic.logo,
      showArrow: false,
      labelRightStyles: styles.copiedLabel,
    },
  ];

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <label>Wallet</label>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        defaultValue={wallet.label}
        variant={styles.inputContainer}
        classes={{ input: styles.input }}
        inputRef={register({ required: true })}
        startAdornment={
          <div className={styles.inputLabel}>
            <TextV3.LabelSemiStrong
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.inputTitle}
            >
              Wallet Name
            </TextV3.LabelSemiStrong>
          </div>
        }
      />
      <Menu items={walletAddressesItems} containerStyle={styles.menuContainer} />
      {!isHardwareWallet && <Menu title="Backup Options" items={menuItems} />}
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

      <section className={styles.actions}>
        <div className={styles.buttons}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.GRAY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Cancel"
            extraStyle={clsx(styles.button, styles.cancel)}
            onClick={onCancelClicked}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Save"
            disabled={isButtonDisabled}
            extraStyle={clsx(styles.button, styles.save)}
            onClick={handleSubmit((data) => {
              onSubmit(data);
            })}
          />
        </div>
      </section>
      <Sheet
        isVisible={isWalletAddressesOpen}
        onClosePress={() => setIsWalletAddressesOpen(false)}
        height="70%"
        title={{
          label: wallet.label,
          align: 'left',
        }}
      >
        <Menu title="Wallet Addresses" items={walletAddresesContent} />
      </Sheet>
    </form>
  );
};

export default ManageWallet;
