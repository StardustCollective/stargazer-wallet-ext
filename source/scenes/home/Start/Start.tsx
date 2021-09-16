//////////////////////
// Modules Imports
///////////////////// 

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { browser } from 'webextension-polyfill-ts';
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
// Images Imports
///////////////////// 

import LogoImage from 'assets/images/logo.svg';

//////////////////////
// Navigation
///////////////////// 

import { useLinkTo, useNavigation } from '@react-navigation/native';
import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';

//////////////////////
// State Imports
///////////////////// 

import { IDAppState } from 'state/dapp/types';
import { RootState } from 'state/store';

//////////////////////
// Styles Imports
///////////////////// 

import styles from './Start.scss';

//////////////////////
// Constants
///////////////////// 

// Imports
import { schema } from './consts';
// Strings
const UNLOCK_STRING = 'Unlock';
const PLEASE_ENTER_YOUR_PASSWORD_STRING = 'Please enter your password';

//////////////////////
// Component
///////////////////// 

const Starter = () => {

  //////////////////////
  // Hooks
  ///////////////////// 

  const linkTo = useLinkTo();
  const navigation = useNavigation();
  const controller = useController();
  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
  });
  const dapp: IDAppState = useSelector((state: RootState) => state.dapp);
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;
  const [isInvalid, setInvalid] = useState(false);
  const errorClass = clsx(styles.error, {
    [styles.confirm]: location.pathname.includes('confirm.html'),
  });

  //////////////////////
  // Callbacks
  ///////////////////// 

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
      navigationUtil.replace(navigation, screens.authorized.root);
      setInvalid(!res);

    })
      .catch(() => {
        setInvalid(true);
      });
  };

  const onImportClicked = () => {
    linkTo('/import')
  }

  //////////////////////
  // Renders
  ///////////////////// 

  return (
    <div className={styles.home}>
      <TextV3.HeaderLarge
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        Welcome to Stargazer Wallet
      </TextV3.HeaderLarge>
      <img src={LogoImage} className={styles.logo} alt="Stargazer" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <TextInput
            type="password"
            name="password"
            visiblePassword
            fullWidth
            inputRef={register}
            placeholder={PLEASE_ENTER_YOUR_PASSWORD_STRING}
            variant={styles.password}
          />
          <div className={styles.errorWrapper}>
          {errors.password ? (
            <span className={errorClass}>{errors.password.message}</span>
          ) : (
            isInvalid && (
              <span className={errorClass}>Error: Invalid password</span>
            )
          )}
          </div>
        </div>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={UNLOCK_STRING}
          extraStyle={styles.started}
          submit
        />
      </form>
      {!location.pathname.includes('confirm.html') && (
        <Link extraStyles={styles.restoreFromSeedLink} color="monotoneOne" onClick={onImportClicked}>
          Reset and restore from recovery seed phrase
        </Link>
      )}
    </div>
  );
};

export default Starter;
