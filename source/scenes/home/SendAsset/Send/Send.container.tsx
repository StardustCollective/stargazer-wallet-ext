///////////////////////////
// Modules
///////////////////////////
import React, { ChangeEvent, useState, useCallback, useMemo, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
// import { useAlert } from 'react-alert';
import * as yup from 'yup';
import { BigNumber, ethers } from 'ethers';
import { useLinkTo } from '@react-navigation/native';
import find from 'lodash/find';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Utils
///////////////////////////

import { checkOneDecimalPoint, getChangeAmount } from 'utils/sendUtil';
import { getAccountController } from 'utils/controllersUtils';
import { cancelEvent } from 'utils/backgroundUtils';
import { removeEthereumPrefix } from 'utils/addressUtil';

///////////////////////////
// Types
///////////////////////////

import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';
import IVaultState, { AssetType, IActiveAssetState, AssetBalances } from 'state/vault/types';
import { RootState } from 'state/store';

///////////////////////////
// Hooks
///////////////////////////

import { useFiat } from 'hooks/usePrice';
import useGasEstimate from 'hooks/useGasEstimate';

///////////////////////////
// Header
///////////////////////////

// import sendHeader from 'navigation/headers/send';

///////////////////////////
// Header
///////////////////////////

import Send from './Send';

// One billion is the max amount a user is allowed to send.
const MAX_AMOUNT_NUMBER = 1000000000;

interface IWalletSend {
  initAddress?: string;
  navigation: any;
}

const SendContainer: FC<IWalletSend> = ({ initAddress = '' }) => {
  const accountController = getAccountController();
  let isExternalRequest = false;

  if (!!location) {
    isExternalRequest = location.pathname.includes('sendTransaction');
  }

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let balances: AssetBalances;
  let to: string;
  let from: string;
  let value: string;
  let gas: string;
  let memo: string;
  let history;
  let windowId: string;
  let assetInfo: IAssetInfoState;

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  if (isExternalRequest) {
    const { data: dataJsonString, windowId: _windowId } = queryString.parse(location.search);

    windowId = _windowId as string;

    if (dataJsonString) {
      const params = JSON.parse(dataJsonString as string);
      to = params.to;
      value = params.value || 0;
      gas = params.gas;
      memo = params.data;
    }

    useEffect(() => {
      // Set initial gas
      const amount = parseInt(value, 16);
      setAmount(amount);

      const initialGas = parseInt(gas, 16);

      /**
       * TODO: @todo
       * The next line sets the gas price based on the gas limit estimation
       * those two units are completely unrelated, if we're unable to retrive
       * the gas oracle values, the user could an exagerated gas price set
       * as the two units do not correlate with each other one could say a normal
       * ERC20 call is 62850 gas units (gasLimit), if we set this value as a gas price
       * (gasPrice) in gwei. The total cost of the transaction would be 62850 * 62850 GWEI
       * which is 3.9501225 ETH. !!!
       */
      setGasPrice(initialGas);
      estimateGasFee(initialGas);
    }, []);

    history = useHistory();

    activeAsset = useSelector((state: RootState) => find(state.assets, { address: to })) as IAssetInfoState;

    if (!activeAsset) {
      activeAsset = useSelector((state: RootState) =>
        find(state.assets, { type: AssetType.Ethereum })
      ) as IAssetInfoState;
    }

    assetInfo = assets[activeAsset.id];

    from = activeAsset.address;
  } else {
    const vault: IVaultState = useSelector((state: RootState) => state.vault);
    activeAsset = vault.activeAsset;
    balances = vault.balances;
    assetInfo = assets[activeAsset.id];

    // Sets the header for the send screen
    // useLayoutEffect(() => {
    //   navigation.setOptions(sendHeader({ navigation, asset: assetInfo }));
    // }, []);
  }

  const getFiatAmount = useFiat(true, assetInfo);
  const linkTo = useLinkTo();
  // const alert = useAlert();

  const tempTx = accountController.getTempTx();

  const { setValue, control, handleSubmit, register, errors, setError, clearError } = useForm({
    validationSchema: yup.object().shape({
      address: yup.string().required('Error: Invalid DAG address'),
      amount: !isExternalRequest ? yup.mixed().transform(value => {
        const formattedValue = value.replace(/,/g, '.');
        if (isNaN(formattedValue)) return undefined;
        const floatNumber = parseFloat(formattedValue);
        return isNaN(floatNumber) || floatNumber <= 0 ? undefined : floatNumber;
      }).required('Error: Invalid DAG amount') : null,
      fee:
        (activeAsset.type === AssetType.Constellation || activeAsset.type === AssetType.LedgerConstellation)
          ? yup.mixed().transform(value => {
            const formattedValue = value.replace(/,/g, '.');
            if (isNaN(formattedValue)) return undefined;
            const floatNumber = parseFloat(formattedValue);
            return isNaN(floatNumber) ? undefined : floatNumber;
          }).required('Error: Invalid transaction fee')
          : yup.mixed(),
    }),
  });

  const [address, setAddress] = useState(initAddress || tempTx?.toAddress || to || '');

  const [amount, setAmount] = useState<number | string>(tempTx?.amount ? Number(tempTx?.amount) : 0);
  const [amountBN, setAmountBN] = useState(ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals));
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);
  const [decimalPointOnAmount, setDecimalPointOnAmount] = useState<boolean>(false);
  const [decimalPointOnFee, setDecimalPointOnFee] = useState<boolean>(false);

  const isValidAddress = useMemo(() => {
    if (activeAsset.type === AssetType.Constellation || activeAsset.type === AssetType.LedgerConstellation) return accountController.isValidDAGAddress(address);
    return accountController.isValidERC20Address(address);
  }, [address]);

  const {
    setToEthAddress,
    setGasPrice,
    setSendAmount,
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    gasLimit,
    gasPrice,
    gasPrices,
  } = useGasEstimate({
    toAddress: tempTx?.toAddress || to,
    fromAddress: activeAsset.address,
    asset: assetInfo,
    data: memo,
    gas,
  });

  const onSubmit = async (data: any) => {
    if (!isValidAddress) {
      // alert.removeAll();
      // alert.error('Error: Invalid recipient address');
      return;
    }
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset.address || from,
      toAddress: data.address || to,
      timestamp: Date.now(),
      amount: String(amount) || '0',
      fee: data.fee || gasFee,
    };
    if (activeAsset.type === AssetType.Ethereum || activeAsset.type === AssetType.ERC20) {
      txConfig.ethConfig = {
        gasPrice,
        gasLimit,
        memo,
      };
    }

    accountController.updateTempTx(txConfig);

    if (isExternalRequest) {
      history.push(`/confirmTransaction?to=${txConfig.toAddress}&windowId=${windowId}`);
    } else {
      linkTo('/send/confirm');
    }
  };

  const handleClose = async () => {
    if (isExternalRequest) {
      await cancelEvent(windowId);
      if (window) {
        window.close();
      }
    } else {
      linkTo('/asset');
    }
  };

  const getBalanceAndFees = () => {
    let balance;
    let balanceBN;
    let txFee;
    try {
      if (balances) {
        balance = balances[activeAsset.id] || '0';
        balanceBN = ethers.utils.parseUnits(balance.toString(), assetInfo.decimals);
      }

      txFee =
        activeAsset.id === AssetType.Constellation || activeAsset.id === AssetType.LedgerConstellation
          ? ethers.utils.parseUnits(fee, assetInfo.decimals)
          : ethers.utils.parseEther(gasFee.toString());

      clearError('fee');
    } catch (err) {
      setError('fee', 'badFee', 'Please enter a valid transaction fee.');
    }

    return { balance: balanceBN, txFee };
  };

  const isDisabled = useMemo(() => {
    const { balance, txFee } = getBalanceAndFees();

    let computedAmount: BigNumber;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = amountBN;
    } else if (txFee) {
      computedAmount = amountBN.add(txFee);
    }

    if (isExternalRequest) {
      return !isValidAddress || !fee || !address;
    }

    let formattedAmount: number;
    if (typeof amount === 'string') {
      formattedAmount = parseFloat(amount);
    } else {
      formattedAmount = amount;
    }
    
    if (isNaN(formattedAmount)) return true;
    
    return !isValidAddress ||
      !amount ||
      !fee ||
      !address ||
      !balance ||
      !computedAmount ||
      !!Object.values(errors).length ||
      balance.lt(0) ||
      computedAmount.gt(balance);
  }, [amountBN, address, fee, gasFee, errors, amount]);

  const handleAmountChange = useCallback(
    (changeVal: string) => {
      const formattedValue = changeVal.replace(/,/g, '.');
      const decimalPointEntered = checkOneDecimalPoint(formattedValue);
      setDecimalPointOnAmount(decimalPointEntered);
      const changeAmount = getChangeAmount(formattedValue, MAX_AMOUNT_NUMBER, assetInfo.decimals);
      if (changeAmount === null) return;

      setAmount(changeAmount);
      setSendAmount(changeAmount);

      if (changeAmount !== amount) {
        let bigNumberAmount: BigNumber | null = null;
        try {
          bigNumberAmount = ethers.utils.parseUnits(changeAmount, assetInfo.decimals);
        } catch (err) {
          setError('amount', 'badAmount', 'Please enter a valid DAG amount.');
        }
        if (bigNumberAmount !== null) {
          clearError('amount');
          setAmountBN(bigNumberAmount);
        }
      }
    },
    [address, gasLimit]
  );

  const handleFeeChange = useCallback((ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = ev.target.value;
    const formattedValue = val.replace(/,/g, '.');
    const decimalPointEntered = checkOneDecimalPoint(formattedValue);
    setDecimalPointOnFee(decimalPointEntered);
    if (!isNaN(parseFloat(formattedValue)) && (parseFloat(formattedValue) === 0 || parseFloat(formattedValue) >= 0.00000001)) {
      setFee(formattedValue);
      estimateGasFee(gasPrice);
    }
  }, []);

  const handleAddressChange = useCallback((ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const toAddress = ev.target.value.trim();
    setAddress(toAddress);
    setToEthAddress(toAddress);
    estimateGasFee(gasPrice);
  }, []);

  const handleGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
    setGasPrice(val as number);
    estimateGasFee(val as number);
  };

  const handleGetDAGTxFee = () => {
    accountController.getRecommendFee().then((val) => {
      setRecommend(val);
      setFee(val.toString());
    });
  };

  const handleSelectContact = (val: string) => {
    const filteredAddress = removeEthereumPrefix(val);
    setValue('address', filteredAddress);
    setAddress(filteredAddress);
    setToEthAddress(filteredAddress);
    setModalOpen(false);
  };

  const handleSetMax = () => {
    const { balance, txFee } = getBalanceAndFees();

    let computedAmount;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = balance;
    } else if (txFee) {
      computedAmount = balance.sub(txFee);
    }

    if (computedAmount && computedAmount.lt(0)) {
      computedAmount = BigNumber.from(0);
    }
    const formattedUnits = ethers.utils.formatUnits(computedAmount, assetInfo.decimals);
    setValue('amount', formattedUnits.toString());
    handleAmountChange(formattedUnits);
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <Send
        control={control}
        modalOpened={modalOpened}
        setModalOpen={setModalOpen}
        handleSelectContact={handleSelectContact}
        handleSubmit={handleSubmit}
        handleAddressChange={handleAddressChange}
        handleAmountChange={handleAmountChange}
        handleSetMax={handleSetMax}
        handleFeeChange={handleFeeChange}
        handleGetDAGTxFee={handleGetDAGTxFee}
        handleGasPriceChange={handleGasPriceChange}
        handleClose={handleClose}
        onSubmit={onSubmit}
        isExternalRequest={isExternalRequest}
        isDisabled={isDisabled}
        isValidAddress={isValidAddress}
        balances={balances}
        activeAsset={activeAsset}
        assetInfo={assetInfo}
        address={address}
        register={register}
        amount={amount}
        getFiatAmount={getFiatAmount}
        errors={errors}
        fee={fee}
        recommend={recommend}
        gasPrices={gasPrices}
        gasPrice={gasPrice}
        gasFee={gasFee}
        gasSpeedLabel={gasSpeedLabel}
        decimalPointOnAmount={decimalPointOnAmount}
        decimalPointOnFee={decimalPointOnFee}
      />
    </Container>
  );
};

export default SendContainer;
