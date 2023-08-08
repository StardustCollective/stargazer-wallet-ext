import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import Menu from 'components/Menu';
import IManageWalletSettings from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import CopyIcon from 'assets/images/svg/copy.svg';
import { ellipsis } from 'scenes/home/helpers';
import styles from './ManageWallet.scss';

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
}) => {
  const [label, setLabel] = useState();
  const isButtonDisabled = label === wallet.label || label === '' || !label;
  const isHardwareWallet = [
    KeyringWalletType.BitfiAccountWallet,
    KeyringWalletType.LedgerAccountWallet,
  ].includes(wallet.type);

  useEffect(() => {
    setLabel(watch('name'));
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
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Cancel"
            extraStyle={clsx(styles.button, styles.cancel)}
            onClick={onCancelClicked}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
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
    </form>
  );
};

export default ManageWallet;
