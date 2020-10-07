import React, { FC } from 'react';
import Button from 'components/Button';

import Layout from '../Layout';

const CreatePhrase: FC = () => {
  return (
    <Layout title="Create Phrase" linkTo="/create/phrase/remind">
      <div className="body-description">
        Please make sure to write it down as shown here.
      </div>
      <Button type="button" linkTo="/create/phrase/checking">
        I've written it down
      </Button>
    </Layout>
  );
};

export default CreatePhrase;
