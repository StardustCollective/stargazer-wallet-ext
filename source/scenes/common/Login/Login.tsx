//////////////////////
// Modules Imports
/////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

//////////////////////
// Component Imports
/////////////////////

import TextInput from 'components/TextInput';
import Link from 'components/Link';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import { getSgw, setSgw } from 'utils/keyring';

// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';
const LOGIN_ERROR_STRING = 'Error: Invalid password';

//////////////////////
// Images Imports
/////////////////////

import LogoImage from 'assets/images/logo.svg';

//////////////////////
// Styles Imports
/////////////////////

import styles from './styles.scss';

//////////////////////
// Types
//////////////////////

import ILogin from './types';

//////////////////////
// Component
//////////////////////

const Login: FC<ILogin> = ({
  importClicked,
  handleSubmit,
  onSubmit,
  errors,
  register,
  isInvalid,
  isLoading,
}) => {
  const errorClass = clsx(styles.error, {
    [styles.confirm]: location.pathname.includes('confirm.html'),
  });

  const storeSgw = async (value: string): Promise<void> => {
    const storedValue = await getSgw();

    // Value already stored
    if (storedValue) return;

    await setSgw(value);
  };

  return (
    <div className={styles.home}>
      <TextV3.HeaderLargeRegular
        align={TEXT_ALIGN_ENUM.CENTER}
        extraStyles={styles.title}
      >
        Welcome to <TextV3.HeaderLarge>Stargazer Wallet</TextV3.HeaderLarge>
      </TextV3.HeaderLargeRegular>
      <img src={'/' + LogoImage} className={styles.logo} alt="Stargazer" />
      <form onSubmit={handleSubmit((data: any) => onSubmit(data, false, storeSgw))}>
        <div className={styles.inputWrapper}>
          <TextInput
            id={'login-passwordField'}
            type="password"
            name="password"
            visiblePassword
            fullWidth
            inputRef={register}
            placeholder={PLEASE_ENTER_YOUR_PASSWORD_STRING}
          />
          <div id={'login-failure'} className={styles.errorWrapper}>
            {errors.password ? (
              <span className={errorClass}>{errors.password.message}</span>
            ) : (
              isInvalid && <span className={errorClass}>{LOGIN_ERROR_STRING}</span>
            )}
          </div>
        </div>
        <ButtonV3
          id={'login-submitButton'}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={UNLOCK_STRING}
          loading={isLoading}
          extraStyle={styles.started}
          submit
        />
      </form>
      {!location.pathname.includes('login') && (
        <div className={styles.recoverContainer}>
          <Link
            extraStyles={styles.restoreFromSeedLink}
            color="monotoneOne"
            onClick={importClicked}
          >
            Recover from seed phrase
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
