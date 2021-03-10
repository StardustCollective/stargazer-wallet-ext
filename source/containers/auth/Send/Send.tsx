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
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import IWalletState, { AssetType } from 'state/wallet/types';
import { RootState } from 'state/store';
import { formatNumber } from '../helpers';

import styles from './Send.scss';
interface IWalletSend {
  initAddress?: string;
}

const WalletSend: FC<IWalletSend> = ({ initAddress = '' }) => {
  const selectedAsset = AssetType.Ethereum;
  const { handleSubmit, register, errors } = useForm({
    validationSchema: yup.object().shape({
      address: yup.string().required('Error: Invalid DAG address'),
      amount: yup.number().moreThan(0).required('Error: Invalid DAG Amount'),
      fee:
        // @ts-expect-error
        selectedAsset === AssetType.Constellation
          ? yup.string().required('Error: Invalid transaction fee')
          : yup.string(),
    }),
  });
  const history = useHistory();
  const getFiatAmount = useFiat();
  const controller = useController();
  const alert = useAlert();
  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const [address, setAddress] = useState(initAddress);
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('0');
  const [recommend, setRecommend] = useState(0);
  const [modalOpened, setModalOpen] = useState(false);

  const isValidAddress = useMemo(() => {
    // @ts-expect-error
    if (selectedAsset === AssetType.Constellation)
      return controller.wallet.account.isValidDAGAddress(address);
    return controller.wallet.account.isValidERC20Address(address);
  }, [address]);

  const addressInputClass = clsx(styles.input, styles.address, {
    [styles.verified]: isValidAddress,
  });
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !isValidAddress,
  });

  const onSubmit = (data: any) => {
    if (!isValidAddress) {
      alert.removeAll();
      alert.error('Error: Invalid recipient address');
      return;
    }
    // @ts-expect-error
    if (selectedAsset === AssetType.Constellation) {
      controller.wallet.account.updateTempTx({
        fromAddress: accounts[activeAccountId].address.constellation,
        toAddress: data.address,
        amount: data.amount,
        fee: data.fee,
      });
      history.push('/send/confirm');
    } else {
      // TODO: Do the ETH temp tx stuff here.
      console.log('ETH send');
    }
  };

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

  const handleGetFee = () => {
    controller.wallet.account.getRecommendFee().then((val) => {
      setRecommend(val);
      setFee(val.toString());
    });
  };

  const handleSelectContact = (val: string) => {
    setAddress(val);
    setModalOpen(false);
  };

  const getAssetName = (val: string) => {
    if (val === AssetType.Ethereum) return 'ETH';
    else if (val === AssetType.Constellation) return 'DAG';
    return 'ERC20';
  };

  const marks = [
    { value: 0, label: 'LOW' },
    { value: 1, label: 'AVERAGE' },
    { value: 2, label: 'HIGH' },
  ];

  useEffect(handleGetFee, []);

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <Contacts
        open={modalOpened}
        onClose={() => setModalOpen(false)}
        onChange={handleSelectContact}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.bodywrapper}>
        <section className={styles.subheading}>
          {`Send ${getAssetName(selectedAsset)}`}
        </section>
        <section className={styles.balance}>
          <div>
            Balance:{' '}
            <span>{formatNumber(accounts[activeAccountId].balance)}</span>{' '}
            {getAssetName(selectedAsset)}
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
              <TextInput
                placeholder={`Enter a valid ${getAssetName(
                  selectedAsset
                )} address`}
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
              <label>{`${getAssetName(selectedAsset)} Amount`} </label>
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
                onClick={() =>
                  setAmount(String(accounts[activeAccountId].balance))
                }
              >
                Max
              </Button>
            </li>

            {
              // @ts-expect-error
              selectedAsset === AssetType.Constellation && (
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
                    onClick={handleGetFee}
                  >
                    Recommend
                  </Button>
                </li>
              )
            }
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
          {
            // @ts-expect-error
            selectedAsset === AssetType.Constellation && (
              <div className={styles.description}>
                {`With current network conditions we recommend a fee of ${recommend} DAG.`}
              </div>
            )
          }
        </section>
        {
          // @ts-expect-error
          selectedAsset !== AssetType.Constellation && (
            <section className={styles.transactionFee}>
              <div className={styles.heading}>
                <span className={styles.title}>Transaction Fee</span>
                <span
                  className={styles.advancedSetting}
                  onClick={() => history.push('/gas-settings')}
                >
                  ADVANCED gas settings
                </span>
              </div>
              {/* <div>Gas fee settings go here</div> */}
              <Slider
                classes={{
                  rail: styles.sliderRail,
                  track: styles.sliderTrack,
                  mark: styles.mark,
                  markActive: styles.mark,
                  thumb: styles.thumb,
                  markLabel: styles.markLabel,
                }}
                defaultValue={1}
                min={0}
                max={2}
                scale={(x) => x * 2}
                aria-labelledby="discrete-slider-restrict"
                step={1}
                marks={marks}
              />
              <div className={styles.status}>
                <span className={styles.equalAmount}>0.0021 ETH (≈ $1.20)</span>
              </div>
            </section>
          )
        }
        <section className={styles.actionGroup}>
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              linkTo="/home"
            >
              Close
            </Button>
            <Button
              type="submit"
              variant={styles.button}
              disabled={
                !isValidAddress ||
                !amount ||
                !fee ||
                !address ||
                Number(amount) <= 0
              }
            >
              Send
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default WalletSend;
