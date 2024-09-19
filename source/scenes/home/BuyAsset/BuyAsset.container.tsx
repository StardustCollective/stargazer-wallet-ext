///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import BuyAsset from './BuyAsset';

///////////////////////////
// Utils
///////////////////////////

import { formatNumber } from 'scenes/home/helpers';
import { v4 as uuid } from 'uuid';
import { open } from 'utils/browser';

///////////////////////////
// Types
///////////////////////////

import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import IProvidersState, {
  GetBestDealRequest,
  GetQuoteRequest,
  IProviderInfoState,
  PaymentRequestBody,
  Providers,
  StargazerProviderAsset,
} from 'state/providers/types';
import { IBuyAssetContainer } from './types';
import {
  C14_BASE_URL,
  C14_CLIENT_ID,
  SIMPLEX_FORM_SUBMISSION_URL,
} from 'constants/index';
import IVaultState, { AssetType } from 'state/vault/types';
import { getAccountController } from 'utils/controllersUtils';
import { IMenuItem } from 'components/Menu/types';
import { getDagAddress, getEthAddress } from 'utils/wallet';

///////////////////////////
// Constants
///////////////////////////

const INITIAL_AMOUNT = '100';
const MINIMUM_AMOUNT = 50;
const MAXIMUM_AMOUNT = 20000;
const MINIMUM_AMOUNT_MESSAGE = 'Minimum amount is $50';
const MAXIMUM_AMOUNT_MESSAGE = 'Maximum amount is $20000';
const DEFAULT_ERROR_MESSAGE = 'There was an error. Please try again later.';

const BuyAssetContainer: FC<IBuyAssetContainer> = ({ navigation, route }) => {
  const assetId = route.params.selected;
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const { defaultTokens }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const { supportedAssets, response, list, selected, paymentRequest }: IProvidersState =
    useSelector((state: RootState) => state.providers);
  const selectedAsset: IAssetInfoState =
    assets[assetId] ?? defaultTokens?.data[assetId] ?? ({} as IAssetInfoState);
  const [amount, setAmount] = useState<string>(INITIAL_AMOUNT);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [onlyDelete, setOnlyDelete] = useState<boolean>(false);
  const [isProviderSelectorOpen, setIsProviderSelectorOpen] = useState<boolean>(false);
  const accountController = getAccountController();
  const { bestDealCompleted } = response;
  const buttonLoading = paymentRequest.loading || loading;

  const isProviderSupported = (providerId: string) => {
    return !!supportedAssets?.data?.find(
      (item) =>
        item.symbol === selectedAsset.symbol &&
        item?.providers?.includes(providerId as Providers)
    );
  };

  const getStargazerProviderAsset = (): StargazerProviderAsset => {
    return supportedAssets?.data?.find((item) => item.symbol === selectedAsset.symbol);
  };

  const selectedProviderSupported = isProviderSupported(selected.id);
  const isErrorMessage = !!message && !message.includes('≈');

  const getActiveAddress = (): string | null => {
    if (selectedAsset.type === AssetType.Constellation) {
      return getDagAddress(activeWallet);
    }

    if ([AssetType.Ethereum, AssetType.ERC20].includes(selectedAsset.type)) {
      return getEthAddress(activeWallet);
    }

    return null;
  };

  useEffect(() => {
    navigation.setOptions({ title: `Buy ${selectedAsset.symbol}` });

    return () => {
      accountController.assetsController.clearBestDeal();
      accountController.assetsController.clearResponse();
    };
  }, []);

  useEffect(() => {
    if (!selectedProviderSupported) {
      const c14Provider = list[Providers.C14];
      const simplexProvider = list[Providers.Simplex];
      const updatedProvider =
        selected.id === Providers.Simplex ? c14Provider : simplexProvider;
      handleProviderSwitch(updatedProvider);
    }
  }, [selectedProviderSupported]);

  const getTokenId = (provider: Providers): string => {
    if (!supportedAssets?.data?.length || !selectedAsset?.symbol) return '';

    if (provider === Providers.Simplex) {
      return selectedAsset.symbol;
    }

    const token = supportedAssets.data.find(
      (asset) =>
        asset.symbol === selectedAsset.symbol && asset.providers.includes(Providers.C14)
    );
    if (!token) return '';

    return token.id;
  };

  const getQuote = async (provider: Providers, amount: number) => {
    // Skip quote request if the last quote response has the same provider & amount
    if (
      provider === response?.data?.provider &&
      amount?.toString() === response?.data?.requested_amount
    )
      return;

    const digitalCurrency = getTokenId(provider);

    if (!digitalCurrency) return;

    const randomId = uuid();
    const quoteData: GetQuoteRequest = {
      id: randomId,
      provider,
      requested_amount: amount,
      digital_currency: digitalCurrency,
    };
    accountController.assetsController.setRequestId(randomId);
    await accountController.assetsController.fetchQuote(quoteData);
  };

  useEffect(() => {
    const fetchDeal = async () => {
      const stargazerAsset = getStargazerProviderAsset();
      if (!stargazerAsset) return;

      const { providers } = stargazerAsset;
      if (!providers.length) return;

      const request: GetBestDealRequest = providers.reduce(
        (acc: GetBestDealRequest, provider: Providers) => {
          acc[provider] = {
            digital_currency: getTokenId(provider as Providers),
            amount: Number(INITIAL_AMOUNT),
          };
          return acc;
        },
        {}
      );

      await accountController.assetsController.fetchBestDeal(request);
    };

    if (!bestDealCompleted) {
      fetchDeal();
    }
  }, [bestDealCompleted]);

  useEffect(() => {
    const floatAmount = parseFloat(amount);
    if (floatAmount < MINIMUM_AMOUNT) {
      setMessage(MINIMUM_AMOUNT_MESSAGE);
      setButtonDisabled(true);
      setOnlyDelete(false);
    } else if (floatAmount > MAXIMUM_AMOUNT) {
      setMessage(MAXIMUM_AMOUNT_MESSAGE);
      setButtonDisabled(true);
      setOnlyDelete(true);
    } else {
      if (selectedProviderSupported && bestDealCompleted) {
        getQuote(selected.id as Providers, floatAmount);
      }
      if (!selectedProviderSupported) {
        setButtonDisabled(true);
      }
    }
  }, [amount, selected, selectedProviderSupported, bestDealCompleted]);

  useEffect(() => {
    const floatAmount = parseFloat(amount);
    if (floatAmount >= MINIMUM_AMOUNT && floatAmount <= MAXIMUM_AMOUNT) {
      if (response.loading) {
        setButtonDisabled(true);
        setOnlyDelete(false);
      } else {
        if (response?.data?.token_amount) {
          const tokenAmount = Number(response?.data?.token_amount);
          const formattedAmount = formatNumber(tokenAmount, 2, 4);
          setMessage(`≈ ${formattedAmount} ${selectedAsset.symbol}`);
          setButtonDisabled(false);
          setOnlyDelete(false);
        }
      }
    }
  }, [response.loading, response.data?.token_amount]);

  useEffect(() => {
    const payment_id = paymentRequest?.data?.payment_id;
    const openBrowser = async (url: string): Promise<void> => {
      await open(url);
      accountController.assetsController.clearPaymentRequest();
    };

    if (payment_id) {
      openBrowser(`${SIMPLEX_FORM_SUBMISSION_URL}${payment_id}`);
    }
  }, [paymentRequest?.data]);

  useEffect(() => {
    if (response.error || paymentRequest.error) {
      accountController.assetsController.clearErrors();
      setError(DEFAULT_ERROR_MESSAGE);
      setMessage('');
    }
  }, [response.error, paymentRequest.error]);

  const removeChar = () => {
    setAmount(amount.slice(0, -1));
    // When user deletes the last char we're setting default value to 0.
    if (amount.length === 1) {
      setAmount('0');
    }
  };

  const addChar = (char: string) => {
    if (amount === '0' && char !== '.') {
      setAmount(char);
    } else {
      setAmount(`${amount}${char}`);
    }
  };

  const handleItemClick = (value: string) => {
    if (onlyDelete && value !== 'del') return;
    if (value === 'del') {
      removeChar();
    } else {
      // Initial scenario.
      if (amount === '0.00' && value !== '.') {
        setAmount(value);
        return;
      }
      // User should be able to enter only one '.' char and
      // decimals should be less than 2.
      if (amount.indexOf('.') !== -1) {
        const decimals = amount.split('.')[1];
        if (value === '.' || decimals.length >= 2) {
          return;
        }
      }
      addChar(value);
    }
  };

  const generateC14Link = (
    clientId: string,
    sourceAmount: string,
    targetAddress: string,
    targetAssetId: string
  ): string => {
    const params = new URLSearchParams({
      clientId,
      sourceAmount,
      sourceCurrencyCode: 'USD',
      targetAddress,
      targetAssetId,
      targetAssetIdLock: 'true',
    });

    return `${C14_BASE_URL}?${params.toString()}`;
  };

  const confirmC14 = async () => {
    const address = getActiveAddress();
    const tokenId = getTokenId(Providers.C14);
    if (!address || !tokenId) return;

    const url = generateC14Link(C14_CLIENT_ID, amount, address, tokenId);
    await open(url);
  };

  const confirmSimplex = async () => {
    const address = getActiveAddress();
    const tokenId = getTokenId(Providers.Simplex);
    const quote_id = response?.data?.quote_id;
    const user_id = response?.data?.user_id;
    if (!address || !tokenId || !quote_id || !user_id) return;

    const requestData: PaymentRequestBody = {
      provider: Providers.Simplex,
      address,
      digital_currency: tokenId,
      quote_id,
      user_id,
    };
    await accountController.assetsController.fetchPaymentRequest(requestData);
  };

  const handleConfirm = async () => {
    setLoading(true);
    // Asset will be added only if it doesn't exist as an active asset.
    await accountController.assetsController.addAssetFn(selectedAsset);
    setTimeout(async () => {
      switch (selected.id) {
        case Providers.C14:
          await confirmC14();
          setLoading(false);
          return;
        case Providers.Simplex:
          await confirmSimplex();
          setLoading(false);
          return;
        default:
          return;
      }
    }, 2000);
  };

  const handleProviderSwitch = (provider: IProviderInfoState) => {
    accountController.assetsController.setSelectedProvider(provider);
    setIsProviderSelectorOpen(false);
  };

  const providersItems: IMenuItem[] = Object.values(list).map((provider) => ({
    title: provider.label,
    icon: provider.logo,
    onClick: () => handleProviderSwitch(provider),
    showArrow: false,
    selected: selected.id === provider.id,
    disabled: !supportedAssets?.data?.find(
      (item) =>
        item.symbol === selectedAsset.symbol &&
        item?.providers?.includes(provider.id as Providers)
    ),
  }));

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false} color={CONTAINER_COLOR.EXTRA_LIGHT}>
      <BuyAsset
        error={error}
        setError={setError}
        amount={amount}
        message={message}
        isErrorMessage={isErrorMessage}
        buttonDisabled={buttonDisabled}
        buttonLoading={buttonLoading}
        handleItemClick={handleItemClick}
        handleConfirm={handleConfirm}
        provider={selected}
        response={response}
        providersItems={providersItems}
        isProviderSelectorOpen={isProviderSelectorOpen}
        setIsProviderSelectorOpen={setIsProviderSelectorOpen}
      />
    </Container>
  );
};

export default BuyAssetContainer;
