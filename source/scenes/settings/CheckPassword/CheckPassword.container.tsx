import React, { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { useCopyClipboard } from 'hooks/index';
import { getWalletController } from 'utils/controllersUtils';
import { useSelector } from 'react-redux';
import walletsSelector from 'selectors/walletsSelectors';
import { IDropdownOptions } from 'components/Dropdown/types';
import {
  KeyringAssetType,
  KeyringNetwork,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';
import { useLinkTo } from '@react-navigation/native';
import { ellipsis } from 'scenes/home/helpers';
import { RootState } from 'state/store';
import { TCheckPassword } from './types';
import CheckPassword from './CheckPassword';
import {
  PRIVATE_KEY_MESSAGE,
  RECOVERY_MESSAGE,
  REMOVE_WALLET_MESSAGE_1,
  REMOVE_WALLET_MESSAGE_2,
} from './constants';

const CheckPasswordContainer: FC<TCheckPassword> = ({ navigation, route }) => {
  const { id, type } = route?.params || {};

  const linkTo = useLinkTo();
  const walletController = getWalletController();
  const [isCopied, copyText] = useCopyClipboard();

  const { enabled: isBiometricEnabled } = useSelector(
    (state: RootState) => state.biometrics
  );
  const allWallets = useSelector(walletsSelector.selectAllWallets);
  const wallet = allWallets.find((w) => w.id === id);
  const initialNetwork = wallet?.supportedAssets?.includes(KeyringAssetType.DAG)
    ? KeyringNetwork.Constellation
    : KeyringNetwork.Ethereum;
  const DAGAddress =
    wallet?.accounts?.find((account) => account.network === KeyringNetwork.Constellation)
      ?.address || '';
  const ETHAddress =
    wallet?.accounts?.find((account) => account.network === KeyringNetwork.Ethereum)
      ?.address || '';

  const [walletPhrase, setWalletPhrase] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isSAW = wallet?.type === KeyringWalletType.SingleAccountWallet;
  const isDAGNetwork = selectedNetwork === KeyringNetwork.Constellation;
  const isSubmitDisabled = !passwordText;
  const isRecoveryPhrase = type === 'phrase';
  const isRemoveWallet = type === 'remove';
  const hasRecoveryPhrase = wallet?.type === KeyringWalletType.MultiChainWallet;
  const walletType = hasRecoveryPhrase ? 'recovery phrase' : 'private key';
  const warningMessage = isRemoveWallet
    ? `${REMOVE_WALLET_MESSAGE_1} ${walletType} ${REMOVE_WALLET_MESSAGE_2}`
    : isRecoveryPhrase
    ? RECOVERY_MESSAGE
    : PRIVATE_KEY_MESSAGE;

  const { handleSubmit, register, control, watch, setError, errors, setValue } = useForm({
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  });

  const passwordValue = watch('password');

  useEffect(() => {
    setPasswordText(passwordValue);
  }, [passwordValue]);

  useEffect(() => {
    const title = isRemoveWallet
      ? 'Remove Wallet'
      : isRecoveryPhrase
      ? 'Your Recovery Phrase'
      : 'Your Private Key';
    navigation.setOptions({ title });
    () => {
      setWalletPhrase('');
      setPrivateKey('');
      setPasswordText('');
      setValue('password', '');
    };
  }, []);

  const handleOnCancel = () => {
    navigation.goBack();
  };

  const updatePrivateKey = (address: string) => {
    const pk = walletController.keyringManager.exportAccountPrivateKey(address);
    if (!!pk && !!pk.length) {
      setPrivateKey(pk);
    }
  };

  const handleOnSubmit = async (data: any) => {
    const { password } = data;
    let phrase;
    let privateKey;
    if (isRecoveryPhrase || (isRemoveWallet && hasRecoveryPhrase)) {
      phrase = await walletController.getPhrase(id, password);
    } else {
      // For Multi-chain wallets, the first account is the Constellation account
      const { address } = wallet.accounts[0];
      privateKey = await walletController.getPrivateKey(address, password);
    }

    if (!!phrase && !!phrase.length) {
      setWalletPhrase(phrase);
    } else if (!!privateKey && !!privateKey.length) {
      setPrivateKey(privateKey);
    } else {
      setError('password', 'wrong', 'Password is wrong');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOnContinue = () => {
    linkTo(`/settings/wallets/remove?id=${id}`);
  };

  const networkOptions: IDropdownOptions = {
    icon: isDAGNetwork ? CONSTELLATION_LOGO : ETHEREUM_LOGO,
    title: isDAGNetwork ? 'Constellation Network' : 'EVM Networks',
    value: isDAGNetwork ? ellipsis(DAGAddress) : ellipsis(ETHAddress),
    displayValue: true,
    isOpen: isDropdownOpen,
    containerStyle: {
      zIndex: 8000,
    },
    disabled: isSAW,
    showArrow: !isSAW,
    toggleItem: toggleDropdown,
    onChange: (address: string) => {
      const isEth = address.startsWith('0x');
      const network = isEth ? KeyringNetwork.Ethereum : KeyringNetwork.Constellation;
      const fullAddress = isEth ? ETHAddress : DAGAddress;
      setSelectedNetwork(network as KeyringNetwork);
      updatePrivateKey(fullAddress);
      toggleDropdown();
    },
    items: [
      {
        value: ellipsis(DAGAddress),
        label: 'Constellation Network',
      },
      {
        value: ellipsis(ETHAddress),
        label: 'EVM Networks',
      },
    ],
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <CheckPassword
        warningMessage={warningMessage}
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        wallet={wallet}
        walletPhrase={walletPhrase}
        privateKey={privateKey}
        password={passwordText}
        networkOptions={networkOptions}
        isSubmitDisabled={isSubmitDisabled}
        handleOnCancel={handleOnCancel}
        handleOnSubmit={handleOnSubmit}
        handleOnContinue={handleOnContinue}
        updatePrivateKey={updatePrivateKey}
        errors={errors}
        isCopied={isCopied}
        copyText={copyText}
        isBiometricEnabled={isBiometricEnabled}
        isRemoveWallet={isRemoveWallet}
      />
    </Container>
  );
};

export default CheckPasswordContainer;
