import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Link from 'components/Link';
import { useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useController } from 'hooks/index';
import LogoImage from 'assets/images/logo-m.png';
// import { RootState } from 'state/store';
// import IWalletState from 'state/wallet/types';
// import { loginUser } from 'state/account';

import { schema } from './consts';
import styles from './Start.scss';

const Starter = () => {
  // const history = useHistory();
  const controller = useController();
  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { password: string }) => {
    console.log('HELLO');
    await controller.wallet.unLock(data.password);
    // history.go(0);
  };

  return (
    <div className={styles.home}>
      <h1 className="heading-1 full-width t-white">
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
        <Button type="submit" theme="secondary" variant={styles.unlock}>
          Unlock
        </Button>
      </form>
      <Link color="secondary" to="/app.html">
        Restore account?
      </Link>
      <span className="body-caption t-white">
        Import using account seed phrase
      </span>
    </div>
  );
};

export default Starter;
