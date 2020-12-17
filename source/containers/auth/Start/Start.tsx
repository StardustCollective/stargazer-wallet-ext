import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Link from 'components/Link';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LogoImage from 'assets/images/logo-m.png';
import { RootState } from 'state/store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { loginUser } from 'state/account';

import { schema } from './consts';
import styles from './Start.scss';

const Starter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { password } = useSelector((state: RootState) => state.auth);
  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    if (password === data.password) {
      //  dispatch(loginUser());
    }
    history.push('/home');
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
