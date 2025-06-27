import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import { getWalletController } from 'utils/controllersUtils';
import Container, { CONTAINER_COLOR } from 'components/Container';
import RemoveWallet from './RemoveWallet';
import { IRemoveWalletView } from './types';
import localStorage from 'utils/localStorage';
import walletsSelectors from 'selectors/walletsSelectors';
import { isHardware } from 'utils/hardware';

const RemoveWalletContainer: FC<IRemoveWalletView> = ({ route, navigation }) => {
  const allWallets = useSelector(walletsSelectors.selectAllWallets);

  const walletController = getWalletController();
  const { id } = route.params;
  const wallet = allWallets.find((w) => w.id === id);
  const linkTo = useLinkTo();
  const [loading, setLoading] = useState(false);

  const handleRemoveWallet = async () => {
    setLoading(true);
    const isHardwareWallet = isHardware(wallet?.type);
    await walletController.deleteWallet(wallet);
    if (allWallets.length === 1) {
      await walletController.logOut();
      await localStorage.removeItem('stargazer-vault');
      walletController.getEncryptedVault();
      walletController.onboardHelper.reset();
      linkTo('/unAuthRoot');
    } else {
      navigation.goBack();
      navigation.goBack();
      if (!isHardwareWallet) {
        navigation.goBack();
      }
    }
  };

  const handleCancel = () => {
    const isHardwareWallet = isHardware(wallet?.type);
    navigation.goBack();
    if (!isHardwareWallet) {
      navigation.goBack();
    }
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <RemoveWallet
        wallet={wallet}
        loading={loading}
        handleCancel={handleCancel}
        handleRemoveWallet={handleRemoveWallet}
      />
    </Container>
  );
};

export default RemoveWalletContainer;
