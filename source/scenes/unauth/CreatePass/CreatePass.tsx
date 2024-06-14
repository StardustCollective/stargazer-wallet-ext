import React, { FC } from 'react';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Layout from '../../common/Layout';
import styles from './CreatePass.scss';
import ICreatePass from './types';
import { setSgw } from 'utils/keyring';

const CreatePass: FC<ICreatePass> = ({
  onSubmit,
  handleSubmit,
  nextHandler,
  passed,
  register,
  errors,
  comment,
  title,
}) => {
  const onHandleSubmit = async (data: any) => {
    await setSgw(data.password);
    onSubmit(data);
  };

  return (
    <Layout title={title}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className={styles.form}>
        {passed ? (
          <CheckIcon className={styles.checked} />
        ) : (
          <>
            <TextInput
              id="createPass-password"
              type="password"
              placeholder="Please enter at least 8 characters"
              fullWidth
              name="password"
              visiblePassword
              inputRef={register}
              variant={styles.pass}
            />
            <TextInput
              id="createPass-confirmPassword"
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
              <span id="createPass-passwordError" className={styles.error}>
                {errors.password ? errors.password.message : errors.repassword.message}
              </span>
            )}
          </>
        )}
        <span className={`body-comment ${styles.comment}`}>{comment}</span>
        <Button
          id="createPass-nextButton"
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
