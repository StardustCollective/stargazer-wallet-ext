import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import Container from 'components/Container';
import { getAccountController } from 'utils/controllersUtils';
import { useFiat } from 'hooks/usePrice';
import { RootState } from 'state/store';
import assetHeader from 'navigation/headers/asset';
import { useLinkTo } from '@react-navigation/native';
import IVaultState, { ActiveNetwork, AssetType } from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { useCopyClipboard } from 'hooks';
import { IChain } from 'scripts/Background/controllers/EVMChainController/types';
import { getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';
import { formatNumber, getAddressURL, formatStringDecimal } from '../../helpers';
import AssetDetail from './Asset';
import { IAssetDetail } from './types';
import IProvidersState, { MapProviderNetwork } from 'state/providers/types';
import { dag4 } from '@stardust-collective/dag4';
import { toDag } from 'utils/number';

const AssetDetailContainer = ({ navigation }: IAssetDetail) => {
  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const getFiatAmount = useFiat();
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const { activeWallet, activeAsset, activeNetwork, balances }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const { supportedAssets }: IProvidersState = useSelector(
    (state: RootState) => state.providers
  );
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const balance = useMemo(() => {
    return Number((activeAsset && balances[activeAsset?.id]) || 0);
  }, [activeAsset, balances]);

  const [lockedBalance, setLockedBalance] = useState(0);
  const [showQrCode, setShowQrCode] = useState(false);

  const supportedAssetsArray = supportedAssets?.data ?? [];
  const assetInfo = assets[activeAsset?.id];
  const showBuy = useMemo(() => !!supportedAssetsArray.find(
    (asset) =>
      asset?.symbol === assetInfo?.symbol &&
    (assetInfo?.network === 'both' ||
      MapProviderNetwork[asset?.network] === assetInfo?.network)
    ), [supportedAssetsArray, assetInfo]);

  const showLocked = assetInfo?.id === AssetType.Constellation;

  useEffect(() => {
    const fetchLockedBalance = async () => {
      const lockedInDatum = await dag4.account.getLockedBalance();
      setLockedBalance(toDag(lockedInDatum));
    }

    if (showLocked) {
      fetchLockedBalance();
    }
  }, [showLocked]);

  // Sets the header for the asset screen.
  useLayoutEffect(() => {
    if (!activeAsset) return;

    let network = '';

    if (!!activeAsset?.type && activeAsset?.type !== AssetType.Constellation) {
      const chain: IChain = accountController?.networkController
        ? accountController?.networkController?.getNetwork()
        : null;
      if (chain) {
        network = getNetworkFromChainId(chain.id);
      }
    }

    const networkId =
      activeAsset?.type === AssetType.Constellation ||
      activeAsset?.type === AssetType.LedgerConstellation
        ? KeyringNetwork.Constellation
        : network;

    navigation.setOptions(
      assetHeader({
        navigation,
        asset: assets[activeAsset?.id],
        addressUrl: getAddressURL(
          activeAsset?.address,
          activeAsset?.contractAddress,
          activeAsset?.type,
          activeNetwork[networkId as keyof ActiveNetwork]
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

  const onBuy = () => {
    if (!showBuy) return;
    linkTo(`/buyAsset?selected=${activeAsset?.id}`);
  };

  const onSend = () => {
    linkTo('/send');
  };

  const onReceive = () => {
    setShowQrCode(true);
  };

  const balanceText = formatStringDecimal(formatNumber(balance, 16, 20), 4);
  const fiatAmount = !isNaN(balance) && getFiatAmount(balance, balance >= 0.01 ? 2 : 4);
  const lockedBalanceText = formatStringDecimal(formatNumber(lockedBalance, 16, 20), 4);
  const fiatLocked = !isNaN(lockedBalance) && getFiatAmount(lockedBalance, 2);

  const showFiatAmount = !!assets[activeAsset?.id]?.priceId && !isNaN(balance);

  return (
    <Container safeArea={false}>
      <AssetDetail
        activeWallet={activeWallet}
        activeAsset={activeAsset}
        balanceText={`${balanceText} ${assetInfo?.symbol}`}
        fiatAmount={fiatAmount}
        lockedBalanceText={`${lockedBalanceText} ${assetInfo?.symbol}`}
        fiatLocked={fiatLocked}
        showBuy={showBuy}
        showLocked={showLocked}
        onBuy={onBuy}
        onSend={onSend}
        onReceive={onReceive}
        assets={assets}
        showQrCode={showQrCode}
        setShowQrCode={setShowQrCode}
        isAddressCopied={isAddressCopied}
        copyAddress={copyAddress}
        showFiatAmount={showFiatAmount}
      />
    </Container>
  );
};

export default AssetDetailContainer;
