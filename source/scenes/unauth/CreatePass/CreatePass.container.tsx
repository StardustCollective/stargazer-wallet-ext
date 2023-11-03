///////////////////////////
// Modules
///////////////////////////

import React, { useState } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { useForm } from 'react-hook-form';
import { useLinkTo } from '@react-navigation/native';
import * as consts from './consts';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Scene
///////////////////////////

import CreatePass from './CreatePass';

///////////////////////////
// Container
///////////////////////////

const CreatePassContainer = () => {
  const walletController = getWalletController();

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const linkTo = useLinkTo();
  const [passed, setPassed] = useState(false);
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: consts.schema,
  });

  ///////////////////////////
  // Strings
  ///////////////////////////

  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed ? consts.CREATE_PASS_COMMENT2 : consts.CREATE_PASS_COMMENT1;

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const nextHandler = () => {
    if (passed) {
      linkTo('/create/phrase/remind');
    }
  };

  const onSubmit = (data: any) => {
    walletController.setWalletPassword(data.password);
    setPassed(true);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} maxHeight={false}>
      <CreatePass
        control={control}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        nextHandler={nextHandler}
        passed={passed}
        register={register}
        errors={errors}
        comment={comment}
        title={title}
      />
    </Container>
  );
};

export default CreatePassContainer;
