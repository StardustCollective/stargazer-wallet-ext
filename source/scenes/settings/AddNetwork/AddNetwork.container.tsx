///////////////////////
// Modules
///////////////////////

import React, { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////
// Components
///////////////////////

import Container from 'components/Container';
import AddNetwork from './AddNetwork';

///////////////////////
// Constants
///////////////////////

import screens from 'navigation/screens';

const AddNetorkContainer: FC<{ navigation: any }> = ({ navigation }) => {

  const { control, handleSubmit, register, setValue, setError, triggerValidation, errors } = useForm({
    validationSchema: yup.object().shape({
      networkType: yup.string(),
      chainName: yup.string().required('Chain name is required'),
      rpcUrl: yup.string().required('RPC URL is required'),
      chainId: yup.string().required('Chain ID is required'),
      blockExplorerUrl: yup.string().required('Block explorer URL is required'),
    }),
  });

  const [networkType, setNetworkType] = useState<string>('constellation');
  const [chainName, setChainName] = useState<string>('');
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [blockExplorerUrl, setBlockExplorerUrl] = useState<string>('');
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    const disabled = networkType === '' || chainName === '' || rpcUrl === '' || (networkType === 'ethereum' && chainId === '') || blockExplorerUrl === '';
    setSaveDisabled(disabled);
  }, [networkType, chainName, rpcUrl, chainId, blockExplorerUrl]);

  useEffect(() => {
    const disabled = !!Object.keys(errors)?.length;
    setSaveDisabled(disabled);
  }, [errors]);

  const handleSave = () => {
    console.log('Save', {networkType, chainName, rpcUrl, chainId, blockExplorerUrl});
    console.log('handle', {handleSubmit, setError});
  }

  const handleChainNameChange = (value: string) => {
    setChainName(value);
    setValue('chainName', value);
    triggerValidation('chainName');
  }
  
  const handleRpcUrlChange = (value: string) => {
    setRpcUrl(value);
    setValue('rpcUrl', value);
    triggerValidation('rpcUrl');
  }
  const handleChainIdChange = (value: string) => {
    setChainId(value);
    setValue('chainId', value);
    triggerValidation('chainId');
  }
  const handleBlockExplorerUrlChange = (value: string) => {
    setBlockExplorerUrl(value);
    setValue('blockExplorerUrl', value);
    triggerValidation('blockExplorerUrl');
  }

  const handleNetworkTypeChange = (value: string) => {
    setNetworkType(value);
    setValue('networkType', value);
    setChainName('');
    setRpcUrl('');
    setChainId('');
    setBlockExplorerUrl('');
  }

  const navigateToSingleSelect = () => {
    console.log('Navigate to Single Select')
    navigation.navigate(screens.authorized.singleSelect, { 
      title: 'Select Network Type', 
      data: networkTypeOptions.items, 
      selected: networkType,
      onSelect: handleNetworkTypeChange
    });
  }

  const networkTypeOptions = {
    title: 'Network Type',
    value: networkType,
    items: [
      { value: 'constellation', label: 'Constellation', icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/constellation-logo.png' }, 
      { value: 'ethereum', label: 'Ethereum', icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-logo.png' }, 
    ],
    onClick: navigateToSingleSelect,
  }

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
