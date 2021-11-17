import React, {
  ChangeEvent,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  FC,
} from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import Slider from '@material-ui/core/Slider';
import queryString from 'query-string';
import { useHistory } from "react-router-dom";
import useGasEstimate from 'hooks/useGasEstimate';

import Contacts from '../Contacts';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import VerifiedIcon from 'assets/images/svg/check-green.svg';
import ErrorIcon from 'assets/images/svg/error.svg';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import IVaultState, { AssetType } from 'state/vault/types';
import { RootState } from 'state/store';
import { formatNumber } from '../helpers';
import { useLinkTo } from '@react-navigation/native';
import { IAssetInfoState } from 'state/assets/types';
import find from 'lodash/find';
import { IActiveAssetState, AssetBalances } from 'state/vault/types';


import styles from './Send.scss';
import IAssetListState from 'state/assets/types';
import { BigNumber, ethers } from 'ethers';
import { ITransactionInfo } from '../../../scripts/types';
import { getChangeAmount } from 'utils/sendUtil';

import sendHeader from 'navigation/headers/send';

interface IWalletSend {
  initAddress?: string;
  navigation: any
}

// One billion is the max amount a user is allowed to send.
const MAX_AMOUNT_NUMBER = 1000000000;

const WalletSend: FC<IWalletSend> = ({ initAddress = '', navigation }) => {

  const isExternalRequest = location.pathname.includes('sendTransaction');

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let balances: AssetBalances;
  let to: string,
    from: string,
    value: string,
    gas: string,
    memo: string;
  let history;
  let windowId: string;
  let assetInfo: IAssetInfoState;

  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );

  if (isExternalRequest) {
    const {
      data: dataJsonString,
      windowId: _windowId
    } = queryString.parse(location.search);

    windowId = _windowId as string;

    if (dataJsonString) {
      let params = JSON.parse(dataJsonString as string);
      to = params.to;
      value = params.value || 0;
      gas = params.gas;
      memo = params.data;
    }

    useEffect(() => {
      // Set initial gas
      let amount = parseInt(value, 16);
      setAmount(amount);

      let initialGas = parseInt(gas, 16);
      setGasPrice(initialGas);
      estimateGasFee(initialGas);
    }, []);

    history = useHistory();

    activeAsset = useSelector(
      (state: RootState) => find(state.assets, { address: to })
    ) as IAssetInfoState;

    if (!activeAsset) {
      activeAsset = useSelector(
        (state: RootState) => find(state.assets, { type: AssetType.Ethereum })
      ) as IAssetInfoState;
    }

    assetInfo = assets[activeAsset.id];

    from = activeAsset.address;
  } else {
    const vault: IVaultState = useSelector(
      (state: RootState) => state.vault
    )
    activeAsset = vault.activeAsset;
    balances = vault.balances;
    assetInfo = assets[activeAsset.id];

    // Sets the header for the send screen
    useLayoutEffect(() => {
      navigation.setOptions(sendHeader({ navigation, asset: assetInfo }));
    }, []);

  }

  const getFiatAmount = useFiat(true, assetInfo);
  const controller = useController();
  const linkTo = useLinkTo();
  const alert = useAlert();

  const tempTx = controller.wallet.account.getTempTx();

  const { handleSubmit, register, errors } = useForm({
    validationSchema: yup.object().shape({
      address: yup.string().required('Error: Invalid DAG address'),
      amount: !isExternalRequest ? yup.number().moreThan(0).required('Error: Invalid DAG Amount') : null,
      fee:
        activeAsset.type === AssetType.Constellation
          ? yup.string().required('Error: Invalid transaction fee')
          : yup.string(),
    }),
  });

  const [address, setAddress] = useState(
    initAddress || tempTx?.toAddress || to || ''
  );

  const [amount, setAmount] = useState<number | string>(tempTx?.amount ? Number(tempTx?.amount) : 0);
  const [amountBN, setAmountBN] = useState(ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals));
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);

  const isValidAddress = useMemo(() => {
    if (activeAsset.type === AssetType.Constellation)
      return controller.wallet.account.isValidDAGAddress(address);
    return controller.wallet.account.isValidERC20Address(address);
  }, [address]);

  const addressInputClass = clsx(styles.input, styles.address, {
    [styles.verified]: isValidAddress,
  });
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !isValidAddress,
  });
  const errorIconClass = clsx(styles.statusIcon, {
    [styles.hide]: isValidAddress,
  });

  let {
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
    data: memo
  });

  const onSubmit = async (data: any) => {
    if (!isValidAddress) {
      alert.removeAll();
      alert.error('Error: Invalid recipient address');
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

    controller.wallet.account.updateTempTx(txConfig);

    if (isExternalRequest) {
      history.push(`/confirmTransaction?to=${txConfig.toAddress}&windowId=${windowId}`);
    } else {
      linkTo('/send/confirm');
    }
  };

  const handleClose = () => {
    if (isExternalRequest) {
      window.close();
    } else {
      linkTo('/asset');
    }
  }

  const getBalanceAndFees = () => {
    let balance, balanceBN;
    if (balances) {
      balance = balances[activeAsset.id] || '0';
      balanceBN = ethers.utils.parseUnits(balance.toString(), assetInfo.decimals);
    }

    const txFee =
      activeAsset.id === AssetType.Constellation
        ? ethers.utils.parseUnits(fee, assetInfo.decimals)
        : ethers.utils.parseEther(gasFee.toString());

    return { balance: balanceBN, txFee };
  }

  const isDisabled = useMemo(() => {
    const { balance, txFee } = getBalanceAndFees();

    let computedAmount: BigNumber;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = amountBN;
    } else {
      computedAmount = amountBN.add(txFee);
    }

    if (isExternalRequest) {
      return (
        !isValidAddress ||
        !fee ||
        !address
      );
    } 
    
    return (
      !isValidAddress ||
      !amount ||
      !fee ||
      !address ||
      balance.lt(0) ||
      computedAmount.gt(balance)
    );

  }, [amountBN, address, fee, gasFee]);

  const handleAmountChange = useCallback(
    (changeVal: string) => {
      const changeAmount = getChangeAmount(changeVal, MAX_AMOUNT_NUMBER, assetInfo.decimals);
      if (changeAmount === null) return;

      setAmount(changeAmount);
      setSendAmount(changeAmount);

      if (changeAmount !== amount) {
        setAmountBN(ethers.utils.parseUnits(changeAmount, assetInfo.decimals));
      }
    },
    [address, gasLimit]
  );

  const handleFeeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = ev.target.value;
      if (!isNaN(parseFloat(val)) && (parseFloat(val) === 0 || parseFloat(val) >= 0.00000001)) {
        setFee(ev.target.value);
        estimateGasFee(gasPrice);
      }
    },
    []
  );

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let toAddress = ev.target.value.trim();
      setAddress(toAddress);
      setToEthAddress(toAddress)
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
    controller.wallet.account.getRecommendFee().then((val) => {
      setRecommend(val);
      setFee(val.toString());
    });
  };

  const handleSelectContact = (val: string) => {
    setAddress(val);
    setToEthAddress(val);
    setModalOpen(false);
  };

  const handleSetMax = () => {
    const { balance, txFee } = getBalanceAndFees();

    let computedAmount;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = balance;
    } else {
      computedAmount = balance.sub(txFee);
    }

    if (computedAmount.lt(0)) {
      computedAmount = BigNumber.from(0);
    }

    handleAmountChange(ethers.utils.formatUnits(computedAmount, assetInfo.decimals));
  };

  return (
    <div className={styles.wrapper}>
      <Contacts
        open={modalOpened}
        onClose={() => setModalOpen(false)}
        onChange={handleSelectContact}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.bodywrapper}>
        {!isExternalRequest &&
          <section className={styles.balance}>
            <div>
              Balance: <span>{formatNumber(Number(balances[activeAsset.id]), 4, 4)}</span>{' '}
              {assetInfo.symbol}
            </div>
          </section>
        }
        <section className={styles.content}>
          <ul className={styles.form}>
            <li>
              <label>Recipient Address</label>
              <img
                src={`/${VerifiedIcon}`}
                alt="checked"
                className={statusIconClass}
              />
              <img
                src={`/${ErrorIcon}`}
                alt="error"
                className={errorIconClass}
              />
              <TextInput
                placeholder={`Enter a valid ${assetInfo.symbol} address`}
                fullWidth
                value={address}
                name="address"
                inputRef={register}
                onChange={handleAddressChange}
                disabled={isExternalRequest}
                variant={addressInputClass}
              />
              <Button
                type="button"
                variant={styles.textBtn}
                onClick={() => setModalOpen(true)}
              >
                Contacts
              </Button>
            </li>
            <li>
              <label>{`${assetInfo.symbol} Amount`} </label>
              <TextInput
                type="number"
                placeholder="Enter amount to send"
                fullWidth
                inputRef={register}
                name="amount"
                value={amount === '0' ? '' : amount}
                onChange={(ev) => handleAmountChange(ev.target.value)}
                disabled={isExternalRequest}
                variant={clsx(styles.input, styles.amount)}
              />
              <Button
                type="button"
                variant={styles.textBtn}
                onClick={handleSetMax}
              >
                Max
              </Button>
            </li>

            {activeAsset.type === AssetType.Constellation && (
              <li>
                <label>Transaction Fee</label>
                <TextInput
                  type="number"
                  placeholder="Enter transaction fee"
                  fullWidth
                  inputRef={register}
                  name="fee"
                  onChange={handleFeeChange}
                  value={fee}
                  variant={clsx(styles.input, styles.fee)}
                />
                <Button
                  type="button"
                  variant={styles.textBtn}
                  onClick={handleGetDAGTxFee}
                >
                  Recommend
                </Button>
              </li>
            )}
          </ul>
          <div className={styles.status}>
            <span className={styles.equalAmount}>
              ≈ {getFiatAmount(Number(amount) + Number(fee), 6)}
            </span>
            {!!Object.values(errors).length && (
              <span className={styles.error}>
                {Object.values(errors)[0].message}
              </span>
            )}
          </div>
          {activeAsset.type === AssetType.Constellation && (
            <div className={styles.description}>
              {`With current network conditions we recommend a fee of ${recommend} DAG.`}
            </div>
          )}
        </section>
        {activeAsset.type !== AssetType.Constellation && (
          <section
            className={clsx(styles.transactionFee, {
              [styles.hide]: !gasPrices.length,
            })}
          >
            <div className={styles.gasRow}>
              <span>Gas Price (In Gwei)</span>
              <Slider
                classes={{
                  root: clsx(styles.sliderCustom, {
                    [styles.disabled]:
                      gasPrice < gasPrices[0] || gasPrice > gasPrices[2],
                  }),
                  thumb: styles.thumb,
                  mark: styles.mark,
                  track: styles.sliderTrack,
                  rail: styles.sliderRail,
                }}
                value={gasPrice}
                min={gasPrices[0]}
                max={gasPrices[2]}
                scale={(x) => x * 2}
                aria-labelledby="discrete-slider-restrict"
                step={1}
                marks={[
                  { value: gasPrices[0] },
                  {
                    value: Math.round((gasPrices[0] + gasPrices[2]) / 2),
                  },
                  { value: gasPrices[2] },
                ]}
                onChange={handleGasPriceChange}
              />
              <TextInput
                type="number"
                value={gasPrice}
                variant={styles.gasInput}
                onChange={(ev) => handleGasPriceChange(null, Number(ev.target.value))}
              />
              <div className={styles.gasLevel}>
                {gasSpeedLabel}
              </div>
            </div>
            <div className={styles.status}>
              <span
                className={styles.equalAmount}
              >{`${gasPrice} GWei, ${gasFee} ETH (≈ ${getFiatAmount(
                gasFee,
                2,
                'ethereum'
              )})`}</span>
            </div>
          </section>
        )}
        <section className={styles.actionGroup}>
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button type="submit" variant={styles.button} disabled={isDisabled}>
              Send
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default WalletSend;
