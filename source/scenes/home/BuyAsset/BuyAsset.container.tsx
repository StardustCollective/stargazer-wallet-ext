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
import { getQuote, paymentRequest as paymentRequestDispatch } from 'state/providers/api';
import { v4 as uuid } from 'uuid';
import { open } from 'utils/browser';

///////////////////////////
// Types
///////////////////////////

import IAssetListState from 'state/assets/types';
import store, { RootState } from 'state/store';
import IProvidersState, { PaymentRequestBody } from 'state/providers/types';
import { showAlert } from 'utils/alertUtil';
import { clearErrors, clearPaymentRequest, setRequestId } from 'state/providers';
import { IBuyAssetContainer } from './types';
import { SIMPLEX_FORM_SUBMISSION_URL } from 'constants/index';
import IVaultState from 'state/vault/types';

///////////////////////////
// Constants
///////////////////////////

const INITIAL_AMOUNT = '0.00';
const MINIMUM_AMOUNT = 50;
const MAXIMUM_AMOUNT = 20000;
const MINIMUM_AMOUNT_MESSAGE = 'Minimum amount is $50';
const MAXIMUM_AMOUNT_MESSAGE = 'Maximum amount is $20000';

const BuyAssetContainer: FC<IBuyAssetContainer> = ({ navigation, route }) => {
  const assetId = route.params.selected;
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const { response, selected, paymentRequest }: IProvidersState = useSelector((state: RootState) => state.providers);
  const selectedAsset = assets[assetId];
  const [amount, setAmount] = useState<string>(INITIAL_AMOUNT);
  const [message, setMessage] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [onlyDelete, setOnlyDelete] = useState<boolean>(false);

  const getActiveAddress = (): string => {
    const currentAsset = activeWallet.assets.find((asset) => asset.id === assetId);
    return currentAsset.address;
  }

  useEffect(() => {
    navigation.setOptions({ title: `Buy ${selectedAsset.symbol}` });
  }, []);

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
      const randomId = uuid();
      store.dispatch(setRequestId(randomId));
      store.dispatch<any>(getQuote({ id: randomId, provider: selected.id, requested_amount: floatAmount, digital_currency: selectedAsset.symbol }));
    }
  }, [amount]);

  useEffect(() => {
    const floatAmount = parseFloat(amount);
    if (floatAmount >= MINIMUM_AMOUNT && floatAmount <= MAXIMUM_AMOUNT) {
      if (response.loading) {
        setButtonDisabled(true);
        setOnlyDelete(false);
      } else {
        if (response?.data?.digital_money) {
          console.log('Entre', response);
          const tokenAmount = response?.data?.digital_money?.amount;
          const formattedAmount = formatNumber(tokenAmount, 2, 4);
          setMessage(`≈ ${formattedAmount} ${selectedAsset.symbol}`);
          setButtonDisabled(false);
          setOnlyDelete(false);
        }
      }
    }
  }, [response.loading, response.data?.digital_money]);

  useEffect(() => {
    const payment_id = paymentRequest?.data?.payment_id;
    const openBrowser = async (url: string): Promise<void> => {
      await open(url);
      store.dispatch(clearPaymentRequest());
    }

    if (payment_id) {
      openBrowser(`${SIMPLEX_FORM_SUBMISSION_URL}${payment_id}`)
    }
  }, [paymentRequest?.data]);

  useEffect(() => {
    if (response.data?.message === 'Internal Error') {
      showAlert(response.data.message, 'danger');
      store.dispatch(clearErrors());
    }
  }, [response.data?.message]);

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

  const handleConfirm = async () => {
    const requestData: PaymentRequestBody = {
      provider: selected.id,
      address: getActiveAddress(),
      digital_currency: selectedAsset.symbol,
      quote_id: response?.data?.quote_id,
      user_id: response?.data?.user_id,
    };
    store.dispatch<any>(paymentRequestDispatch(requestData));
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container safeArea={false} color={CONTAINER_COLOR.EXTRA_LIGHT}>
      <BuyAsset
        amount={amount}
        message={message}
        buttonDisabled={buttonDisabled}
        buttonLoading={paymentRequest.loading}
        handleItemClick={handleItemClick}
        handleConfirm={handleConfirm}
        provider={selected}
        response={response}
      />
    </Container>
  );
};

export default BuyAssetContainer;
