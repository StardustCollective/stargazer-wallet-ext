import React, { FC } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import SeedIcon from '@material-ui/icons/Description';
import PrivKeyIcon from '@material-ui/icons/VpnKey';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import IVaultState  from 'state/vault/types';
import { useController, useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { PHRASE_VIEW, PRIV_KEY_VIEW, REMOVE_WALLET_VIEW, WALLETS_VIEW } from '../routes';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../state/store';

interface IManageWalletView {
  id: string
}

const ManageWalletView: FC<IManageWalletView> = ({id}) => {
  const showView = useSettingsView();
  const controller = useController();
  const { handleSubmit, register } = useForm();
  const { wallets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const wallet = wallets.find(w => w.id === id);

  const onSubmit = (data: any) => {
    controller.wallet.account.updateWalletLabel(wallet, data.name);
    showView(WALLETS_VIEW);
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <TextInput
        name="name"
        visiblePassword
        fullWidth
        variant={styles.input}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
      <label>Backup Options</label>
      {wallet.type === KeyringWalletType.MultiChainWallet ? (
        <section className={styles.menu} onClick={() => showView(PHRASE_VIEW)}>
          <Icon Component={SeedIcon} />
          <span>Show Recovery Phrase</span>
          <ArrowIcon />
        </section>
      ) : (
        <section
          className={styles.menu}
          onClick={() => showView(PRIV_KEY_VIEW)}
        >
          <Icon Component={PrivKeyIcon} />
          <span>Export private key</span>
          <ArrowIcon />
        </section>
      )}

      <span>
        If you lose access to this wallet, your funds will be lost, unless you
        back up!
      </span>
      <section
        className={styles.menu}
        onClick={() => showView(REMOVE_WALLET_VIEW)}
      >
        <Icon Component={DeleteIcon} />
        <span>Delete Wallet</span>
        <ArrowIcon />
      </section>
      <section className={styles.actions}>
        <Button
          type="button"
          variant={clsx(styles.button, styles.cancel)}
          onClick={() => showView(WALLETS_VIEW)}
        >
          Cancel
        </Button>
        <Button type="submit" variant={clsx(styles.button, styles.save)}>
          Save
        </Button>
      </section>
    </form>
  );
};

export default ManageWalletView;
