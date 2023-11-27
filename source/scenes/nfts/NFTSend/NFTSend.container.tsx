import React, { FC, useState, useEffect, useLayoutEffect } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import NFTSend from './NFTSend';
import { INFTSend } from './types';
import { useSelector } from 'react-redux';
import nftSelectors from 'selectors/nftSelectors';
import { useFiat } from 'hooks/usePrice';
import { AssetType } from 'state/vault/types';
import useGasNftEstimate from 'hooks/useGasNftEstimate';
import { OPENSEA_ASSET_MAP } from 'utils/assetsUtil';
import { validateAddress } from 'scripts/Background/controllers/EVMChainController/utils';
import { removeEthereumPrefix } from 'utils/addressUtil';
import screens from 'navigation/screens';
import { getWalletController } from 'utils/controllersUtils';
import { ITempNFTInfo } from 'state/nfts/types';
import walletsSelectors from 'selectors/walletsSelectors';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';
import nftsHeader from 'navigation/headers/nfts';
import { formatNumber } from 'scenes/home/helpers';
import {
  ADDRESS_REQUIRED,
  INTEGER_REGEX_PATTERN,
  INVALID_ADDRESS,
  OWN_ADDRESS,
  QUANTITY_GREATER_ZERO,
  QUANTITY_LESS_MAX,
  QUANTITY_MUST_NUMBER,
  QUANTITY_REQUIRED,
} from './constants';

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

  const ethAddress = activeWallet?.assets?.find(
    (asset) => asset?.type === AssetType.Ethereum
  )?.address;

  const getFiatAmount = useFiat(true, mainAsset);

  useLayoutEffect(() => {
    navigation.setOptions(
      nftsHeader({ navigation, showLogo: false, showRefresh: false })
    );
  }, []);

  const { handleSubmit, register, control, errors, setValue, triggerValidation } =
    useForm({
      defaultValues: {
        quantity: '1',
        address: '',
      },
      validationSchema: yup.object().shape({
        quantity: yup
          .string()
          .test('number', QUANTITY_MUST_NUMBER, (val) => {
            if (!!val) {
              const regex = new RegExp(INTEGER_REGEX_PATTERN);
              return regex.test(val);
            }
            return true;
          })
          .test('valid', QUANTITY_GREATER_ZERO, (val) => {
            if (!!val) {
              return Number(val) > 0;
            }
            return true;
          })
          .test('max', `${QUANTITY_LESS_MAX} ${formatNumber(amount, 0, 0)}`, (val) => {
            if (!!val && !!amount) {
              return Number(val) <= amount;
            }
            return true;
          })
          .required(QUANTITY_REQUIRED),
        address: yup
          .string()
          .test('valid', INVALID_ADDRESS, (val) => {
            if (!!val) {
              return validateAddress(val);
            }
            return true;
          })
          .test('own', OWN_ADDRESS, (val) => {
            if (!!val) {
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

  const {
    setSendAmount,
    setToEthAddress,
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    setGasPrice,
    gasPrices,
    gasPrice,
    gasLimit,
  } = useGasNftEstimate({
    chain: selectedCollection.chain,
    contractAddress: selectedNFTData?.contract,
    isERC721,
    toAddress: toAddress,
    tokenId: selectedNFTData?.identifier,
    amount: Number(quantity),
  });

  const onGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
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
        mainAsset={mainAsset}
        errors={errors}
        gas={{
          prices: gasPrices,
          price: gasPrice,
          fee: gasFee,
          speedLabel: gasSpeedLabel,
          basePriceId: mainAsset.priceId,
        }}
      />
    </Container>
  );
};

export default NFTSendContainer;
