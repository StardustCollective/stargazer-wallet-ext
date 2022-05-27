import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import Container from 'components/Container';

import { getAccountController } from 'utils/controllersUtils';
import { useFiat } from 'hooks/usePrice';

import { RootState } from 'state/store';

import assetHeader from 'navigation/headers/asset';
import { useLinkTo } from '@react-navigation/native';

import IVaultState, { AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { useCopyClipboard } from 'hooks';
import { formatNumber, getAddressURL, formatStringDecimal } from '../../helpers';

import AssetDetail from './Asset';

import { IAssetDetail } from './types';

const AssetDetailContainer = ({ navigation }: IAssetDetail) => {
  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const getFiatAmount = useFiat();
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const { activeWallet, activeAsset, activeNetwork, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const balance = useMemo(() => {
    return Number((activeAsset && balances[activeAsset.id]) || 0);
  }, [activeAsset, balances]);

  const networkId =
    activeAsset?.type === AssetType.Constellation ? KeyringNetwork.Constellation : KeyringNetwork.Ethereum;

  const [transactions, setTransactions] = useState([]);
  const [showQrCode, setShowQrCode] = useState(false);

  // Sets the header for the asset screen.
  useLayoutEffect(() => {
    if (!activeAsset) return;

    navigation.setOptions(
      assetHeader({
        navigation,
        asset: assets[activeAsset.id],
        address: activeAsset.address,
        addressUrl: getAddressURL(
          activeAsset.address,
          activeAsset.contractAddress,
          activeAsset.type,
          activeNetwork[networkId]
        ),
      })
    );
  }, [activeAsset]);

  useEffect(() => {
    accountController.updateTempTx({
      timestamp: Date.now(),
      fromAddress: '',
      toAddress: '',
      amount: '0',
    });
  }, []);

  useEffect(() => {
    const fetchTxs = async () => {
      if (activeAsset.type === AssetType.Constellation) {
        return activeAsset.transactions;
      }
      return (await accountController.getFullETHTxs()).sort((a, b) => b.timestamp - a.timestamp);
    };

    fetchTxs().then((txns: any[]) => {
      return setTransactions(txns);
    });
  }, [activeAsset]);

  const onSendClick = () => {
    linkTo('/send');
  };

  const BALANCE_TEXT = formatStringDecimal(formatNumber(balance, 16, 20), 4);
  const FIAT_AMOUNT = getFiatAmount(balance, balance >= 0.01 ? 2 : 4);

  return (
    <Container safeArea={false}>
      <AssetDetail
        activeWallet={activeWallet}
        activeAsset={activeAsset}
        balanceText={BALANCE_TEXT}
        fiatAmount={FIAT_AMOUNT}
        transactions={transactions}
        onSendClick={onSendClick}
        assets={assets}
        showQrCode={showQrCode}
        setShowQrCode={setShowQrCode}
        isAddressCopied={isAddressCopied}
        copyAddress={copyAddress}
      />
    </Container>
  );
};

export default AssetDetailContainer;
