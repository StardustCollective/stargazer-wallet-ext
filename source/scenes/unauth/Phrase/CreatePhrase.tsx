import React, { FC, useState } from 'react';
import clsx from 'clsx';
import Button from 'components/Button';
import { useLinkTo } from '@react-navigation/native';

import Layout from '../../common/Layout';

import * as consts from './consts';
import styles from './index.scss';
import { useController } from 'hooks/index';

const CreatePhrase: FC = () => {
  const controller = useController();
  const linkTo = useLinkTo();
  const [passed, setPassed] = useState(false);
  const title = passed
    ? consts.CREATE_PHRASE_TITLE2
    : consts.CREATE_PHRASE_TITLE1;
  const description = passed
    ? consts.CREATE_PHRASE_DESCRIPTION2
    : consts.CREATE_PHRASE_DESCRIPTION1;

  const phrases = controller.wallet.onboardHelper.getSeedPhrase();


  const nextHandler = () => {
    if (passed && phrases) {
      linkTo('/create/phrase/check');
    } else {
      setPassed(true);
    }
  };

  return (
    <Layout title={title} linkTo="/create/phrase/remind">
      <div className="body-description mb-30">{description}</div>
      {!passed && phrases && (
        <ul className={styles.generated}>
          {phrases.split(' ').map((phrase: string, index: number) => (
            <li key={phrase}>
              <span className="t-gray-medium">
                {String(index + 1).padStart(2, '0')}.
              </span>
              {phrase}
            </li>
          ))}
        </ul>
      )}
      <Button
        type="button"
        onClick={nextHandler}
        variant={clsx(styles.written, { [styles.passed]: passed })}
      >
        {passed ? "Let's do it" : "I've written it down"}
      </Button>
    </Layout>
  );
};

export default CreatePhrase;
