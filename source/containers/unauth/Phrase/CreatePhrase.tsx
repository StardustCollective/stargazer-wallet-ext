import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/Button';

import Layout from '../Layout';

import styles from './index.scss';

const CreatePhrase: FC = () => {
  const history = useHistory();
  const [passed, setPassed] = useState(false);
  const title = passed ? `Let's double check` : `This is your recovery\nphrase`;
  const description = passed
    ? "Well done. To verify that you've written down your recovery phrase correctly, please enter it again in the next step."
    : 'Please make sure to write it down exactly as shown here.';
  const TEST_PHRASES = [
    'spirit',
    'leg',
    'rude',
    'side',
    'foot',
    'library',
    'pear',
    'rubber',
    'hollow',
    'medal',
    'fossil',
    'guilt',
  ];

  const nextHandler = () => {
    if (passed) {
      history.push('/create/phrase/checking');
    } else {
      setPassed(true);
    }
  };

  return (
    <Layout title={title} linkTo="/create/phrase/remind">
      <div className="body-description mb-30">{description}</div>
      {!passed && (
        <ul className={styles.generated}>
          {TEST_PHRASES.map((phrase, index) => (
            <li key={phrase}>
              <span className="t-gray-medium">
                {String(index + 1).padStart(2, '0')}.
              </span>
              {phrase}
            </li>
          ))}
        </ul>
      )}
      <Button type="button" onClick={nextHandler} variant={styles.written}>
        {passed ? "Let's do it" : "I've written it down"}
      </Button>
    </Layout>
  );
};

export default CreatePhrase;
