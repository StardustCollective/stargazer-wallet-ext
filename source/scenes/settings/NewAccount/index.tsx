import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SeedIcon from '@material-ui/icons/Description';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import TextInput from 'components/TextInput';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useController, useSettingsView } from 'hooks/index';
import NavigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';

import styles from './index.scss';
// import { MAIN_VIEW, PHRASE_VIEW } from '../routes';

interface INewAccountView {
  // onChange: (id: string) => void;
  navigation: any
}

const NewAccount: FC<INewAccountView> = ({ navigation }) => {
  const [accountName, setAccountName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState<string>('');
  const controller = useController();
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
    }),
  });;
  const linkTo = useLinkTo();

  const onSubmit = async (data: any) => {
    setLoading(true);
    const id = await controller.wallet.createWallet(data.name);
    setWalletId(id);
    // onChange(id);
    setLoading(false);
    setAccountName(data.name);
  };

  const onClickResetStack = () => {
    NavigationUtil.popToTop(navigation);
  }

  const onShowPhraseClick = () => {
    linkTo(`/settings/wallets/phrase?id=${walletId}`);
  }

  return (
    <div className={styles.newAccount}>
      {accountName ? (
        <>
          <span>{`Your new account ${accountName} has been created`}</span>
          <label>Backup Options</label>
          <section
            className={styles.menu}
            onClick={onShowPhraseClick}
          >
            <Icon Component={SeedIcon} />
            <span>Show Recovery Phrase</span>
            <ArrowIcon />
          </section>
          <span>
            If you lose access to this wallet, your funds will be lost, unless
            you back up!
          </span>
          <div className={clsx(styles.actions, styles.centered)}>
            <Button
              type="button"
              variant={styles.button}
              onClick={onClickResetStack}
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
              onClick={onClickResetStack}
            >
              Close
            </Button>
            <Button type="submit" variant={styles.button} loading={loading}>
              Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewAccount;
