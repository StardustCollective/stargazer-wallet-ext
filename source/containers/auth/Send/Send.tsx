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
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import Slider from '@material-ui/core/Slider';

import Header from 'containers/common/Header';
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

import styles from './Send.scss';
import IAssetListState from 'state/assets/types';
import Icon from 'components/Icon';
import { BigNumber, ethers } from 'ethers';
import { ITransactionInfo } from '../../../scripts/types';

import sendHeader from 'navigation/headers/send';
interface IWalletSend {
  initAddress?: string;
  navigation: any
}

const WalletSend: FC<IWalletSend> = ({ initAddress = '', navigation }) => {
  const history = useHistory();
  const getFiatAmount = useFiat();
  const controller = useController();
  const linkTo = useLinkTo();
  const alert = useAlert();
  const { activeAsset, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  // const account = accounts[activeAccountId];
  const assetInfo = assets[activeAsset.id];
  const tempTx = controller.wallet.account.getTempTx();

  // Sets the header for the home screen.
  useLayoutEffect(() => {
    navigation.setOptions(sendHeader({ navigation, asset: assetInfo }));
  }, []);

  const { handleSubmit, register, errors } = useForm({
    validationSchema: yup.object().shape({
      address: yup.string().required('Error: Invalid DAG address'),
      amount: yup.number().moreThan(0).required('Error: Invalid DAG Amount'),
      fee:
        activeAsset.type === AssetType.Constellation
          ? yup.string().required('Error: Invalid transaction fee')
          : yup.string(),
    }),
  });

  const [address, setAddress] = useState(
    initAddress || tempTx?.toAddress || ''
  );
  const [amount, setAmount] = useState(String(tempTx?.amount) || '');
  const [amountBN, setAmountBN] = useState(ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals));
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);
  // const [useMax, setUseMax] = useState<boolean>(false);

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

  const onSubmit = async (data: any) => {
    if (!isValidAddress) {
      alert.removeAll();
      alert.error('Error: Invalid recipient address');
      return;
    }
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset.address,
      toAddress: data.address,
      timestamp: Date.now(),
      amount: amount,
      fee: data.fee || gasFee,
    };
    if (activeAsset.type === AssetType.Ethereum) {
      txConfig.ethConfig = {
        gasPrice,
        gasLimit: 21000
      };
    }
    else if (activeAsset.type === AssetType.ERC20) {
      txConfig.ethConfig = {
        gasPrice
      };
    }
    controller.wallet.account.updateTempTx(txConfig);
    linkTo('/send/confirm');
  };

  const getBalanceAndFees = () => {
    const balance = ethers.utils.parseUnits(String(balances[activeAsset.id] || 0), assetInfo.decimals);
    console.log('getBalanceAndFees', gasFee.toString())
    const txFee =
      activeAsset.id === AssetType.Constellation
        ? BigNumber.from(fee)
        : ethers.utils.parseEther(gasFee.toString());

    return {balance, txFee};
  }

  const gasSpeedLabel = useMemo(() => {
     if (gasPrice >= gasPrices[2]) return 'Fastest';
     if(gasPrice >= Math.floor((gasPrices[1] + gasPrices[2]) / 2)) return 'Fast';
     if(gasPrice > Math.floor((gasPrices[0] + gasPrices[1]) / 2)) return 'Average';
     if(gasPrice > gasPrices[0]) return 'Slow';
     return 'Turtle';
  }, [gasPrice, gasPrices])

  const isDisabled = useMemo(() => {

    const { balance, txFee } = getBalanceAndFees();

    let computedAmount: BigNumber;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = amountBN;
    }
    else {
      computedAmount = amountBN.add(txFee);
    }

    return (
      !isValidAddress ||
      !amount ||
      !fee ||
      !address ||
      balance.lt(0) ||
      computedAmount.gt(balance)
    );
  }, [amountBN, address, gasFee]);

  const handleAmountChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAmount(ev.target.value);
      setAmountBN(ethers.utils.parseUnits(ev.target.value, assetInfo.decimals));
     // setUseMax(false);
    },
    []
  );
  const handleFeeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFee(ev.target.value);
    },
    []
  );

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress(ev.target.value.trim());
    },
    []
  );

  const estimateGasFee = (val: number) => {
    if (!gasPrices) return;
    controller.wallet.account
      .estimateTotalGasFee(val, tempTx?.ethConfig?.gasLimit)
      .then((fee) => {
        if (!fee) return;
        // console.log('setGasFee', fee)
        setGasFee(fee);
        // if (useMax) {
        //   handleSetMax();
        // }
      });
  };

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

  const handleGetTxFee = async () => {
    if (activeAsset.type === AssetType.Constellation) {
      handleGetDAGTxFee();
    }
    const txConfig = await controller.wallet.account.getTempTx();
    if (txConfig) {
      if (!txConfig?.ethConfig) {
        txConfig.ethConfig = await controller.wallet.account.getRecommendETHTxConfig();
      }
      controller.wallet.account.updateTempTx(txConfig);
    }
    controller.wallet.account.getLatestGasPrices().then((gas) => {
      const gasPrice = tempTx?.ethConfig?.gasPrice || gas[1];
      setGasPrices(gas);
      setGasPrice(gasPrice);
      estimateGasFee(gasPrice);
    });
  };

  const handleSelectContact = (val: string) => {
    setAddress(val);
    setModalOpen(false);
  };

  // const handleGasSettings = () => {
  //   controller.wallet.account.updateTempTx({
  //     ...tempTx,
  //     fromAddress: '',
  //     toAddress: address || '',
  //     amount: Number(amount),
  //   });
  //   history.push('/gas-settings');
  // };

  const handleSetMax = () => {

    const { balance, txFee } = getBalanceAndFees();

    let computedAmount;

    if (assetInfo.type === AssetType.ERC20) {
      computedAmount = balance;
    }
    else {
      computedAmount = balance.sub(txFee);
    }

    if (computedAmount.lt(0)) {
      computedAmount = BigNumber.from(0);
    }

    setAmount(ethers.utils.formatUnits(computedAmount, assetInfo.decimals));
    setAmountBN(computedAmount);
    //setUseMax(true);
  };

  useEffect(() => {
    handleGetTxFee();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Contacts
        open={modalOpened}
        onClose={() => setModalOpen(false)}
        onChange={handleSelectContact}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.bodywrapper}>
        <section className={styles.balance}>
          <div>
            Balance: <span>{formatNumber(Number(balances[activeAsset.id]), 4, 4)}</span>{' '}
            {assetInfo.symbol}
          </div>
        </section>
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
                value={amount}
                onChange={handleAmountChange}
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
              linkTo="/asset"
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
