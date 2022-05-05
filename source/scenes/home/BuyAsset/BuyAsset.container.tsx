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

///////////////////////////
// Types
///////////////////////////

import IAssetListState from 'state/assets/types';
import { RootState } from 'state/store';
import IPriceState from 'state/price/types';
import { IBuyAssetContainer } from './types';

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
  const { fiat }: IPriceState = useSelector((state: RootState) => state.price);
  const selectedAsset = assets[assetId];
  const [amount, setAmount] = useState<string>(INITIAL_AMOUNT);
  const [message, setMessage] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [onlyDelete, setOnlyDelete] = useState<boolean>(false);

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
      // This value should be taken from the getQuote API call.
      const tokenAmount = floatAmount / fiat[selectedAsset.priceId].price;
      const formattedAmount = formatNumber(tokenAmount, 2, 4);
      setMessage(`≈ ${formattedAmount} ${selectedAsset.symbol}`);
      setButtonDisabled(false);
      setOnlyDelete(false);
    }
  }, [amount]);

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

  const handleConfirm = () => {
    console.log('handleConfirm with ', amount);
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
        handleItemClick={handleItemClick}
        handleConfirm={handleConfirm}
      />
    </Container>
  );
};

export default BuyAssetContainer;
