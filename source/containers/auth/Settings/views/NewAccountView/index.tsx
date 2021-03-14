import React, { useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { useController, useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { MAIN_VIEW } from '../routes';

const NewAccountView = () => {
  const [accountName, setAccountName] = useState<string>();
  const controller = useController();
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
    }),
  });
  const showView = useSettingsView();

  const onSubmit = async (data: any) => {
    const res = await controller.wallet.account.addNewAccount(data.name);
    if (res) {
      setAccountName(data.name);
    }
  };

  return (
    <div className={styles.newAccount}>
      {accountName ? (
        <>
          <span>{`Your new account ${accountName} has been created`}</span>
          <div className={clsx(styles.actions, styles.centered)}>
            <Button
              type="button"
              variant={styles.button}
              onClick={() => showView(MAIN_VIEW)}
            >
              Finish
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <span>Please name your new account:</span>
          <TextInput
            type="text"
            name="name"
            fullWidth
            variant={styles.input}
            inputRef={register}
          />
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              onClick={() => showView(MAIN_VIEW)}
            >
              Close
            </Button>
            <Button type="submit" variant={styles.button}>
              Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewAccountView;
