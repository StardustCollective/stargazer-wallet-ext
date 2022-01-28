import React, { useMemo, useState } from 'react';
// import { useController } from 'hooks/index';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Container from 'components/Container';

import ImportPhrase from './ImportPhrase';
import { useLinkTo } from '@react-navigation/native';


const ImportPhraseContainer = () => {
  // const controller = useController();

  const linkTo = useLinkTo();

  const [isInvalid, setInvalid] = useState(false);

  const { control, handleSubmit, register, watch } = useForm({
    validationSchema: yup.object().shape({
      phrase: yup.string().required(),
    }),
  });

  const onSubmit = (data: any) => {
    // const phrase = data.phrase.trim();
  
    // if (controller.wallet.onboardHelper.importAndValidateSeedPhrase(phrase)
    // ) {
    //   linkTo('/create/pass');
    //   onRegister();
    // }
    // else {
      // setInvalid(true)
    // }
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
    <Container>
      <ImportPhrase
        control={control}
        handleSubmit={handleSubmit}
        register={register}
        onSubmit={onSubmit}
        isInvalid={isInvalid}
      />
    </Container>
  )

}

export default ImportPhraseContainer;