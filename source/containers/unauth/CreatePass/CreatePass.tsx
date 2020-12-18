import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import CheckIcon from 'assets/images/svg/check.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useController } from 'hooks/index';

import Layout from '../../common/Layout';

import * as consts from './consts';
import styles from './CreatePass.scss';

const CreatePass = () => {
  const history = useHistory();
  const controller = useController();
  const [passed, setPassed] = useState(false);
  const { handleSubmit, register, errors } = useForm({
    resolver: yupResolver(consts.schema),
  });
  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed
    ? consts.CREATE_PASS_COMMENT2
    : consts.CREATE_PASS_COMMENT1;

  const nextHandler = () => {
    if (passed) {
      history.push('/create/phrase/remind');
    }
  };

  const onSubmit = (data: any) => {
    controller.wallet.setWalletPassword(data.password);
    setPassed(true);
  };

  return (
    <Layout title={title} linkTo="/remind">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {passed ? (
          <img src={`/${CheckIcon}`} className={styles.checked} alt="Success" />
        ) : (
          <>
            <TextInput
              type="password"
              placeholder="Please enter at least 8 characters"
              fullWidth
              name="password"
              visiblePassword
              inputRef={register}
              variant={styles.pass}
            />
            <TextInput
              type="password"
              placeholder="Please enter your password again"
              fullWidth
              name="repassword"
              inputRef={register}
              visiblePassword
              variant={styles.repass}
            />
            {errors.password ? (
              <span className={styles.warning}>{errors.password.message}</span>
            ) : (
              errors.repassword && (
                <span className={styles.error}>
                  {errors.repassword.message}
                </span>
              )
            )}
          </>
        )}
        <span className={`body-comment ${styles.comment}`}>{comment}</span>
        <Button
          type={passed ? 'button' : 'submit'}
          variant={styles.next}
          onClick={nextHandler}
        >
          Next
        </Button>
      </form>
    </Layout>
  );
};

export default CreatePass;
