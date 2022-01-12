//////////////////////
// Modules Imports
///////////////////// 

import React, { useState } from 'react';
import clsx from 'clsx';

//////////////////////
// Component Imports
///////////////////// 

import TextInput from 'components/TextInput';
import Link from 'components/Link';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

//////////////////////
// Hooks Imports
///////////////////// 

import { useForm } from 'react-hook-form';
import { useController } from 'hooks/index';

//////////////////////
// Constants
///////////////////// 

// Imports
import { schema } from './consts';

// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';

const LOGIN_FAILURE_COMMENT = 'Error: Invalid password';

//////////////////////
// Images Imports
///////////////////// 

import LogoImage from 'assets/images/logo.svg';

//////////////////////
// Styles Imports
///////////////////// 

import styles from './Login.scss';

////////////////////////
// Types
/////////////////////// 

type ILoginProps = {
  onLoginSuccess: (res: boolean) => void;
  onLoginError?: () => void;
  onImportClicked?: () => void;
}

//////////////////////
// Component
//////////////////////

const Login = ({
  onLoginSuccess,
  onLoginError,
  onImportClicked
}: ILoginProps) => {
  const { handleSubmit, register, errors} = useForm({
    validationSchema: schema,
  });
  const [isInvalid, setInvalid] = useState(false);
  const controller = useController();

  const errorClass = clsx(styles.error, {
    [styles.confirm]: location.pathname.includes('confirm.html'),
  });

  const onSubmit = (data: any) => {
    // An unlock response of  false means migration attempt failed but user is logged in
    controller.wallet.unLock(data.password).then(async (res: boolean) => {
      if (onLoginSuccess) {
        onLoginSuccess(res)
      }
      setInvalid(false);
    })
      .catch((err: any) => {
        console.log('err: ', err);
        if (onLoginError) {
          onLoginError();          
        }
        setInvalid(true);
      });
  };

  const importClicked = () => {
    if (onImportClicked) {
      onImportClicked();
    }
  }

  return (
    <div className={styles.home}>
      <TextV3.HeaderLarge
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        Welcome to Stargazer Wallet
      </TextV3.HeaderLarge>
      <img src={'/'+LogoImage} className={styles.logo} alt="Stargazer" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <TextInput
            id={'login-passwordField'}
            type="password"
            name="password"
            visiblePassword
            fullWidth
            inputRef={register}
            placeholder={PLEASE_ENTER_YOUR_PASSWORD_STRING}
            variant={styles.password}
          />
          <div id={'login-failure'} className={styles.errorWrapper}>
            {errors.passwordErrors && isInvalid}
              <span id={'login-error'} className={errorClass}>{LOGIN_FAILURE_COMMENT}</span>
          </div>
        </div>
        <ButtonV3
          id={'login-submitButton'}
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={UNLOCK_STRING}
          extraStyle={styles.started}
          submit
        />
      </form>
      {!location.pathname.includes('login') && (
        <Link extraStyles={styles.restoreFromSeedLink} color="monotoneOne" onClick={importClicked}>
          Reset and restore from recovery seed phrase
        </Link>
      )}
    </div>
  )
}

export default Login;