///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import AddCustomAsset from './AddCustomAsset';

const AddCustomAssetContainer: FC = () => {

  const { control, handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      tokenAddress: yup.string().required('Token address is required'),
      tokenName: yup.string().required('Token name is required'),
      tokenSymbol: yup.string().required('Token symbol is required'),
      tokenDecimals: yup.number().required('Token decimals is required'),

    }),
  });

  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>();


  const handleAddressChange = (value: string) => {
    setTokenAddress(value);
  }
  const handleNameChange = (value: string) => {
    setTokenName(value);
  }
  const handleSymbolChange = (value: string) => {
    setTokenSymbol(value);
  }
  const handleDecimalsChange = (value: number) => {
    setTokenDecimals(value);
  }

  const onSubmit = (data: any) => {
    console.log(data);
  }

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <AddCustomAsset  
        control={control}
        register={register}
        tokenAddress={tokenAddress}
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        handleAddressChange={handleAddressChange}
        handleNameChange={handleNameChange}
        handleSymbolChange={handleSymbolChange}
        handleDecimalsChange={handleDecimalsChange} 
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </Container>
  );
};

export default AddCustomAssetContainer;
