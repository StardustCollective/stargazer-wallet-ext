import React, { ChangeEvent, useState, useCallback, useMemo, FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { BigNumber, ethers } from 'ethers';
import { useLinkTo } from '@react-navigation/native';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { checkOneDecimalPoint, getChangeAmount } from 'utils/sendUtil';
import { getAccountController } from 'utils/controllersUtils';
import { removeEthereumPrefix } from 'utils/addressUtil';
import { type IAssetInfoState } from 'state/assets/types';
import { type ITransactionInfo } from 'scripts/types';
import {
  AssetType,
  type IActiveAssetState,
  type AssetBalances,
  type ActiveNetwork,
} from 'state/vault/types';
import { useFiat } from 'hooks/usePrice';
import useGasEstimate from 'hooks/useGasEstimate';
import {
  getChainInfo,
  getMainnetFromTestnet,
  getNativeToken,
  getNetworkFromChainId,
  getPriceId,
} from 'scripts/Background/controllers/EVMChainController/utils';
import {
  ETHEREUM_LOGO,
  POLYGON_LOGO,
  CONSTELLATION_LOGO,
  AVALANCHE_LOGO,
  BSC_LOGO,
  DAG_NETWORK,
  BASE_LOGO,
  INK_LOGO,
} from 'constants/index';
import { initialState as initialStateAssets } from 'state/assets';
import Send from './Send';
import { fixedNumber } from 'utils/number';
import vaultSelectors from 'selectors/vaultSelectors';
import assetsSelectors from 'selectors/assetsSelectors';

// One billion is the max amount a user is allowed to send.
const MAX_AMOUNT_NUMBER = 1000000000;

interface IWalletSend {
  initAddress?: string;
  navigation: any;
}

const SendContainer: FC<IWalletSend> = ({ initAddress = '' }) => {
  const accountController = getAccountController();

  const activeAsset: IActiveAssetState = useSelector(vaultSelectors.getActiveAsset);
  const balances: AssetBalances = useSelector(vaultSelectors.getBalances);
  const activeNetwork: ActiveNetwork = useSelector(vaultSelectors.getActiveNetwork);
  const assetInfo: IAssetInfoState = useSelector(assetsSelectors.getAssetById(activeAsset?.id));

  const getFiatAmount = useFiat(true, assetInfo);
  const linkTo = useLinkTo();

  const tempTx = accountController.getTempTx();

  const { setValue, control, handleSubmit, register, errors, setError, clearError } =
    useForm({
      validationSchema: yup.object().shape({
        address: yup.string().required('Error: Invalid address'),
        amount: yup
                .mixed()
                .transform((value) => {
                  const formattedValue = value.replace(/,/g, '.');
                  if (isNaN(formattedValue)) return undefined;
                  const floatNumber = parseFloat(formattedValue);
                  return isNaN(floatNumber) || floatNumber <= 0 ? undefined : floatNumber;
                })
                .required('Error: Invalid amount'),
        fee:
          activeAsset?.type === AssetType.Constellation ||
          activeAsset?.type === AssetType.LedgerConstellation
            ? yup
                .mixed()
                .transform((value) => {
                  const formattedValue = value.replace(/,/g, '.');
                  if (isNaN(formattedValue)) return undefined;
                  const floatNumber = parseFloat(formattedValue);
                  return isNaN(floatNumber) ? undefined : floatNumber;
                })
                .required('Error: Invalid transaction fee')
            : yup.mixed(),
      }),
    });

  const [address, setAddress] = useState(initAddress || tempTx?.toAddress || '');

  const [amount, setAmount] = useState<number | string>(
    tempTx?.amount ? Number(tempTx?.amount) : 0
  );
  const [amountBN, setAmountBN] = useState(
    ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals)
  );
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);
  const [decimalPointOnAmount, setDecimalPointOnAmount] = useState<boolean>(false);
  const [decimalPointOnFee, setDecimalPointOnFee] = useState<boolean>(false);

  const isValidAddress = useMemo(() => {
    if (
      activeAsset?.type === AssetType.Constellation ||
      activeAsset?.type === AssetType.LedgerConstellation
    )
      return accountController.isValidDAGAddress(address);
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
    digits,
  } = useGasEstimate({
    toAddress: tempTx?.toAddress,
    fromAddress: activeAsset?.address,
    asset: assetInfo,
  });

  const onSubmit = async (data: any) => {
    if (!isValidAddress) {
      return;
    }
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset?.address,
      toAddress: data.address,
      timestamp: Date.now(),
      amount: String(amount) || '0',
      fee: data.fee || gasFee,
    };
    if (
      activeAsset?.type === AssetType.Ethereum ||
      activeAsset?.type === AssetType.ERC20
    ) {
      txConfig.ethConfig = {
        gasPrice,
        gasLimit,
      };
    }

    accountController.updateTempTx(txConfig);

    linkTo('/send/confirm');

  };

  const handleClose = async () => {
    linkTo('/asset');
  };

  const getBalanceAndFees = () => {
    let balance;
    let balanceBN;
    let txFee;
    try {
      if (balances) {
        balance = balances[activeAsset?.id] || '0';
        balanceBN = ethers.utils.parseUnits(balance.toString(), assetInfo.decimals);
      }

      const gasFeeFixed = gasFee.toFixed(digits);

      txFee =
        activeAsset?.type === AssetType.Constellation ||
        activeAsset?.type === AssetType.LedgerConstellation
          ? ethers.utils.parseUnits(fee, assetInfo.decimals)
          : ethers.utils.parseEther(gasFeeFixed);

      clearError('fee');
    } catch (err) {
      setError('fee', 'badFee', 'Please enter a valid transaction fee.');
    }

    return { balance: balanceBN, txFee };
  };

  const isDisabled = useMemo(() => {
    const { balance, txFee } = getBalanceAndFees();

    let computedAmount: BigNumber;
    let checkGasPrices = false;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = amountBN;
    } else if (txFee) {
      computedAmount = amountBN.add(txFee);
    }

    if ([AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
      checkGasPrices = !gasPrices?.length;
    }

    let formattedAmount: number;
    if (typeof amount === 'string') {
      formattedAmount = parseFloat(amount);
    } else {
      formattedAmount = amount;
    }

    if (isNaN(formattedAmount)) return true;

    return (
      !isValidAddress ||
      !amount ||
      !fee ||
      !address ||
      !balance ||
      checkGasPrices ||
      !computedAmount ||
      !!Object.values(errors).length ||
      balance.lt(0) ||
      computedAmount.gt(balance)
    );
  }, [amountBN, address, fee, gasFee, gasPrices, errors, amount]);

  const handleAmountChange = useCallback(
    (changeVal: string) => {
      const formattedValue = changeVal.replace(/,/g, '.');
      const decimalPointEntered = checkOneDecimalPoint(formattedValue);
      setDecimalPointOnAmount(decimalPointEntered);
      const changeAmount = getChangeAmount(
        formattedValue,
        MAX_AMOUNT_NUMBER,
        assetInfo.decimals
      );
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

  const handleFeeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = ev.target.value;
      const formattedValue = val.replace(/,/g, '.');
      const decimalPointEntered = checkOneDecimalPoint(formattedValue);
      setDecimalPointOnFee(decimalPointEntered);
      if (
        !isNaN(parseFloat(formattedValue)) &&
        (parseFloat(formattedValue) === 0 || parseFloat(formattedValue) >= 0.00000001)
      ) {
        setFee(formattedValue);
        estimateGasFee(gasPrice);
      }
    },
    []
  );

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const toAddress = ev.target.value.trim();
      setAddress(toAddress);
      setToEthAddress(toAddress);
      estimateGasFee(gasPrice);
    },
    []
  );

  const handleGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
    val = fixedNumber(val, digits);
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

    if (!balance || !txFee) return;

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

  const isDAG = assetInfo.type === AssetType.Constellation;

  const networkLabel = getNetworkFromChainId(assetInfo?.network);
  const chainValue = activeNetwork[networkLabel as keyof ActiveNetwork];
  const dagChainLabel = DAG_NETWORK[activeNetwork.Constellation].label;
  const tokenMainnet = isDAG ? 'main2' : getMainnetFromTestnet(assetInfo?.network);
  const tokenChainLabel = isDAG ? dagChainLabel : getChainInfo(chainValue)?.label;

  const networkTypeOptions = {
    title: 'NETWORK',
    value: tokenMainnet,
    items: [
      // 349: New network should be added here.
      { value: 'main2', label: 'Constellation', icon: CONSTELLATION_LOGO },
      { value: 'mainnet', label: 'Ethereum', icon: ETHEREUM_LOGO },
      { value: 'matic', label: 'Polygon', icon: POLYGON_LOGO },
      { value: 'avalanche-mainnet', label: 'Avalanche', icon: AVALANCHE_LOGO },
      { value: 'bsc', label: 'BSC', icon: BSC_LOGO },
      { value: 'base-mainnet', label: 'Base', icon: BASE_LOGO },
      { value: 'ink-mainnet', label: 'Ink', icon: INK_LOGO },
    ],
    disabled: true,
    labelRight: tokenChainLabel,
  };

  const assetNetwork =
    assetInfo.network || initialStateAssets[activeAsset?.id]?.network;
  const nativeToken = isDAG ? assetInfo.symbol : getNativeToken(assetNetwork);
  const basePriceId = getPriceId(assetNetwork);

  return (
    <Container color={CONTAINER_COLOR.LIGHT} showHeight>
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
        isDisabled={isDisabled}
        isValidAddress={isValidAddress}
        balances={balances}
        activeAsset={activeAsset}
        nativeToken={nativeToken}
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
        networkTypeOptions={networkTypeOptions}
        basePriceId={basePriceId}
        digits={digits}
      />
    </Container>
  );
};

export default SendContainer;
