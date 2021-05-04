import React, { FC } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useController, useSettingsView } from 'hooks/index';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import IVaultState from 'state/vault/types';
import { RootState } from 'state/store';

import styles from './index.scss';
import { MAIN_VIEW } from '../routes';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

interface IRemoveWalletView {
  id: string;
}

const RemoveWalletView: FC<IRemoveWalletView> = ({ id }) => {
  const controller = useController();
  const showView = useSettingsView();
  const alert = useAlert();
  const history = useHistory();

  const { wallets }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const wallet = wallets.find(w => w.id === id);
  const disabled = wallet.type === KeyringWalletType.MultiChainWallet &&
    wallets.filter(w => w.type === KeyringWalletType.MultiChainWallet).length < 2;

  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = (data: any) => {
    let isChecked;
    isChecked = controller.wallet.deleteWallet(id, data.password);
    if (isChecked) {
      showView(MAIN_VIEW);
    } else {
      alert.removeAll();
      alert.error('Error: Invalid password');
    }
  };

  return (
    <div className={styles.removeAccount}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {wallet && (
          <div className={styles.subheading}>
            <div>Account name:</div>
            <span className={styles.accountName}>{wallet.label}</span>
          </div>
        )}

        <span>Please enter your wallet password:</span>
        <TextInput
          type="password"
          name="password"
          visiblePassword
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            onClick={() => history.goBack()}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant={styles.button}
            disabled={disabled}
          >
            Done
          </Button>
        </div>
        <span>
          This account will be hidden from your wallet. You can show this
          account again by clicking "Create account" from Settings.
        </span>
      </form>
    </div>
  );
};

export default RemoveWalletView;
