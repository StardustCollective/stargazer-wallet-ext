import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

import Header from 'containers/common/Header';
import Layout from 'containers/common/Layout';
import Button from 'components/Button';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import CheckIcon from '@material-ui/icons/CheckCircle';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import { RootState } from 'state/store';
import IWalletState, { AssetType } from 'state/wallet/types';
import IAssetListState from 'state/assets/types';
import { ellipsis } from '../helpers';

import styles from './Confirm.scss';
import Icon from 'components/Icon';

const SendConfirm = () => {
  const controller = useController();
  const getFiatAmount = useFiat(false);
  const alert = useAlert();

  const { accounts, activeAccountId }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const account = accounts[activeAccountId];
  const asset = assets[account.activeAssetId];
  const assetType =
    account.activeAssetId === AssetType.Constellation
      ? AssetType.Constellation
      : AssetType.Ethereum;

  const tempTx = controller.wallet.account.getTempTx();
  const [confirmed, setConfirmed] = useState(false);

  const getTotalAmount = () => {
    return (
      Number(getFiatAmount(Number(tempTx?.amount || 0), 8)) +
      Number(getFiatAmount(Number(tempTx?.fee || 0), 8, assetType))
    ).toLocaleString(navigator.language, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const handleConfirm = () => {
    controller.wallet.account
      .confirmTempTx()
      .then(() => {
        setConfirmed(true);
      })
      .catch((error: Error) => {
        alert.removeAll();
        alert.error(error.message);
      });
  };

  return confirmed ? (
    <Layout title="Your transaction is underway" linkTo="/remind" showLogo>
      <CheckIcon className={styles.checked} />
      <div className="body-description">
        You can follow your transaction under activity on your account screen.
      </div>
      <Button type="button" variant={styles.next} linkTo="/asset">
        Next
      </Button>
    </Layout>
  ) : (
    <div className={styles.wrapper}>
      <Header backLink="/send" />
      <section className={styles.subheading}>
        {asset.logo && <Icon Component={asset.logo} />}
        Confirm
      </section>
      <section className={styles.txAmount}>
        <div className={styles.iconWrapper}>
          <UpArrowIcon />
        </div>
        {Number(tempTx?.amount || 0) +
          (account.activeAssetId === AssetType.Ethereum
            ? Number(tempTx?.fee || 0)
            : 0)}{' '}
        {asset.symbol}
        <small>
          (≈
          {getTotalAmount()})
        </small>
      </section>
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>
            {account?.label || ''} ({ellipsis(tempTx!.fromAddress)})
          </span>
        </div>
        <div className={styles.row}>
          To
          <span>{tempTx!.toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span className={styles.fee}>
            {`${tempTx!.fee} ${assets[assetType].symbol} (≈ $${getFiatAmount(
              tempTx?.fee || 0,
              2,
              assetType
            )})`}
          </span>
        </div>
      </section>
      <section className={styles.confirm}>
        <div className={styles.row}>
          Max Total
          <span>{`$${getTotalAmount()}`}</span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            linkTo="/send"
          >
            Cancel
          </Button>
          <Button type="submit" variant={styles.button} onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SendConfirm;
