import React, { FC } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import Collections from './Collections';
import { ICollections } from './types';

const CollectionsContainer: FC<ICollections> = ({ navigation }) => {
  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <Collections />
    </Container>
  );
};

export default CollectionsContainer;
