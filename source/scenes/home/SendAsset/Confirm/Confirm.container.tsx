import { useLinkTo } from '@react-navigation/native';
import { ethers } from 'ethers';
import find from 'lodash/find';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Container, { CONTAINER_COLOR } from 'components/Container';

import { DEFAULT_LANGUAGE } from 'constants/index';

import { useFiat } from 'hooks/usePrice';

import { getChainId, getNativeToken, getNetworkFromChainId, getNetworkIdFromChainId, getPriceId } from 'scripts/Background/controllers/EVMChainController/utils';
import { StargazerExternalPopups } from 'scripts/Background/messaging';
import { isError, StargazerChain, StargazerRequestMessage } from 'scripts/common';
import { ITransactionInfo } from 'scripts/types';

import { initialState as initialStateAssets } from 'state/assets';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IActiveAssetState, IWalletState } from 'state/vault/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { CHAIN_FULL_ASSET } from 'utils/assetsUtil';
import { getAccountController } from 'utils/controllersUtils';
import erc20 from 'utils/erc20.json';
import { getHardwareWalletPage, isHardware } from 'utils/hardware';
import { toDatum } from 'utils/number';

import { ExternalRoute } from 'web/pages/External/types';

import { SignTransactionDataDAG, SignTransactionDataEVM, TransactionType } from '../../../external/SignTransaction/types';

import Confirm from './Confirm';

export const DAG_SMALL_FEE = 0.002;

const ConfirmContainer = () => {
  const showAlert = usePlatformAlert();

  const [isModalVisible, setIsModalVisible] = useState(false);

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let activeWallet: IWalletState;
  let history: any;
  let isExternalRequest: boolean;
  let isTransfer = false;

  if (location) {
    isExternalRequest = location.pathname.includes(ExternalRoute.ConfirmTransaction);
  }

  const accountController = getAccountController();
  // const alert = useAlert();
  const linkTo = useLinkTo();
  const vault: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  let assetInfo: IAssetInfoState;
  const vaultActiveAsset = vault.activeAsset;

  if (isExternalRequest) {
    const { data } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
      isTransfer: boolean;
    }>(location.href);
    const { to, chain, metagraphAddress } = StargazerExternalPopups.decodeLocationParams(location.href);

    isTransfer = data.isTransfer;

    activeAsset = useSelector((state: RootState) => find(state.assets, { address: Array.isArray(to) ? to[0] : to })) as IAssetInfoState;

    if (!activeAsset) {
      if (!chain) {
        // Set ETH as the default activeAsset if 'chain' is not provided
        activeAsset = useSelector((state: RootState) => find(state.assets, { id: AssetType.Ethereum })) as IAssetInfoState;
      }

      if (chain === StargazerChain.CONSTELLATION && !!metagraphAddress) {
        activeAsset = useSelector((state: RootState) => find(state.assets, { address: metagraphAddress as string })) as IAssetInfoState;
      } else {
        activeAsset = CHAIN_FULL_ASSET[chain as keyof typeof CHAIN_FULL_ASSET];
      }
    }

    if (!vaultActiveAsset || activeAsset.id !== vaultActiveAsset.id) {
      // Update activeAsset so NetworkController doesn't fail
      accountController.updateAccountActiveAsset(activeAsset);
    }

    activeWallet = vault.activeWallet;
    assetInfo = assets[activeAsset.id] || initialStateAssets[activeAsset.id];

    history = useHistory();
  } else {
    activeAsset = vault.activeAsset;
    activeWallet = vault.activeWallet;
    assetInfo = assets[activeAsset.id];
  }

  const getFiatAmount = useFiat(false, assetInfo);

  const assetNetwork = assets[activeAsset?.id]?.network || initialStateAssets[activeAsset?.id]?.network;
  const feeUnit = assetInfo.type === AssetType.Constellation ? assetInfo.symbol : getNativeToken(assetNetwork);

  const tempTx = accountController.getTempTx();
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isL0token = !!assetInfo?.l0endpoint;

  const getSendAmount = () => {
    const fiatAmount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8, assetInfo.priceId));

    return fiatAmount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getFeeAmount = () => {
    const amount = getFeeAmountNumber();

    return amount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getFeeAmountNumber = () => {
    let { priceId } = assetInfo;

    if (activeAsset.type === AssetType.ERC20) {
      priceId = getPriceId(assetNetwork);
    }

    return Number(getFiatAmount(Number(tempTx?.fee || 0), 8, priceId));
  };

  const getTotalAmount = () => {
    if (isL0token) {
      const amount = Number(tempTx?.amount || 0) + Number(tempTx?.fee || 0);
      return amount.toFixed(2);
    }

    let amount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8));
    amount += getFeeAmountNumber();

    return amount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getDagSmallFeeAmount = () => {
    return Number(getFiatAmount(DAG_SMALL_FEE, 8, 'constellation-labs')).toFixed(4);
  };

  const handleCancel = () => {
    if (isExternalRequest) {
      history.goBack();
    } else {
      linkTo('/send');
    }
  };

  const handleConfirm = async (
    callbackSuccess: (message: StargazerRequestMessage, origin: string, ...args: any[]) => void | null = null,
    callbackError: (message: StargazerRequestMessage, origin: string, ...args: any[]) => void | null = null
  ) => {
    setDisabled(true);

    try {
      if (isExternalRequest) {
        const { message, origin } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

        let trxHash: string;
        if (activeAsset.type === AssetType.Constellation) {
          trxHash = await accountController.confirmTempTx();
          setConfirmed(true);
        } else {
          const txConfig: ITransactionInfo = {
            fromAddress: tempTx.fromAddress,
            toAddress: tempTx.toAddress,
            timestamp: Date.now(),
            amount: tempTx.amount,
            ethConfig: tempTx.ethConfig,
            isTransfer: tempTx.isTransfer,
            onConfirmed: () => {
              // NOOP
            },
          };

          accountController.updateTempTx(txConfig);
          trxHash = await accountController.confirmContractTempTx(activeAsset);
        }

        if (callbackSuccess && !!trxHash) {
          callbackSuccess(message, origin, trxHash);
        } else {
          callbackError(message, origin, 'Unable to confirm transaction');
        }
      } else if (isHardware(activeWallet.type)) {
        const windowUrl = getHardwareWalletPage(activeWallet.type);
        const windowSize = { width: 1000, height: 1000 };
        const windowType = 'normal';
        let data: SignTransactionDataDAG | SignTransactionDataEVM;

        if (activeAsset.type === AssetType.Constellation) {
          const transactionType = activeAsset.id === AssetType.Constellation ? TransactionType.DagNative : TransactionType.DagMetagraph;

          const metagraphObject =
            activeAsset.id === AssetType.Constellation
              ? {}
              : {
                  metagraphAddress: assetInfo.address,
                };

          data = {
            transaction: {
              from: tempTx.fromAddress,
              to: tempTx.toAddress,
              value: toDatum(tempTx.amount),
              fee: toDatum(tempTx.fee) ?? 0,
            },

            extras: {
              chain: StargazerChain.CONSTELLATION,
              type: transactionType,
              ...metagraphObject,
            },
          } as SignTransactionDataDAG;
        } else {
          const chain = getNetworkIdFromChainId(assetInfo.network) as StargazerChain;
          const network = getNetworkFromChainId(assetNetwork);
          const activeChain = vault.activeNetwork[network as keyof typeof vault.activeNetwork];
          const activeChainId = getChainId(activeChain);

          if (activeAsset.type === AssetType.Ethereum) {
            data = {
              transaction: {
                chainId: activeChainId,

                from: tempTx.fromAddress,
                to: tempTx.toAddress,
                value: ethers.utils.parseEther(tempTx.amount).toString(),
              },

              extras: {
                chain,
                type: TransactionType.EvmNative,
              },
            };
          }

          if (activeAsset.type === AssetType.ERC20) {
            const to = assetInfo.address;
            const recipient = tempTx.toAddress;
            const iface = new ethers.utils.Interface(erc20);
            const amount = ethers.utils.parseUnits(tempTx.amount, assetInfo.decimals).toNumber();
            const hexData = iface.encodeFunctionData('transfer', [recipient, amount]);

            data = {
              transaction: {
                chainId: activeChainId,

                from: tempTx.fromAddress,
                to,
                data: hexData,
              },

              extras: {
                chain,
                type: TransactionType.Erc20Transfer,
              },
            };
          }
        }

        StargazerExternalPopups.executePopup({
          params: {
            data,
            origin: 'stargazer-wallet',
            route: ExternalRoute.SignTransaction,
          },
          size: windowSize,
          type: windowType,
          url: windowUrl,
        });
        return;
      } else {
        await accountController.confirmTempTx();
        setConfirmed(true);
      }
    } catch (e) {
      if (isError(e)) {
        if (e.message.includes('insufficient funds') && [AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
          e.message = 'Insufficient funds to cover gas fee.';
        }

        if (e.message.includes('cannot send a transaction to itself')) {
          e.message = 'An address cannot send a transaction to itself';
        }

        if (e.message.includes('TransactionLimited') && assetInfo?.type === AssetType.Constellation) {
          setIsModalVisible(true);
        } else {
          showAlert(e.message, 'danger');
        }
        console.log('ERROR', e);

        if (!location?.href) return;

        if (isExternalRequest) {
          const { message, origin } = StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

          if (callbackError) {
            callbackError(message, origin, e.message);
          }
        }
      }
      console.error(e);
    }
  };

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} showHeight={!isExternalRequest}>
      <Confirm
        isExternalRequest={isExternalRequest}
        confirmed={confirmed}
        activeAsset={activeAsset}
        tempTx={tempTx}
        assetInfo={assetInfo}
        getSendAmount={getSendAmount}
        activeWallet={activeWallet}
        feeUnit={feeUnit}
        getFeeAmount={getFeeAmount}
        getTotalAmount={getTotalAmount}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        disabled={disabled}
        isL0token={isL0token}
        isTransfer={isTransfer}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        getDagSmallFeeAmount={getDagSmallFeeAmount}
      />
    </Container>
  );
};

export default ConfirmContainer;
