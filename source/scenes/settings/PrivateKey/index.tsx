import React, { useState, FC } from 'react';
import clsx from 'clsx';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import TextInput from 'components/TextInput';
import { useController, useCopyClipboard } from 'hooks/index';

import styles from './index.scss';
import { useSelector } from 'react-redux';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import WalletSelectors from 'selectors/walletsSelectors';
interface IPrivateKeyView {
  route: any;
}

const PrivateKey: FC<IPrivateKeyView> = ({ route }) => {
  const controller = useController();
  const alert = useAlert();
  const id = route.params.id;
  const wallets: KeyringWalletState[]  = useSelector(WalletSelectors.selectAllWallets);
  const wallet = wallets.find(w => w.id === id);
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const [isCopied, copyText] = useCopyClipboard();
  const [checked, setChecked] = useState(false);
  const [privKey, setPrivKey] = useState<string>(
    '*************************************************************'
  );

  const privKeyClass = clsx(styles.privKey, {
    [styles.copied]: isCopied,
    [styles.notAllowed]: !checked,
  });

  const onSubmit = async (data: any) => {
    const res = await controller.wallet.getPrivateKey(id, data.password);
    if (res) {
      setPrivKey(res);
      setChecked(true);
    } else {
      alert.removeAll();
      alert.error('Error: Invalid password');
    }
  };

  const handleCopyPrivKey = () => {
    if (!checked) return;
    copyText(privKey);
  };

  return (
    <div className={styles.wrapper}>
      {wallet && (
        <>
          <div className={styles.heading}>
            <div>Account name:</div>
            <span className={styles.accountName}>{wallet.label}</span>
          </div>
          <div className={styles.content}>
            <span>Please input your wallet password and press enter:</span>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                type="password"
                name="password"
                visiblePassword
                fullWidth
                inputRef={register}
                variant={styles.input}
              />
            </form>
            <span>Click to copy your private key:</span>
            <div className={privKeyClass} onClick={handleCopyPrivKey}>
              {privKey}
            </div>
            <span>
              Warning: Keep your keys secret! Anyone with your private keys can
              steal your assets .
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateKey;
