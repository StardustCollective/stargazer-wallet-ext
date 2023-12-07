///////////////////////
// Modules
///////////////////////

import React, { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////
// Utils
///////////////////////

import { getWalletController } from 'utils/controllersUtils';
import { usePlatformAlert } from 'utils/alertUtil';

///////////////////////
// Components
///////////////////////

import Container from 'components/Container';
import AddNetwork from './AddNetwork';

///////////////////////
// Constants
///////////////////////

import screens from 'navigation/screens';
import { CONSTELLATION_LOGO, ETHEREUM_LOGO } from 'constants/index';

const AddNetorkContainer: FC<{ navigation: any }> = ({ navigation }) => {
  const { control, register, setValue, triggerValidation, errors } = useForm({
    validationSchema: yup.object().shape({
      networkType: yup.string(),
      chainName: yup.string().required('Chain name is required'),
      rpcUrl: yup.string().required('RPC URL is required'),
      chainId: yup.string().required('Chain ID is required'),
      blockExplorerUrl: yup.string().required('Block explorer URL is required'),
    }),
  });

  const walletController = getWalletController();
  const showAlert = usePlatformAlert();

  const [networkType, setNetworkType] = useState<string>('constellation');
  const [chainName, setChainName] = useState<string>('');
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [blockExplorerUrl, setBlockExplorerUrl] = useState<string>('');
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    const hasErrors = !!Object.keys(errors)?.length;
    const disabled =
      hasErrors ||
      networkType === '' ||
      chainName === '' ||
      rpcUrl === '' ||
      (networkType === 'ethereum' && chainId === '') ||
      blockExplorerUrl === '';
    setSaveDisabled(disabled);
  }, [Object.keys(errors), networkType, chainName, rpcUrl, chainId, blockExplorerUrl]);

  const handleSave = async () => {
    try {
      await walletController.addNetwork(networkType, {
        chainName,
        rpcUrl,
        chainId,
        blockExplorerUrl,
      });
    } catch (err) {
      showAlert('Unable to connect to RPC provider', 'danger');
    }
  };

  const handleChainNameChange = (value: string) => {
    setChainName(value);
    setValue('chainName', value);
    triggerValidation('chainName');
  };

  const handleRpcUrlChange = (value: string) => {
    setRpcUrl(value);
    setValue('rpcUrl', value);
    triggerValidation('rpcUrl');
  };
  const handleChainIdChange = (value: string) => {
    setChainId(value);
    setValue('chainId', value);
    triggerValidation('chainId');
  };
  const handleBlockExplorerUrlChange = (value: string) => {
    setBlockExplorerUrl(value);
    setValue('blockExplorerUrl', value);
    triggerValidation('blockExplorerUrl');
  };

  const handleNetworkTypeChange = (value: string) => {
    setNetworkType(value);
    setValue('chainName', '');
    setValue('rpcUrl', '');
    setValue('chainId', '');
    setValue('blockExplorerUrl', '');
    setChainName('');
    setRpcUrl('');
    setChainId('');
    setBlockExplorerUrl('');
  };

  const navigateToSingleSelect = () => {
    navigation.navigate(screens.authorized.singleSelect, {
      title: 'Select Network Type',
      data: networkTypeOptions.items,
      selected: networkType,
      onSelect: handleNetworkTypeChange,
    });
  };

  const networkTypeOptions = {
    title: 'Network Type',
    value: networkType,
    items: [
      { value: 'constellation', label: 'Constellation', icon: CONSTELLATION_LOGO },
      { value: 'ethereum', label: 'Ethereum', icon: ETHEREUM_LOGO },
    ],
    onClick: navigateToSingleSelect,
  };

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <Container safeArea={false}>
      <AddNetwork
        register={register}
        control={control}
        errors={errors}
        saveDisabled={saveDisabled}
        networkTypeOptions={networkTypeOptions}
        chainName={chainName}
        rpcUrl={rpcUrl}
        chainId={chainId}
        blockExplorerUrl={blockExplorerUrl}
        handleChainNameChange={handleChainNameChange}
        handleRpcUrlChange={handleRpcUrlChange}
        handleChainIdChange={handleChainIdChange}
        handleBlockExplorerUrlChange={handleBlockExplorerUrlChange}
        handleSave={handleSave}
      />
    </Container>
  );
};

export default AddNetorkContainer;
