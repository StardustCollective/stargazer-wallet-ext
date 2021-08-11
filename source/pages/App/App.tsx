import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from 'navigation/stacks/Auth';
import UnAuthStack from 'navigation/stacks/UnAuth';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';

import 'assets/styles/global.scss';

const App: FC = () => {

  const { wallets, hasEncryptedVault, migrateWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  return (
    <NavigationContainer>
      {migrateWallet || (wallets && Object.values(wallets).length > 0) || hasEncryptedVault ? (
        <AuthStack />
      ) : (
        <UnAuthStack />
      )}
    </NavigationContainer>
  );
};

export default App;
