///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState, useEffect } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////////
// Components
///////////////////////////

import AddCustomAsset from './AddCustomAsset';
import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import IERC20AssetsListState, { ICustomAssetForm } from 'state/erc20assets/types';

///////////////////////////
// Utils
///////////////////////////

import { validateAddress } from 'scripts/Background/controllers/EVMChainController/utils';
import { getAccountController } from 'utils/controllersUtils';
import { removeEthereumPrefix } from 'utils/addressUtil';

///////////////////////////
// Constants
///////////////////////////

import screens from 'navigation/screens';
import {
  AVALANCHE_LOGO,
  BSC_LOGO,
  CONSTELLATION_LOGO,
  DAG_NETWORK,
  ETHEREUM_LOGO,
  POLYGON_LOGO,
  URL_REGEX_PATTERN,
} from 'constants/index';

const AddCustomAssetContainer: FC<{ navigation: any }> = ({ navigation }) => {
  const { customAssetForm }: IERC20AssetsListState = useSelector(
    (state: RootState) => state.erc20assets
  );

  const [networkType, setNetworkType] = useState<string>('main2');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [l0endpoint, setL0endpoint] = useState<string>('');
  const [l1endpoint, setL1endpoint] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const accountController = getAccountController();
  const linkTo = useLinkTo();

  const isL0Token = [
    DAG_NETWORK.main2.id,
    DAG_NETWORK.test2.id,
    DAG_NETWORK.integration2.id,
    DAG_NETWORK.local2.id,
  ].includes(networkType);

  let { control, handleSubmit, register, setValue, setError, triggerValidation, errors } =
    useForm({
      validationSchema: yup.object().shape({
        tokenAddress: yup
          .string()
          .test('valid', 'Invalid token address', (val) => validateAddress(val))
          .required('Token address is required'),
        tokenName: yup.string().required('Token name is required'),
        tokenSymbol: yup
          .string()
          .test('len', 'Symbol must be 11 characters or fewer', (val) => val.length <= 11)
          .required('Token symbol is required'),
        tokenDecimals: yup
          .string()
          .test('decimals', 'Decimals must be at least 0, and not over 36', (val) => {
            const numVal = parseInt(val);
            return !isNaN(numVal) && numVal >= 0 && numVal <= 36;
          })
          .required('Token decimals is required'),
      }),
    });

  const {
    control: controlDAG,
    handleSubmit: handleSubmitDAG,
    register: registerDAG,
    setValue: setValueDAG,
    setError: setErrorDAG,
    triggerValidation: triggerValidationDAG,
    errors: errorsDAG,
  } = useForm({
    validationSchema: yup.object().shape({
      tokenAddress: yup
        .string()
        .test('valid', 'Invalid L0 token address', async (val) => {
          return accountController.isValidDAGAddress(val);
        })
        .test('validMetagraph', 'Metagraph address not found', async (val) => {
          if (val?.length === 40) {
            return accountController.isValidMetagraphAddress(val);
          }

          return true;
        })
        .required('Token address is required'),
      l0endpoint: yup
        .string()
        .test('validURL', 'Please enter a valid URL', (val) => {
          const regex = new RegExp(URL_REGEX_PATTERN);
          return regex.test(val);
        })
        .test('validNode', 'L0 endpoint not found', (val) => {
          if (!!val) {
            return accountController.isValidNode(val);
          }

          return true;
        })
        .required('L0 endpoint is required'),
      l1endpoint: yup
        .string()
        .test('validURL', 'Please enter a valid URL', (val) => {
          const regex = new RegExp(URL_REGEX_PATTERN);
          return regex.test(val);
        })
        .test('validNode', 'L1 endpoint not found', (val) => {
          if (!!val) {
            return accountController.isValidNode(val);
          }

          return true;
        })
        .required('L1 endpoint is required'),
      tokenName: yup.string().required('Token name is required'),
      tokenSymbol: yup
        .string()
        .test('len', 'Symbol must be 11 characters or fewer', (val) => val.length <= 11)
        .required('Token symbol is required'),
    }),
  });

  if (isL0Token) {
    control = controlDAG;
    handleSubmit = handleSubmitDAG;
    register = registerDAG;
    setValue = setValueDAG;
    setError = setErrorDAG;
    triggerValidation = triggerValidationDAG;
    errors = errorsDAG;
  }

  useEffect(() => {
    const {
      tokenAddress: address,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: decimals,
    } = customAssetForm;

    if (tokenAddress !== address) {
      setTokenAddress(address);
      setValue('tokenAddress', address);
    }
    if (tokenName !== name) {
      handleNameChange(name);
    }
    if (tokenSymbol !== symbol) {
      handleSymbolChange(symbol);
    }
    if (tokenDecimals !== decimals) {
      handleDecimalsChange(decimals);
    }
  }, [customAssetForm.tokenAddress]);

  useEffect(() => {
    const hasErrors = !!Object.keys(errors)?.length;
    const otherChecks = isL0Token
      ? l0endpoint === '' || l1endpoint === ''
      : tokenDecimals === '';
    const disabled =
      hasErrors ||
      tokenAddress === '' ||
      tokenName === '' ||
      tokenSymbol === '' ||
      otherChecks;
    setButtonDisabled(disabled);
  }, [
    Object.keys(errors),
    tokenAddress,
    l0endpoint,
    l1endpoint,
    tokenName,
    tokenSymbol,
    tokenDecimals,
  ]);

  const handleAddressChange = async (value: string) => {
    setValue('tokenAddress', value);
    setTokenAddress(value);
    triggerValidation('tokenAddress');
    if (!isL0Token) {
      await accountController.fetchCustomToken(value, networkType);
    }
  };

  const handleL0endpointChange = (value: string) => {
    setValue('l0endpoint', value);
    setL0endpoint(value);
    triggerValidation('l0endpoint');
  };

  const handleL1endpointChange = (value: string) => {
    setValue('l1endpoint', value);
    setL1endpoint(value);
    triggerValidation('l1endpoint');
  };

  const handleNameChange = (value: string) => {
    setValue('tokenName', value);
    setTokenName(value);
    triggerValidation('tokenName');
  };

  const handleSymbolChange = (value: string) => {
    setValue('tokenSymbol', value);
    setTokenSymbol(value);
    triggerValidation('tokenSymbol');
  };

  const handleDecimalsChange = (value: string) => {
    setValue('tokenDecimals', value);
    setTokenDecimals(value);
    triggerValidation('tokenDecimals');
  };

  const handleAddressScan = async (address: string) => {
    const filteredAddress = removeEthereumPrefix(address);
    await handleAddressChange(filteredAddress);
  };

  const onSubmit = async (asset: ICustomAssetForm): Promise<void> => {
    const {
      tokenAddress,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      l0endpoint,
      l1endpoint,
    } = asset;

    setButtonLoading(true);
    setButtonDisabled(true);

    if (!isL0Token) {
      if (!validateAddress(tokenAddress)) {
        setError('tokenAddress', 'invalidAddress', 'Invalid token address');
        return;
      }

      await accountController.assetsController.addCustomERC20Asset(
        networkType,
        tokenAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals
      );
    } else {
      const isValidDagAddress = await accountController.isValidDAGAddress(tokenAddress);
      const isValidMetagraphAddress = await accountController.isValidMetagraphAddress(
        tokenAddress
      );
      if (!isValidDagAddress) {
        setError('tokenAddress', 'invalidAddress', 'Invalid L0 token address');
        return;
      }

      if (!isValidMetagraphAddress) {
        setError('tokenAddress', 'invalidAddress', 'Metagraph address not found');
        return;
      }

      await accountController.assetsController.addCustomL0Token(
        l0endpoint,
        l1endpoint,
        tokenAddress,
        tokenName,
        tokenSymbol
      );
    }
    linkTo('/home');
    accountController.assetsController.clearCustomToken();
  };

  const handleNetworkTypeChange = (value: string) => {
    if (value !== networkType) {
      navigation.goBack();
      setNetworkType(value);
      setValue('tokenAddress', '');
      setValue('l0endpoint', '');
      setValue('l1endpoint', '');
      setValue('tokenName', '');
      setValue('tokenSymbol', '');
      setValue('tokenDecimals', '');
      setTokenAddress('');
      setTokenName('');
      setL0endpoint('');
      setL1endpoint('');
      setTokenSymbol('');
      setTokenDecimals('');
    }
  };

  const navigateToSingleSelect = () => {
    navigation.navigate(screens.authorized.singleSelect, {
      title: 'Select Network',
      data: networkTypeOptions.items,
      selected: networkType,
      onSelect: handleNetworkTypeChange,
    });
  };

  const networkTypeOptions = {
    title: 'Network type',
    value: networkType,
    items: [
      // 349: New network should be added here.
      { value: 'main2', label: 'Constellation', icon: CONSTELLATION_LOGO },
      { value: 'mainnet', label: 'Ethereum', icon: ETHEREUM_LOGO },
      { value: 'avalanche-mainnet', label: 'Avalanche', icon: AVALANCHE_LOGO },
      { value: 'bsc', label: 'Binance Smart Chain', icon: BSC_LOGO },
      { value: 'matic', label: 'Polygon', icon: POLYGON_LOGO },
    ],
    onClick: navigateToSingleSelect,
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT}>
      <AddCustomAsset
        control={control}
        register={register}
        tokenAddress={tokenAddress}
        l0endpoint={l0endpoint}
        l1endpoint={l1endpoint}
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        isL0Token={isL0Token}
        networkTypeOptions={networkTypeOptions}
        handleAddressScan={handleAddressScan}
        handleAddressChange={handleAddressChange}
        handleL0endpointChange={handleL0endpointChange}
        handleL1endpointChange={handleL1endpointChange}
        handleNameChange={handleNameChange}
        handleSymbolChange={handleSymbolChange}
        handleDecimalsChange={handleDecimalsChange}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        buttonDisabled={buttonDisabled}
        buttonLoading={buttonLoading}
      />
    </Container>
  );
};

export default AddCustomAssetContainer;
