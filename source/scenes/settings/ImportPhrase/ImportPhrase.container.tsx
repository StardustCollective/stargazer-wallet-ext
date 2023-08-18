import React from 'react';
import navigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { IImportPhraseView } from './types';
import ImportPhrase from 'scenes/common/Import/ImportPhrase';
import { IMPORT_TYPE } from 'scenes/common/Import/ImportPhrase/ImportPhrase.container';

const ImportPhraseContainer = ({ navigation }: IImportPhraseView) => {
  const linkTo = useLinkTo();

  const navigateToWallets = () => {
    navigationUtil.popToTop(navigation);
    linkTo('/settings/wallets');
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <ImportPhrase
        type={IMPORT_TYPE.IMPORT}
        buttonTitle="Import"
        title="Import from recovery phrase"
        onButtonPress={navigateToWallets}
      />
    </Container>
  );
};

export default ImportPhraseContainer;
