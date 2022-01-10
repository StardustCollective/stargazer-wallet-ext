import React, { FC } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useController } from 'hooks/index';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import navigationUtil from 'navigation/util';
import WalletSelectors from 'selectors/walletsSelectors';

import styles from './index.scss';
import { KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';

interface IRemoveWalletView {
  route: any;
  navigation: any;
}

const RemoveWallet: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const controller = useController();
  const alert = useAlert();
  const history = useHistory();
  const id = route.params.id;

  const wallets: KeyringWalletState[]  = useSelector(WalletSelectors.selectAllWallets);
  const wallet = wallets.find((w) => w.id === id);
  const isSeedWallet = wallet && (wallet.type === KeyringWalletType.MultiChainWallet);

  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    let isChecked;
    if(wallet.type === KeyringWalletType.LedgerAccountWallet){
      isChecked = await controller.wallet.deleteLedgerWallet(id, data.password);
    }else{
      isChecked = await controller.wallet.deleteWallet(id, data.password);
    }
    if (isChecked) {
      if (wallets.length === 1) {
        controller.wallet.logOut();
      }
      else {
        navigationUtil.popToTop(navigation);
      }
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
            Cancel
          </Button>
          <Button type="submit" variant={styles.button}>
            Confirm
          </Button>
        </div>
        <span>
          {isSeedWallet && (
          <span>
            This wallet will be removed from Stargazer. You will need to provide the
            recovery seed phrase in order to restore it.
          </span>)}
          {!isSeedWallet && (
            <span>
            This account will be removed from Stargazer. You will need to provide the
            private key in order to restore it.
          </span>)}
        </span>
      </form>
    </div>
  );
};

export default RemoveWallet;
