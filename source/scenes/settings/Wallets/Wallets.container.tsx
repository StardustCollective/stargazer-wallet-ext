import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import addHeader from 'navigation/headers/add';
import { useLinkTo } from '@react-navigation/native';
import Container, { CONTAINER_COLOR } from 'components/Container';
import Wallets from './Wallets';
import { IWalletsView } from './types';
import walletsSelectors from 'selectors/walletsSelectors';

const WalletsContainer: FC<IWalletsView> = ({ navigation }) => {
  const linkTo = useLinkTo();
  const hardwareWalletAccounts = useSelector(walletsSelectors.selectAllHardwareWallets);
  const multiChainAccounts = useSelector(walletsSelectors.selectMultiChainWallets);
  const privKeyAccounts = useSelector(walletsSelectors.selectSingleAccountWallets);

  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/settings/wallets/add');
    };
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  const handleManageWallet = async (walletId: string) => {
    linkTo(`/settings/wallets/manage?id=${walletId}`);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <Wallets
        multiChainAccounts={multiChainAccounts}
        activeWallet={activeWallet}
        privKeyAccounts={privKeyAccounts}
        hardwareWalletAccounts={hardwareWalletAccounts}
        handleManageWallet={handleManageWallet}
      />
    </Container>
  );
};

export default WalletsContainer;
