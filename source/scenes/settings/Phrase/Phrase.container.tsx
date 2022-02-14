import React, { FC, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Container from 'scenes/common/Container';

import { useCopyClipboard } from 'hooks/index';
import WalletController from 'scripts/Background/controllers/WalletController';

import Phrase from './Phrase';

import { IPhraseView } from './types';

const PhraseContainer: FC<IPhraseView> = ({ route }) => {
  const [checked, setChecked] = useState(false);
  const [phrase, setPhrase] = useState<string>(
    '**** ******* ****** ****** ****** ******** *** ***** ****** ***** *****'
  );

  const { id } = route.params;
  const [isCopied, copyText] = useCopyClipboard();
  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const onSubmit = async (data: any) => {
    const res = await WalletController.getPhrase(id, data.password);

    if (res) {
      setPhrase(res);
      setChecked(true);
    } else {
      showMessage({
        message: 'Error: Invalid password',
        type: 'danger',
      });
    }
  };

  const handleCopySeed = () => {
    if (!checked) return;
    copyText(phrase);
  };

  return (
    <Container>
      <Phrase
        checked={checked}
        phrase={phrase}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        control={control}
        register={register}
        isCopied={isCopied}
        handleCopySeed={handleCopySeed}
      />
    </Container>
  );
};

export default PhraseContainer;
