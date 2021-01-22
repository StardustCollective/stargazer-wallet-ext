import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import Link from 'components/Link';
import { useForm } from 'react-hook-form';
import { useController } from 'hooks/index';
import LogoImage from 'assets/images/logo-m.png';

import { schema } from './consts';
import styles from './Start.scss';

const Starter = () => {
  const controller = useController();
  const { handleSubmit, register } = useForm({
    validationSchema: schema,
  });

  const onSubmit = async (data: any) => {
    await controller.wallet.unLock(data.password);
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
        <Button type="submit" theme="secondary" variant={styles.unlock}>
          Unlock
        </Button>
      </form>
      <Link color="secondary" to="/restore">
        Restore account?
      </Link>
      <span className="body-caption t-white">
        Import using account seed phrase
      </span>
    </div>
  );
};

export default Starter;
