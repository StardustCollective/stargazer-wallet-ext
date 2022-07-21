///////////////////////
// Modules
///////////////////////

import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////
// Components
///////////////////////

import Container from 'components/Container';
import AddNetwork from './AddNetwork';

const AddNetorkContainer: FC = () => {

  const { control, handleSubmit, register, setValue, setError, triggerValidation, errors } = useForm({
    validationSchema: yup.object().shape({
      networkType: yup.string().required('Network type is required'),
      chainName: yup.string().required('Chain name is required'),
      rpcUrl: yup.string().required('RPC URL is required'),
      chainId: yup.string().required('Chain ID is required'),
      blockExplorerUrl: yup.string().required('Block explorer URL is required'),
    }),
  });

  console.log(handleSubmit, register, setError);

  const [networkType, setNetworkType] = useState<string>('constellation');
  const [chainName, setChainName] = useState<string>('');
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [blockExplorerUrl, setBlockExplorerUrl] = useState<string>('');
  const [networkTypeOpen, setNetworkTypeOpen] = useState<boolean>(false);

  const handleSave = () => {
    console.log('Save');
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
    triggerValidation('networkType');
  }

  const toggleNetworkType = () => {
    setNetworkTypeOpen(!networkTypeOpen);
  }

  const networkTypeOptions = {
    value: networkType,
    items: [
      { value: 'constellation', label: 'Constellation' }, 
      { value: 'evm', label: 'EVM' }, 
    ],
    isOpen: networkTypeOpen,
    toggleItem: toggleNetworkType,
    onChange: handleNetworkTypeChange
  }

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <Container safeArea={false}>
      <AddNetwork 
        control={control}
        errors={errors}
        saveDisabled={false}
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
