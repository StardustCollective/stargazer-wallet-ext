import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import Container, { CONTAINER_COLOR } from 'components/Container';
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
import IProvidersState, { MapProviderNetwork, Providers } from 'state/providers/types';
import { dag4 } from '@stardust-collective/dag4';
import { iosPlatform } from 'utils/platform';
import { open } from 'utils/browser';
import { C14_BASE_URL, C14_CLIENT_ID, DAG_NETWORK } from 'constants/index';
import { getDagAddress, getEthAddress } from 'utils/wallet';
import { DagAccount, MetagraphTokenClient } from '@stardust-collective/dag4-wallet';

const DAG_BUY_URL = 'https://constellationnetwork.io/buy/#iWantTo';

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

  const isC14Supported = useMemo(() => !!supportedAssetsArray.find(
    (asset) =>
      asset?.symbol === assetInfo?.symbol &&
    (assetInfo?.network === 'both' ||
      MapProviderNetwork[asset?.network] === assetInfo?.network) &&
      asset.providers.includes(Providers.C14)
    ), [supportedAssetsArray, assetInfo]);
  
  const showGetDag = assetInfo?.id === AssetType.Constellation;
  // iOS platform logic: show buy button for DAG or c14 supported tokens
  const isIosWithC14Support = iosPlatform() && !showGetDag && isC14Supported;
  const showBuyButton = (iosPlatform() && showGetDag) || isIosWithC14Support || (!iosPlatform() && showBuy);
  const showLocked = assetInfo?.type === AssetType.Constellation;

  useEffect(() => {
    const fetchLockedBalance = async () => {
      const beUrl = DAG_NETWORK[activeNetwork.Constellation].config.beUrl;
      const isMetagraph = !!assetInfo?.l0endpoint;
      const client: MetagraphTokenClient | DagAccount = isMetagraph ? 
          dag4.account.createMetagraphTokenClient({
            metagraphId: assetInfo?.address,
            id: assetInfo?.address,
            l0Url: assetInfo?.l0endpoint,
            l1Url: assetInfo?.l1endpoint,
            beUrl,
          }) : dag4.account;
      const lockedInDatum = await client.getLockedBalance();
      setLockedBalance(lockedInDatum);
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

  const getActiveAddress = (): string | null => {
    if (activeAsset?.type === AssetType.Constellation) {
      return getDagAddress(activeWallet);
    }

    if ([AssetType.Ethereum, AssetType.ERC20].includes(activeAsset?.type)) {
      return getEthAddress(activeWallet);
    }

    return null;
  };

  const getTokenId = (): string => {
    if (!supportedAssetsArray.length || !assetInfo?.symbol) return '';
    
    const token = supportedAssetsArray.find(
      (asset) =>
        asset.symbol === assetInfo.symbol && asset.providers.includes(Providers.C14)
    );
    if (!token) return '';

    return token.id;
  };

  const generateC14Link = (
    clientId: string,
    sourceAmount: string,
    targetAddress: string,
    targetAssetId: string
  ): string => {
    const params = new URLSearchParams({
      clientId,
      sourceAmount,
      sourceCurrencyCode: 'USD',
      targetAddress,
      targetAssetId,
      targetAssetIdLock: 'true',
    });

    return `${C14_BASE_URL}?${params.toString()}`;
  };

  const onBuy = () => {
    if (!showBuyButton) return;

    if (iosPlatform()) {
      // For DAG, open the localhost link
      if (showGetDag) {
        open(DAG_BUY_URL);
        return;
      }
      
      // For other tokens supported by c14, generate c14 link
      if (isC14Supported) {
        const address = getActiveAddress();
        const tokenId = getTokenId();
        if (address && tokenId) {
          const url = generateC14Link(C14_CLIENT_ID, '100', address, tokenId);
          open(url);
          return;
        }
      }
      
      return;
    } 

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
    <Container color={CONTAINER_COLOR.DARK} safeArea={false}>
      <AssetDetail
        activeWallet={activeWallet}
        activeAsset={activeAsset}
        balanceText={`${balanceText} ${assetInfo?.symbol}`}
        fiatAmount={fiatAmount}
        lockedBalanceText={`${lockedBalanceText} ${assetInfo?.symbol}`}
        fiatLocked={fiatLocked}
        showBuy={showBuyButton}
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
