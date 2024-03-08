import React from 'react';
import navigationUtil from 'navigation/util';
import { useLinkTo } from '@react-navigation/native';
import ImportPhrase from 'scenes/common/Import/ImportPhrase';
import { IMPORT_TYPE } from 'scenes/common/Import/ImportPhrase/ImportPhrase.container';
import { IImportPhraseView } from './types';

const ImportPhraseContainer = ({ navigation }: IImportPhraseView) => {
  const linkTo = useLinkTo();

  const navigateToWallets = () => {
    navigationUtil.popToTop(navigation);
    linkTo('/settings/wallets');
  };

  return (
    <ImportPhrase
      type={IMPORT_TYPE.IMPORT}
      buttonTitle="Import"
      title="Import from recovery phrase"
      onImportPhraseSuccess={navigateToWallets}
    />
  );
};

export default ImportPhraseContainer;
