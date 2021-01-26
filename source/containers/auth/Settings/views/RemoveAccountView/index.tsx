import React, { FC } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ellipsis } from 'containers/auth/helpers';
import { useController, useSettingsView } from 'hooks/index';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import IWalletState from 'state/wallet/types';
import { RootState } from 'state/store';

import styles from './index.scss';
import { MAIN_VIEW } from '../routes';

interface IRemoveAccountView {
  index: number;
}

const RemoveAccountView: FC<IRemoveAccountView> = ({ index }) => {
  const controller = useController();
  const showView = useSettingsView();

  const { accounts }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = (data: any) => {
    if (controller.wallet.account.unsubscribeAccount(index, data.password))
      showView(MAIN_VIEW);
  };

  return (
    <div className={styles.removeAccount}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {accounts[index] && (
          <div className={styles.subheading}>
            <div>{accounts[index].label}:</div>
            <span className={styles.address}>
              {ellipsis(accounts[index].address)}
            </span>
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
          >
            Close
          </Button>
          <Button
            type="submit"
            variant={styles.button}
            disabled={Object.keys(accounts).length <= 1}
          >
            Done
          </Button>
        </div>
        <span>
          This account will be removed from your wallet. Please make sure you
          have the private key for this account before continuing. You can
          restore this account with the ‘Create new account option’.
        </span>
      </form>
    </div>
  );
};

export default RemoveAccountView;
