import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import Menu from 'components/Menu';
import IManageWalletSettings from './types';
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
}) => {
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

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
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
