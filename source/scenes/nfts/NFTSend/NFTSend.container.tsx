import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import Container, { CONTAINER_COLOR } from 'components/Container';

import useGasNftEstimate from 'hooks/useGasNftEstimate';
import { useFiat } from 'hooks/usePrice';

import nftsHeader from 'navigation/headers/nfts';
import screens from 'navigation/screens';

import { formatNumber } from 'scenes/home/helpers';

import { validateAddress } from 'scripts/Background/controllers/EVMChainController/utils';

import nftSelectors from 'selectors/nftSelectors';
import walletsSelectors from 'selectors/walletsSelectors';

import { ITempNFTInfo } from 'state/nfts/types';
import { AssetType } from 'state/vault/types';

import { removeEthereumPrefix } from 'utils/addressUtil';
import { OPENSEA_ASSET_MAP } from 'utils/assetsUtil';
import { getWalletController } from 'utils/controllersUtils';
import { fixedNumber, smallestPowerOfTen } from 'utils/number';

import { ADDRESS_REQUIRED, INTEGER_REGEX_PATTERN, INVALID_ADDRESS, OWN_ADDRESS, QUANTITY_GREATER_ZERO, QUANTITY_LESS_MAX, QUANTITY_MUST_NUMBER, QUANTITY_REQUIRED } from './constants';
import NFTSend from './NFTSend';
import { INFTSend } from './types';

const NFTSendContainer: FC<INFTSend> = ({ navigation, route }) => {
  const { amount, logo } = route.params || {};
  const walletController = getWalletController();

  const activeWallet = useSelector(walletsSelectors.getActiveWallet);
  const selectedCollection = useSelector(nftSelectors.getSelectedCollection);
  const selectedNFTData = useSelector(nftSelectors.getSelectedNftData);
  const mainAsset = OPENSEA_ASSET_MAP[selectedCollection.chain];
  const isERC721 = selectedNFTData?.token_standard === AssetType.ERC721;

  const [toAddress, setToAddress] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const ethAddress = activeWallet?.assets?.find(asset => asset?.type === AssetType.Ethereum)?.address;

  const getFiatAmount = useFiat(true, mainAsset);

  useLayoutEffect(() => {
    navigation.setOptions(nftsHeader({ navigation, showLogo: false, showRefresh: false }));
  }, []);

  const { handleSubmit, register, control, errors, setValue, triggerValidation } = useForm({
    defaultValues: {
      quantity: '1',
      address: '',
    },
    validationSchema: yup.object().shape({
      quantity: yup
        .string()
        .test('number', QUANTITY_MUST_NUMBER, val => {
          if (val) {
            const regex = new RegExp(INTEGER_REGEX_PATTERN);
            return regex.test(val);
          }
          return true;
        })
        .test('valid', QUANTITY_GREATER_ZERO, val => {
          if (val) {
            return Number(val) > 0;
          }
          return true;
        })
        .test('max', `${QUANTITY_LESS_MAX} ${formatNumber(amount, 0, 0)}`, val => {
          if (!!val && !!amount) {
            return Number(val) <= amount;
          }
          return true;
        })
        .required(QUANTITY_REQUIRED),
      address: yup
        .string()
        .test('valid', INVALID_ADDRESS, val => {
          if (val) {
            return validateAddress(val);
          }
          return true;
        })
        .test('own', OWN_ADDRESS, val => {
          if (val) {
            return val !== ethAddress;
          }
          return true;
        })
        .required(ADDRESS_REQUIRED),
    }),
  });

  useEffect(() => {
    const hasErrors = !!errors?.address || !!errors?.quantity;
    const isDisabled = !toAddress?.length || !quantity || hasErrors;
    setButtonDisabled(isDisabled);
  }, [errors.address, errors.quantity, toAddress, quantity]);

  const { setSendAmount, setToEthAddress, estimateGasFee, gasSpeedLabel, gasFee, setGasPrice, gasPrices, gasPrice, gasLimit, digits } = useGasNftEstimate({
    chain: selectedCollection.chain,
    contractAddress: selectedNFTData?.contract,
    isERC721,
    toAddress,
    tokenId: selectedNFTData?.identifier,
    amount: Number(quantity),
  });

  const onGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
    val = fixedNumber(val, digits);
    setGasPrice(val as number);
    estimateGasFee(val as number);
  };

  const handleAddressChange = (value: string) => {
    setValue('address', value);
    setToAddress(value);
    setToEthAddress(value);
    triggerValidation('address');
  };

  const handleQuantityChange = (value: string) => {
    setValue('quantity', value);
    setQuantity(value);
    setSendAmount(Number(value));
    triggerValidation('quantity');
  };

  const onButtonPress = () => {
    // Check if wallet supports ETH
    const ethSupport = activeWallet.supportedAssets.includes(KeyringAssetType.ETH);
    if (ethSupport) {
      const tempNFTInfo: ITempNFTInfo = {
        nft: selectedNFTData,
        quantity: Number(quantity),
        to: toAddress,
        from: {
          label: activeWallet.label,
          address: ethAddress,
        },
        gas: {
          price: gasPrice,
          limit: gasLimit,
          fee: gasFee,
          symbol: mainAsset.symbol,
          fiatAmount: `${getFiatAmount(gasFee, 2, mainAsset.priceId)}`,
        },
      };

      walletController.nfts.setTempNFTInfo(tempNFTInfo);
      navigation.navigate(screens.nfts.nftsSendConfirm, {
        logo,
      });
    }
  };

  const handleQRscan = (address: string) => {
    if (typeof address === 'string') {
      const filteredAddress = removeEthereumPrefix(address);
      handleAddressChange(filteredAddress);
    }
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT} safeArea={false}>
      <NFTSend
        logo={logo}
        amount={amount}
        selectedNFT={selectedNFTData}
        isERC721={isERC721}
        quantity={quantity}
        address={toAddress}
        control={control}
        buttonDisabled={buttonDisabled}
        isValidAddress={validateAddress(toAddress)}
        handleQRscan={handleQRscan}
        onButtonPress={onButtonPress}
        register={register}
        handleSubmit={handleSubmit}
        onGasPriceChange={onGasPriceChange}
        handleAddressChange={handleAddressChange}
        handleQuantityChange={handleQuantityChange}
        errors={errors}
        gas={{
          prices: gasPrices,
          price: gasPrice,
          fee: gasFee,
          speedLabel: gasSpeedLabel,
          basePriceId: mainAsset.priceId,
          symbol: mainAsset.symbol,
          steps: smallestPowerOfTen(gasPrices[2]),
        }}
      />
    </Container>
  );
};

export default NFTSendContainer;
