///////////////////////////
// Modules
///////////////////////////

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

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
  const [buttonLoading, setButtonLoading] = useState(false);
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: consts.schema,
  });
  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed ? consts.CREATE_PASS_COMMENT2 : consts.CREATE_PASS_COMMENT1;

  ///////////////////////////
  // Callbacks
  //////////////////////////

  const nextHandler = async () => {
    if (passed) {
      setButtonLoading(true);
      const phrase = getWalletController().onboardHelper.getSeedPhrase();
      await getWalletController().createWallet('Main Wallet', phrase, true);
      getWalletController().onboardHelper.reset();
      navigationUtil.replace(navigation, screens.authorized.root);
    }
  };

  const onSubmit = async (data: any) => {
    getWalletController().setWalletPassword(data.password);
    setPassed(true);
  };

  ///////////////////////////
  // Render
  //////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} maxHeight={false}>
      <CreatePass
        title={title}
        passed={passed}
        register={register}
        errors={errors}
        comment={comment}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        nextHandler={nextHandler}
        buttonLoading={buttonLoading}
        control={control}
      />
    </Container>
  );
};

export default CreatePassContainer;
