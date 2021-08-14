import React, { useEffect, useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { useForm } from 'react-hook-form';
import { useController } from 'hooks/index';
import { useNavigation } from '@react-navigation/native';
import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';
import Layout from '../../common/Layout';
import * as consts from './consts';
import styles from './CreatePass.scss';

const CreatePass = () => {
  const navigation = useNavigation();
  const controller = useController();
  const [passed, setPassed] = useState(false);
  const { handleSubmit, register, errors } = useForm({
    validationSchema: consts.schema,
  });
  const title = passed ? consts.CREATE_PASS_TITLE2 : consts.CREATE_PASS_TITLE1;
  const comment = passed
    ? consts.CREATE_PASS_COMMENT2
    : consts.CREATE_PASS_COMMENT1;

  const nextHandler = () => {
    if (passed) {
      const phrase = controller.wallet.onboardHelper.getSeedPhrase();
      controller.wallet.createWallet('Main Wallet', phrase, true);
      navigationUtil.replace( navigation, screens.authorized.root);
    }
  };

  const onSubmit = async (data: any) => {
    controller.wallet.setWalletPassword(data.password);
    setPassed(true);
  };

  const handleKeydown = (ev: KeyboardEvent) => {
    if (ev.code === 'Enter') {
      nextHandler();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [passed]);

  return (
    <Layout title={title} linkTo="/app.html">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {passed ? (
          <CheckIcon className={styles.checked} />
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
            <span className={styles.warning}>
              At least 8 characters, 1 lower-case, 1 upper-case, 1 numeral and 1
              special character.
            </span>
            {(errors.password || errors.repassword) && (
              <span className={styles.error}>
                {errors.password
                  ? errors.password.message
                  : errors.repassword.message}
              </span>
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
