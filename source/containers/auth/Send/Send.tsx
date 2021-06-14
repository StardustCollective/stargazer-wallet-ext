import React, {
  ChangeEvent,
  useState,
  useCallback,
  useMemo,
  useEffect,
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

import styles from './Send.scss';
import IAssetListState from 'state/assets/types';
import Icon from 'components/Icon';
interface IWalletSend {
  initAddress?: string;
}

const WalletSend: FC<IWalletSend> = ({ initAddress = '' }) => {
  const history = useHistory();
  const getFiatAmount = useFiat();
  const controller = useController();
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
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);
  const [currentGas, setCurrentGas] = useState<number>(0);
  const [gasPrices, setGasPrices] = useState<number[]>([]);
  const [gasFee, setGasFee] = useState<number>(0);

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
    const txConfig: any = {
      fromAddress: activeAsset.address,
      toAddress: data.address,
      amount: data.amount,
      fee: data.fee || gasFee,
    };
    if (activeAsset.type !== AssetType.Constellation) {
      txConfig.ethConfig = {
        gas: currentGas,
      };
    }
    controller.wallet.account.updateTempTx(txConfig);
    history.push('/send/confirm');
  };

  const isDisabled = useMemo(() => {
    const balance = balances[activeAsset.id] || 0;
    const txFee =
      activeAsset.type === AssetType.Constellation
        ? Number(fee)
        : activeAsset.type === AssetType.Ethereum
        ? gasFee
        : 0;
    console.log(Number(amount) + txFee > balance);
    return (
      !isValidAddress ||
      !amount ||
      !fee ||
      !address ||
      Number(amount) <= 0 ||
      Number(amount) + txFee > balance
    );
  }, [amount, address, gasFee]);

  const handleAmountChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAmount(ev.target.value);
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
      .estimateGasFee(val, tempTx?.ethConfig?.gasLimit)
      .then((fee) => {
        if (!fee) return;
        setGasFee(fee);
      });
  };

  const handleGasPriceChange = (_: any, val: number | number[]) => {
    setCurrentGas(val as number);
    estimateGasFee(val as number);
  };

  const handleGetDAGTxFee = () => {
    controller.wallet.account.getRecommendFee().then((val) => {
      setRecommend(val);
      setFee(val.toString());
    });
  };

  const handleGetTxFee = async () => {
    handleGetDAGTxFee();
    const txConfig = await controller.wallet.account.getTempTx();
    if (txConfig) {
      if (!txConfig?.ethConfig) {
        txConfig.ethConfig = await controller.wallet.account.getRecommendETHTxConfig();
      }
      controller.wallet.account.updateTempTx(txConfig);
    }
    controller.wallet.account.getLatestGasPrices().then((gas) => {
      setGasPrices(gas);
      setCurrentGas(tempTx?.ethConfig?.gas || gas[1]);
      estimateGasFee(gas[1]);
    });
  };

  const handleSelectContact = (val: string) => {
    setAddress(val);
    setModalOpen(false);
  };

  const handleGasSettings = () => {
    controller.wallet.account.updateTempTx({
      ...tempTx,
      fromAddress: '',
      toAddress: address || '',
      amount: Number(amount),
    });
    history.push('/gas-settings');
  };

  const handleSetMax = () => {
    const balance = balances[activeAsset.id] || 0;
    const txFee =
      activeAsset.id === AssetType.Constellation
        ? Number(fee)
        : activeAsset.id === AssetType.Ethereum
        ? gasFee
        : 0;
    setAmount(String(Math.max(balance - txFee, 0)));
  };

  useEffect(() => {
    handleGetTxFee();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header backLink="/asset" />
      <Contacts
        open={modalOpened}
        onClose={() => setModalOpen(false)}
        onChange={handleSelectContact}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.bodywrapper}>
        <section className={styles.subheading}>
          {assetInfo.logo && <Icon Component={assetInfo.logo} />}
          {`Send ${assetInfo.symbol}`}
        </section>
        <section className={styles.balance}>
          <div>
            Balance: <span>{formatNumber(balances[activeAsset.id] || 0)}</span>{' '}
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
                      currentGas < gasPrices[0] || currentGas > gasPrices[2],
                  }),
                  thumb: styles.thumb,
                  mark: styles.mark,
                  track: styles.sliderTrack,
                  rail: styles.sliderRail,
                }}
                value={currentGas}
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
                value={currentGas}
                variant={styles.gasInput}
                onChange={(ev) => setCurrentGas(Number(ev.target.value))}
              />
              <div className={styles.gasLevel}>
                {currentGas >= gasPrices[2]
                  ? 'Fast'
                  : currentGas >= Math.round((gasPrices[0] + gasPrices[2]) / 2)
                  ? 'Normal'
                  : 'Slow'}
              </div>
            </div>
            <div className={styles.status}>
              <span
                className={styles.equalAmount}
              >{`${currentGas} GWei, ${gasFee} ETH (≈ ${getFiatAmount(
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
