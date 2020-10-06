import React, { FC } from 'react';
import Button from 'components/Button';

import Layout from '../Layout';

const CreatePhrase: FC = () => {
  return (
    <Layout title="Create Phrase" linkTo="/create/pass">
      <Button type="button" linkTo="/create/phrase/checking">
        Next
      </Button>
    </Layout>
  );
};

export default CreatePhrase;
