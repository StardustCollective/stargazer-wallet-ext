///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';

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

type ILoginProps = {
  onLoginSuccess: (res: boolean) => void;
  onLoginError?: () => void;
  onImportClicked?: () => void;
};

////////////////////////
// Container
///////////////////////

const LoginContainer: FC<ILoginProps> = ({ onLoginSuccess, onLoginError, onImportClicked }) => {
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: schema,
  });
  const [isInvalid, setInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    const walletController = getWalletController();
    // An unlock response of  false means migration attempt failed but user is logged in
    walletController
      .unLock(data.password)
      .then(async (res: boolean) => {
        if (onLoginSuccess) {
          onLoginSuccess(res);
        }
        setInvalid(false);
      })
      .catch(() => {
        if (onLoginError) {
          onLoginError();
        }
        setIsLoading(false);
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
      />
    </Container>
  );
};

export default LoginContainer;
