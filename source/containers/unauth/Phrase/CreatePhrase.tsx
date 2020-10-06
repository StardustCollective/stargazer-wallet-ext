import React, { FC } from 'react';
import Button from 'components/Button';

import Layout from '../Layout';

interface ICreatePhrase {
  onCheck: () => void;
}

const CreatePhrase: FC<ICreatePhrase> = ({ onCheck }) => {
  return (
    <Layout title="Create Phrase">
      <Button type="button" onClick={onCheck}>
        Next
      </Button>
    </Layout>
  );
};

export default CreatePhrase;
