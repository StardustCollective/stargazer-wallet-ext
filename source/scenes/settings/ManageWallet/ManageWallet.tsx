import React, { FC } from 'react';
import clsx from 'clsx';

import SeedIcon from '@material-ui/icons/Description';
import PrivKeyIcon from '@material-ui/icons/VpnKey';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import Icon from 'components/Icon';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

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
}) => {
  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <TextInput
        control={control}
        name="name"
        visiblePassword
        fullWidth
        variant={styles.input}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
      <label>Backup Options</label>
      {wallet.type === KeyringWalletType.MultiChainWallet ? (
        <section className={styles.menu} onClick={onShowRecoveryPhraseClicked}>
          <Icon Component={SeedIcon} />
          <span>Show Recovery Phrase</span>
          <ArrowIcon />
        </section>
      ) : wallet.type !== KeyringWalletType.LedgerAccountWallet ? (
        <section className={styles.menu} onClick={onShowPrivateKeyClicked}>
          <Icon Component={PrivKeyIcon} />
          <span>Export private key</span>
          <ArrowIcon />
        </section>
      ): null}

      <span>If you lose access to this wallet, your funds will be lost, unless you back up!</span>
      <section className={styles.menu} onClick={onDeleteWalletClicked}>
        <Icon Component={DeleteIcon} />
        <span>Delete Wallet</span>
        <ArrowIcon />
      </section>
      <section className={styles.actions}>
        <div className={styles.buttons}>
          <Button type="button" variant={clsx(styles.button, styles.cancel)} onClick={onCancelClicked}>
            Cancel
          </Button>
          <Button type="submit" variant={clsx(styles.button, styles.save)}>
            Save
          </Button>
        </div>
      </section>
    </form>
  );
};

export default ManageWallet;
