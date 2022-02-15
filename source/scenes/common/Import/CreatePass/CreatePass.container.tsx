///////////////////////////
// Modules  
///////////////////////////

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

///////////////////////////
// Controllers
///////////////////////////

import WalletController from 'scripts/Background/controllers/WalletController';

///////////////////////////
// Components  
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Scene  
//////////////////////////

import CreatePass from './CreatePass';

///////////////////////////
// Navigation  
//////////////////////////

import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';

///////////////////////////
// Contants  
//////////////////////////

import * as consts from './../consts';

///////////////////////////
// Container  
//////////////////////////

const CreatePassContainer = () => {

  ///////////////////////////
  // Hooks  
  //////////////////////////

  const navigation = useNavigation();
  const [passed, setPassed] = useState(false);
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: consts.schema,
  });
  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed
    ? consts.CREATE_PASS_COMMENT2
    : consts.CREATE_PASS_COMMENT1;

  ///////////////////////////
  // Callbacks  
  //////////////////////////

  const nextHandler = () => {
    if (passed) {
      const phrase = WalletController.onboardHelper.getSeedPhrase();
      WalletController.createWallet('Main Wallet', phrase, true);
      navigationUtil.replace(navigation, screens.authorized.root);
    }
  };

  const onSubmit = async (data: any) => {
    WalletController.setWalletPassword(data.password);
    setPassed(true);
  };

  ///////////////////////////
  // Render  
  //////////////////////////

  return (
    <Container>
      <CreatePass
        title={title}
        passed={passed}
        register={register}
        errors={errors}
        comment={comment}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        nextHandler={nextHandler}
        control={control}
      />
    </Container>
  )

}

export default CreatePassContainer;