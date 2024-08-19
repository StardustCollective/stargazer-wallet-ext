///////////////////////////
// Modules
///////////////////////////
import React, { ChangeEvent, useState, useCallback, useMemo, useEffect, FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { BigNumber, ethers } from 'ethers';
import { useLinkTo } from '@react-navigation/native';
import find from 'lodash/find';
import { useHistory } from 'react-router-dom';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Utils
///////////////////////////

import { checkOneDecimalPoint, getChangeAmount } from 'utils/sendUtil';
import { getAccountController } from 'utils/controllersUtils';
import { removeEthereumPrefix } from 'utils/addressUtil';
import { CHAIN_WALLET_ASSET } from 'utils/assetsUtil';

///////////////////////////
// Types
///////////////////////////

import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';
import IVaultState, {
  AssetType,
  IActiveAssetState,
  IAssetState,
  AssetBalances,
  ActiveNetwork,
} from 'state/vault/types';
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

import {
  getChainInfo,
  getMainnetFromTestnet,
  getNativeToken,
  getNetworkFromChainId,
  getPriceId,
} from 'scripts/Background/controllers/EVMChainController/utils';

///////////////////////////
// Constants
///////////////////////////

import {
  ETHEREUM_LOGO,
  POLYGON_LOGO,
  CONSTELLATION_LOGO,
  AVALANCHE_LOGO,
  BSC_LOGO,
  DAG_NETWORK,
} from 'constants/index';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import { initialState as initialStateAssets } from 'state/assets';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
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

  if (location) {
    isExternalRequest = location.pathname.includes('sendTransaction');
  }

  let activeAsset: IAssetInfoState | IActiveAssetState | IAssetState;
  let balances: AssetBalances;
  let chain: string;
  let to: string;
  let from: string;
  let value: string;
  let feeAmount: string;
  let gas: string;
  let memo: string;
  let metagraphAddress: string;
  let history;
  let assetInfo: IAssetInfoState;

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  if (isExternalRequest) {
    const { data } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
      to: any;
      value: any;
      gas: any;
      data: any;
      fee: any;
      metagraphAddress: any;
      chain: string;
      chainLabel: string;
    } | null>(location.href);

    if (data) {
      to = data.to;
      value = data.value || 0;
      gas = data.gas || 0;
      memo = data.data;
      chain = data.chain;
      feeAmount = data.fee;
      metagraphAddress = data.metagraphAddress;
    }

    useEffect(() => {
      // Set initial gas
      let amount;
      if (typeof value === 'string' && value.startsWith('0x')) {
        amount = parseInt(value, 16); // Convert hexadecimal value to integer value
        amount /= 1e18; // WEI to ETH
      } else {
        amount = value;
      }
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

    activeAsset = useSelector((state: RootState) =>
      find(state.assets, { address: to })
    ) as IAssetInfoState;
    const vault = useSelector((state: RootState) => state.vault);
    const vaultActiveAsset = vault.activeAsset;

    if (!activeAsset) {
      if (chain) {
        if (chain === StargazerChain.CONSTELLATION) {
          if (metagraphAddress) {
            activeAsset = useSelector((state: RootState) =>
              find(state.vault?.activeWallet?.assets, {
                contractAddress: metagraphAddress,
              })
            );
          } else {
            activeAsset = useSelector((state: RootState) =>
              find(state.vault?.activeWallet?.assets, { id: AssetType.Constellation })
            );
          }
        } else {
          activeAsset = useSelector((state: RootState) =>
            find(state.vault?.activeWallet?.assets, { id: AssetType.Ethereum })
          );

          activeAsset = {
            ...activeAsset,
            ...CHAIN_WALLET_ASSET[chain as keyof typeof CHAIN_WALLET_ASSET],
          };
        }
      } else {
        // Set ETH as the default activeAsset
        activeAsset = useSelector((state: RootState) =>
          find(state.vault?.activeWallet?.assets, { id: AssetType.Ethereum })
        );
      }
    } else {
      // Get activeAsset from wallet assets
      activeAsset = useSelector((state: RootState) =>
        find(state.vault?.activeWallet?.assets, { id: activeAsset?.id })
      );
    }

    if (!vaultActiveAsset || activeAsset?.id !== vaultActiveAsset.id) {
      // Update activeAsset so NetworkController doesn't fail
      accountController.updateAccountActiveAsset(activeAsset);
    }

    assetInfo = assets[activeAsset?.id] || initialStateAssets[activeAsset?.id];

    from = activeAsset?.address;
  } else {
    const vault: IVaultState = useSelector((state: RootState) => state.vault);
    activeAsset = vault.activeAsset;
    balances = vault.balances;
    assetInfo = assets[activeAsset?.id];
  }

  const getFiatAmount = useFiat(true, assetInfo);
  const linkTo = useLinkTo();

  const tempTx = accountController.getTempTx();

  const { setValue, control, handleSubmit, register, errors, setError, clearError } =
    useForm({
      validationSchema: yup.object().shape({
        address: yup.string().required('Error: Invalid address'),
        amount: !isExternalRequest
          ? yup
              .mixed()
              .transform((value) => {
                const formattedValue = value.replace(/,/g, '.');
                if (isNaN(formattedValue)) return undefined;
                const floatNumber = parseFloat(formattedValue);
                return isNaN(floatNumber) || floatNumber <= 0 ? undefined : floatNumber;
              })
              .required('Error: Invalid amount')
          : null,
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

  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  const [address, setAddress] = useState(initAddress || tempTx?.toAddress || to || '');

  const [amount, setAmount] = useState<number | string>(
    tempTx?.amount ? Number(tempTx?.amount) : 0
  );
  const [amountBN, setAmountBN] = useState(
    ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals)
  );
  const [fee, setFee] = useState(feeAmount || '0');
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
  } = useGasEstimate({
    toAddress: tempTx?.toAddress || to,
    fromAddress: activeAsset?.address,
    asset: assetInfo,
    data: memo,
    gas,
  });

  const onSubmit = async (data: any) => {
    if (!isValidAddress) {
      return;
    }
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset?.address || from,
      toAddress: data.address || to,
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
        memo,
      };
    }

    accountController.updateTempTx(txConfig);

    if (isExternalRequest) {
      const {
        message,
        origin,
        data: locationData,
      } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

      const params: Record<string, any> = {
        message,
        origin,
        data: locationData,
        to: txConfig.toAddress,
      };

      const CHAINS: { [assetId: string]: string } = {
        [AssetType.Constellation]: StargazerChain.CONSTELLATION,
        [AssetType.Ethereum]: StargazerChain.ETHEREUM,
        [AssetType.Polygon]: StargazerChain.POLYGON,
        [AssetType.BSC]: StargazerChain.BSC,
        [AssetType.Avalanche]: StargazerChain.AVALANCHE,
      };

      if (activeAsset?.id) {
        if (activeAsset?.type === AssetType.Constellation) {
          params.chain = StargazerChain.CONSTELLATION;
        } else {
          params.chain = CHAINS[activeAsset?.id];
        }
      }

      if (metagraphAddress) {
        params.metagraphAddress = metagraphAddress;
      }

      history.push(
        `/confirmTransaction?${StargazerExternalPopups.encodeLocationParams(
          params
        ).toString()}`
      );
    } else {
      linkTo('/send/confirm');
    }
  };

  const handleClose = async () => {
    if (isExternalRequest) {
      const { message } = StargazerExternalPopups.decodeRequestMessageLocationParams(
        location.href
      );

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(
        new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
        message
      );

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
        balance = balances[activeAsset?.id] || '0';
        balanceBN = ethers.utils.parseUnits(balance.toString(), assetInfo.decimals);
      }

      txFee =
        activeAsset?.id === AssetType.Constellation ||
        activeAsset?.id === AssetType.LedgerConstellation
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
    let checkGasPrices = false;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = amountBN;
    } else if (txFee) {
      computedAmount = amountBN.add(txFee);
    }

    if ([AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
      checkGasPrices = !gasPrices?.length;
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
    ],
    disabled: true,
    labelRight: tokenChainLabel,
  };

  const assetNetwork =
    assets[activeAsset?.id]?.network || initialStateAssets[activeAsset?.id]?.network;
  const nativeToken = isDAG ? assetInfo.symbol : getNativeToken(assetNetwork);
  const basePriceId = getPriceId(assetNetwork);

  return (
    <Container color={CONTAINER_COLOR.LIGHT} showHeight={!isExternalRequest}>
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
      />
    </Container>
  );
};

export default SendContainer;
