///////////////////////////
// Modules
///////////////////////////

import React, { useState } from 'react';
import Container from 'components/Container'
import { useForm } from 'react-hook-form';
import { useController } from 'hooks/index';
import { useLinkTo } from '@react-navigation/native';
import * as consts from './consts';

///////////////////////////
// Scene
///////////////////////////

import CreatePass from './CreatePass';

///////////////////////////
// Container
///////////////////////////

const CreatePassContainer = () => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const controller = useController();
  const linkTo = useLinkTo();
  const [passed, setPassed] = useState(false);
  const { control, handleSubmit, register, errors } = useForm({
    validationSchema: consts.schema,
  });

  ///////////////////////////
  // Strings
  ///////////////////////////

  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed
    ? consts.CREATE_PASS_COMMENT2
    : consts.CREATE_PASS_COMMENT1;

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const nextHandler = () => {
    if (passed) {
      linkTo('/create/phrase/remind');
    }
  };

  const onSubmit = (data: any) => {
    controller.wallet.setWalletPassword(data.password);
    setPassed(true);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container>
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

}

export default CreatePassContainer;