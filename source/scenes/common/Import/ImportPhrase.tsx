import React, { FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import TextInput from 'components/TextInput';
import Button from 'components/Button';

import styles from './ImportPhrase.scss';
import { useController } from 'hooks/index';

interface IImportPhrase {
  onRegister: () => void;
}

const ImportPhrase: FC<IImportPhrase> = ({ onRegister }) => {
  const controller = useController();

  const [isInvalid, setInvalid] = useState(false);

  const { handleSubmit, register, watch } = useForm({
    validationSchema: yup.object().shape({
      phrase: yup.string().required(),
    }),
  });

  const onSubmit = (data: any) => {
    const phrase = data.phrase.trim();
    if (controller.wallet.onboardHelper.importAndValidateSeedPhrase(phrase)
    ) {
      onRegister();
    }
    else {
      setInvalid(true)
    }
  };

  const isDisabled = useMemo(() => {
    const phrase: string = watch('phrase');
    if (!phrase) return true;
    const len = phrase.trim().split(' ').length;
    // console.log(len, (len % 3), (len < 12 || len > 24 || (len % 3 > 0)))
    const result = len < 12 || len > 24 || (len % 3 > 0);

    //Reset invalid if phrase has changed and no longer disabled.
    if (isInvalid && !result) {
      setInvalid(false);
    }

    return result;
  }, [watch('phrase')]);

  return (
      <form className={styles.importForm} onSubmit={handleSubmit(onSubmit)}>

        <span className={styles.important}>IMPORTANT: Importing a recovery seed phrase will replace any existing accounts.</span>

        <span>Paste your recovery seed phrase below:</span>
        <TextInput
          type="text"
          name="phrase"
          visiblePassword
          multiline
          fullWidth
          inputRef={register}
          variant={styles.input}
        />
        <span>

          <b>The phrase can be 12, 15, 18, 21 or 24 words with a single space between.</b>
          <br/>
          {isInvalid && (
            <span className={styles.error}>Invalid recovery seed phrase</span>
          )}
        </span>
        <div className={styles.actions}>
          <Button type="submit" variant={styles.button} disabled={isDisabled}>
            Import
          </Button>
        </div>
      </form>
  );
};

export default ImportPhrase;
