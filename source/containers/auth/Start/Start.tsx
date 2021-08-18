import React, { useState } from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Link from 'components/Link';
import { useForm } from 'react-hook-form';
import { useController } from 'hooks/index';
import LogoImage from 'assets/images/logo.svg';

import { schema } from './consts';
import styles from './Start.scss';
import { useLocation } from 'react-router';
import { IDAppState } from 'state/dapp/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import { browser } from 'webextension-polyfill-ts';
import clsx from 'clsx';

const Starter = () => {
  const controller = useController();
  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
  });
  const dapp: IDAppState = useSelector((state: RootState) => state.dapp);
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;
  const location = useLocation();
  const [isInvalid, setInvalid] = useState(false);
  const errorClass = clsx(styles.error, {
    [styles.confirm]: location.pathname.includes('confirm.html'),
  });

  const onSubmit = (data: any) => {
    controller.wallet.unLock(data.password).then(async (res) => {
      //console.log(dapp, origin, dapp[origin], res, location.pathname);
      if (res && location.pathname.includes('confirm.html') && dapp[origin]) {
        const background = await browser.runtime.getBackgroundPage();
        background.dispatchEvent(
          new CustomEvent('connectWallet', { detail: window.location.hash })
        );
        window.close();
      }
      setInvalid(!res);
    })
      .catch(() => {
        setInvalid(true);
      });
  };

  return (
    <div className={styles.home}>
      <h1 className="heading-1 full-width t-white t-quicksand tw-medium">
        Welcome to
        <br />
        Stargazer Wallet
      </h1>
      <img src={LogoImage} className={styles.logo} alt="Stargazer" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          type="password"
          name="password"
          visiblePassword
          fullWidth
          inputRef={register}
          placeholder="Please enter your password"
          variant={styles.password}
        />
        {errors.password ? (
          <span className={errorClass}>{errors.password.message}</span>
        ) : (
          isInvalid && (
            <span className={errorClass}>Error: Invalid password</span>
          )
        )}
        <Button type="submit" theme="secondary" variant={styles.unlock}>
          Unlock
        </Button>
      </form>
      {!location.pathname.includes('confirm.html') && (
        <Link color="secondary" to="/import">
          <div className={styles.textCenter}>Reset and restore from recovery seed phrase</div>
        </Link>
      )}
    </div>
  );
};

export default Starter;
