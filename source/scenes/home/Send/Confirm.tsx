import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
// import { useHistory } from 'react-router-dom';
import Layout from 'scenes/common/Layout';
import Button from 'components/Button';
import { useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';
import CheckIcon from '@material-ui/icons/CheckCircle';
import UpArrowIcon from '@material-ui/icons/ArrowUpward';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IWalletState, IActiveAssetState } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { ellipsis } from '../helpers';
import queryString from 'query-string';
import find from 'lodash/find';
import confirmHeader from 'navigation/headers/confirm';

import styles from './Confirm.scss';
import { ethers } from 'ethers';

interface ISendConfirm {
  navigation: any
}

const SendConfirm = ({ navigation }: ISendConfirm) => {

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let activeWallet: IWalletState;

  const isExternalRequest = location.pathname.includes('confirmTransaction');

  // const history = useHistory();
  const controller = useController();
  const alert = useAlert();
  const vault: IVaultState = useSelector(
    (state: RootState) => state.vault
  );


  if (isExternalRequest) {

    const {
      to
    } = queryString.parse(location.search);

    activeAsset = useSelector(
      (state: RootState) => find(state.assets, { address: to })
    ) as IAssetInfoState;

    activeWallet = vault.activeWallet;

  } else {

    activeAsset = vault.activeAsset;
    activeWallet = vault.activeWallet;

    // Sets the header for the confirm screen.
    useLayoutEffect(() => {
      navigation.setOptions(confirmHeader({ navigation, asset: assetInfo }));
    }, []);

  }

  const getFiatAmount = useFiat(false, activeAsset as IAssetInfoState);

  /****************************************/
  /* Start - Set up for external request
  /****************************************/

  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  const assetInfo = assets[activeAsset.id];
  const feeUnit = assetInfo.type === AssetType.Constellation ? 'DAG' : 'ETH'

  const tempTx = controller.wallet.account.getTempTx();
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const gasFeeBaseId = activeAsset.type === AssetType.Constellation ? AssetType.Constellation : AssetType.Ethereum;

  const getTotalUnits = () => {
    const balance = ethers.utils.parseUnits(String(tempTx?.amount || 0), assetInfo.decimals);
    const txFee =
      activeAsset.id === AssetType.Constellation
        ? ethers.utils.parseUnits(Number(tempTx?.fee || 0).toFixed(8), 8)
        : ethers.utils.parseEther(String(tempTx?.fee || 0));

    if (assetInfo.type === AssetType.ERC20) {
      return ethers.utils.formatUnits(balance, assetInfo.decimals);
    }
    return ethers.utils.formatUnits(balance.add(txFee), assetInfo.decimals);
  }

  const getTotalAmount = () => {
    let amount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8));
    //if (assetInfo.type !== AssetType.ERC20) {
    amount += Number(getFiatAmount(Number(tempTx?.fee || 0), 8, activeAsset.type));
    //}
    return (amount).toLocaleString(navigator.language, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const handleConfirm = async () => {

    setDisabled(true);

    // const { publicKey, type, id } = assetInfo;//accounts[activeAccountId];
    //
    // if (type === AccountType.Ledger) {
    //   window.open(`/ledger.html?walletState=sign&id=${id}&publicKey=${publicKey}&amount=${tempTx!.amount}&fee=${tempTx!.fee}&from=${tempTx!.fromAddress}&to=${tempTx!.toAddress}`, '_newtab');
    //   history.push('/home');
    // } else {

    try {
      if (isExternalRequest) {
        await controller.wallet.account.confirmContractTempTx(activeAsset)
        window.close();
      } else {
        await controller.wallet.account.confirmTempTx()
        setConfirmed(true);
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message.includes('insufficient funds') && [AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
        message = 'Insufficient ETH to cover gas fee.';
      }
      alert.removeAll();
      alert.error(message);
    }



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
      {!isExternalRequest &&
        < section className={styles.txAmount}>
          <div className={styles.iconWrapper}>
            <UpArrowIcon />
          </div>
          {getTotalUnits()}{' '}
          {assetInfo.symbol}
          <small>
            (≈
            {getTotalAmount()})
          </small>
        </section>
      }
      <section className={styles.transaction}>
        <div className={styles.row}>
          From
          <span>
            {activeWallet?.label || ''} ({ellipsis(tempTx!.fromAddress)})
          </span>
        </div>
        <div className={styles.row}>
          To
          <span>{tempTx!.toAddress}</span>
        </div>
        <div className={styles.row}>
          Transaction Fee
          <span className={styles.fee}>
            {`${tempTx!.fee} ${feeUnit} (≈ $${getFiatAmount(
              tempTx?.fee || 0,
              2,
              gasFeeBaseId
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
          <Button type="submit" variant={styles.button} onClick={handleConfirm} disabled={disabled}>
            {assetInfo.type === AssetType.Ledger ? 'Next' : 'Confirm'}
          </Button>
        </div>
      </section>
    </div >
  );
};

export default SendConfirm;
