import React, { ChangeEvent, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from 'containers/common/Header';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import CloseIcon from 'assets/images/svg/close.svg';
import VerifiedIcon from 'assets/images/svg/check-green.svg';

import styles from './Send.scss';
import { useController } from 'hooks/index';

const WalletSend = () => {
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      address: yup.string().required(),
      amount: yup.number().required(),
      fee: yup.number(),
    }),
  });
  const history = useHistory();
  const controller = useController();
  const account = controller.wallet.account.currentAccount();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const isValidAddress = useMemo(() => {
    return controller.wallet.account.isValidDAGAddress(address);
  }, [address]);

  const addressInputClass = clsx(styles.input, styles.address, {
    [styles.verified]: isValidAddress,
  });
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !isValidAddress,
  });

  const handleAddressOption = () => {
    if (address) setAddress('');
  };

  const onSubmit = (data: any) => {
    if (!isValidAddress) return;
    controller.wallet.account.updateTempTx({
      fromAddress: account?.address || '',
      toAddress: data.address,
      amount: data.amount,
      fee: data.fee,
    });
    history.push('/send/confirm');
  };

  const handleAmountChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAmount(ev.target.value);
    },
    []
  );

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress(ev.target.value);
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.heading}>
          <span className={styles.title}>Send DAG</span>
          <span className={styles.label}>Address:</span>
          <div className={styles.inputWrapper}>
            <img src={VerifiedIcon} alt="checked" className={statusIconClass} />
            <TextInput
              placeholder="Enter a valid DAG address"
              fullWidth
              value={address}
              name="address"
              inputRef={register}
              onChange={handleAddressChange}
              variant={addressInputClass}
            />
            <Button
              type="button"
              variant={styles.qrcode}
              onClick={handleAddressOption}
            >
              {address ? (
                <img src={CloseIcon} alt="close" />
              ) : (
                <img src={QRCodeIcon} alt="qr-code" />
              )}
            </Button>
          </div>
        </section>
        <section className={styles.content}>
          <span className={clsx(styles.label, styles.balance)}>
            Amount:
            <small>Balance: {account?.balance || 0} DAG</small>
          </span>
          <div className={styles.inputWrapper}>
            <TextInput
              type="number"
              placeholder="Enter amount to send"
              fullWidth
              inputRef={register}
              name="amount"
              value={amount}
              onChange={handleAmountChange}
              variant={clsx(styles.input, styles.amount)}
            />
            <Button
              type="button"
              variant={styles.max}
              onClick={() => setAmount(String(account?.balance || 0))}
            >
              Max
            </Button>
          </div>
          <span className={styles.label}>Transaction Fee:</span>
          <TextInput
            type="number"
            placeholder="Enter $DAG transaction fee"
            fullWidth
            inputRef={register}
            name="fee"
            variant={styles.input}
          />
          <div className={styles.description}>
            Due to current network conditions we recommend a fee of 0 DAG.
          </div>
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              linkTo="/home"
            >
              Close
            </Button>
            <Button type="submit" variant={styles.button}>
              Send
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default WalletSend;
