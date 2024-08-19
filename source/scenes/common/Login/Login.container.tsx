///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

//////////////////////
// Hooks Imports
/////////////////////

import { useForm } from 'react-hook-form';

//////////////////////
// Controllers
/////////////////////

import { getWalletController } from 'utils/controllersUtils';
import { isNative } from 'utils/envUtil';

////////////////////////
// Scene
///////////////////////

import Login from './Login';

//////////////////////
// Constants
/////////////////////

import { schema } from './consts';

////////////////////////
// Types
///////////////////////

import { RootState } from 'state/store';
type ILoginProps = {
  onLoginSuccess: (res: boolean) => void;
  onLoginError?: () => void;
  onImportClicked?: () => void;
};

////////////////////////
// Container
///////////////////////

const LoginContainer: FC<ILoginProps> = ({
  onLoginSuccess,
  onLoginError,
  onImportClicked,
}) => {
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: schema,
  });
  const [isInvalid, setInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bioLoginLoading, setBioLoginLoading] = useState(false);
  const { available } = useSelector((state: RootState) => state.biometrics);

  const onSubmit = (
    data: any,
    bioLogin: boolean = false,
    callback: (password: string) => void = null
  ) => {
    if (bioLogin) {
      setBioLoginLoading(true);
    } else {
      setIsLoading(true);
    }
    const walletController = getWalletController();
    // An unlock response of  false means migration attempt failed but user is logged in
    walletController
      .unLock(data.password)
      .then(async (res: boolean) => {
        setBioLoginLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(res);
        }

        if (res && callback) {
          if (!isNative) {
            await callback(data.password);
          }
          if (isNative && available) {
            await callback(data.password);
          }
        }
        setInvalid(false);
      })
      .catch(() => {
        if (onLoginError) {
          onLoginError();
        }
        setIsLoading(false);
        setBioLoginLoading(false);
        setInvalid(true);
      });
  };

  const importClicked = () => {
    if (onImportClicked) {
      onImportClicked();
    }
  };

  return (
    <Container>
      <Login
        control={control}
        importClicked={importClicked}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        register={register}
        isInvalid={isInvalid}
        isLoading={isLoading}
        bioLoginLoading={bioLoginLoading}
      />
    </Container>
  );
};

export default LoginContainer;
