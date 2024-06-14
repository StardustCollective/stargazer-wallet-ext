///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';

///////////////////////////
// Components
///////////////////////////

import Layout from 'scenes/common/Layout';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

///////////////////////////
// Styles
///////////////////////////

import styles from './CreatePass.scss';

///////////////////////////
// Types
///////////////////////////

import ICreatePass from './types';
import { setSgw } from 'utils/keyring';

///////////////////////////
// Scene
///////////////////////////

const CreatePass: FC<ICreatePass> = ({
  title,
  passed,
  register,
  errors,
  comment,
  buttonLoading,
  onSubmit,
  handleSubmit,
  nextHandler,
}) => {
  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const handleKeydown = (ev: KeyboardEvent) => {
    if (ev.code === 'Enter') {
      nextHandler();
    }
  };

  ///////////////////////////
  // Hooks
  ///////////////////////////

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [passed]);

  const onHandleSubmit = async (data: any) => {
    await setSgw(data.password);
    onSubmit(data);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Layout title={title}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className={styles.form}>
        {passed ? (
          <CheckIcon className={styles.checked} />
        ) : (
          <>
            <TextInput
              id={'passwordField'}
              type="password"
              placeholder="Please enter at least 8 characters"
              fullWidth
              name="password"
              visiblePassword
              inputRef={register}
              variant={styles.pass}
            />
            <TextInput
              id={'confirmPasswordField'}
              type="password"
              placeholder="Please enter your password again"
              fullWidth
              name="repassword"
              inputRef={register}
              visiblePassword
              variant={styles.repass}
            />
            <span className={styles.warning}>
              At least 8 characters, 1 lower-case, 1 upper-case, 1 numeral and 1 special
              character.
            </span>
            {(errors.password || errors.repassword) && (
              <span id="passwordError" className={styles.error}>
                {errors.password ? errors.password.message : errors.repassword.message}
              </span>
            )}
          </>
        )}
        <span className={`body-comment ${styles.comment}`}>{comment}</span>
        <Button
          id={'nextButton'}
          type={passed ? 'button' : 'submit'}
          variant={styles.next}
          onClick={nextHandler}
          loading={buttonLoading}
        >
          Next
        </Button>
      </form>
    </Layout>
  );
};

export default CreatePass;
