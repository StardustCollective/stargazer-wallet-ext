import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import Tooltip from 'components/Tooltip';
import Card from '../components/Card/Card';
import CardRow from '../components/CardRow/CardRow';
import TextV3 from 'components/TextV3';
import CopyIcon from 'assets/images/svg/copy.svg';
import { useCopyClipboard } from 'hooks/index';
import dappSelectors from 'selectors/dappSelectors';
import assetsSelectors from 'selectors/assetsSelectors';
import styles from './index.scss';
import { ellipsis } from 'scenes/home/helpers';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { AllowSpendData } from './types';
import { toDag, toDatum } from 'utils/number';
import { IAssetInfoState } from 'state/assets/types';
import VaultSelectors from 'selectors/vaultSelectors';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DAG_NETWORK } from 'constants/index';
import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import { differenceBetweenEpochs } from 'utils/epochs';
import { usePlatformAlert } from 'utils/alertUtil';

const renderMetagraphValue = (destinationInfo: {
  isMetagraph: boolean;
  logo: string;
  label: string;
}) => {
  if (!destinationInfo?.isMetagraph) return null;

  return (
    <div className={styles.valueContainer}>
      <img src={destinationInfo?.logo} alt="Metagraph logo" className={styles.logo} />
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {destinationInfo?.label}
      </TextV3.CaptionRegular>
    </div>
  );
};

const renderTokenValue = (tokenAsset: IAssetInfoState) => {
  return (
    <div className={styles.valueContainer}>
      <img src={tokenAsset?.logo} alt="Token logo" className={styles.logo} />
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {tokenAsset?.symbol}
      </TextV3.CaptionRegular>
    </div>
  );
};

const renderEpochValue = (epochValue: number, latestEpoch: number) => {
  return (
    <div className={styles.epochContainer}>
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {epochValue.toLocaleString()}
      </TextV3.CaptionRegular>
      <TextV3.CaptionRegular extraStyles={styles.label}>
        {`~ ${differenceBetweenEpochs(latestEpoch, epochValue)}`}
      </TextV3.CaptionRegular>
    </div>
  );
};

const renderCopyAddress = (
  address: string,
  textTooltip: string,
  copyAddress: (address: string) => void
) => {
  return (
    <Tooltip title={textTooltip} placement="bottom" arrow>
      <div className={styles.copyAddressContainer} onClick={() => copyAddress(address)}>
        <TextV3.CaptionStrong extraStyles={styles.copyAddress}>
          {ellipsis(address)}
        </TextV3.CaptionStrong>
        <img src={`/${CopyIcon}`} alt="Copy" />
      </div>
    </Tooltip>
  );
};

const AllowSpend = () => {
  const assets = store.getState().assets;
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';
  const showAlert = usePlatformAlert();

  const [feeValue, setFeeValue] = useState('0');

  const current = useSelector(dappSelectors.getCurrent);
  const dagActiveNetwork = useSelector(
    VaultSelectors.getActiveNetworkByChain(KeyringNetwork.Constellation)
  );

  // Get token asset information
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  // Only after all hooks are called, access data
  const { data, message } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<AllowSpendData>(
      location.href
    );

  const {
    walletLabel,
    chainLabel,
    destination,
    destinationInfo,
    spenderInfo,
    amount: amountValue,
    approvers,
    currencyId,
    fee,
    validUntilEpoch,
    latestEpoch,
  } = data;

  // Convert amount and fee to DAG
  const feeAmount = toDag(fee);
  const amount = toDag(amountValue);

  // This hook depends on currencyId, so it must come after data processing
  // but before any conditional returns
  const tokenAssetByCurrency =
    currencyId && Object.values(assets).find((asset) => asset?.address === currencyId);

  // After all hooks have been called, we can use derived state and conditionals
  const origin = current && current.origin;
  const spenderAddress = approvers[0];

  // Determine token asset and L1 URL after all hooks have been called
  let tokenAsset: IAssetInfoState | null = null;
  let tokenL1Url: string | null = null;

  if (!currencyId && dagAsset) {
    // If no currencyId is provided, use DAG as the default currency
    tokenAsset = dagAsset;
    tokenL1Url = DAG_NETWORK[dagActiveNetwork]?.config?.l1Url || null;
  } else if (tokenAssetByCurrency) {
    tokenAsset = tokenAssetByCurrency;
    tokenL1Url = tokenAssetByCurrency?.l1endpoint || null;
  }

  if (!tokenAsset || !tokenL1Url) {
    return null;
  }

  useEffect(() => {
    if (feeAmount !== null && feeAmount !== undefined) {
      setFeeValue(feeAmount.toString());
    }
  }, [feeAmount]);

  const amountString = `${amount.toLocaleString()} ${tokenAsset.symbol}`;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );
    window.close();
  };

  const onPositiveButtonClick = async () => {
    try {
      const approveSpendBody = {
        source: data.source,
        destination: data.destination,
        approvers: data.approvers,
        amount: data.amount,
        fee: toDatum(feeValue),
        currencyId: data.currencyId,
        validUntilEpoch: data.validUntilEpoch,
        tokenL1Url,
      };

      const allowSpendResponse = await dag4.account.postAllowSpend(approveSpendBody);

      if (!allowSpendResponse || !allowSpendResponse?.hash) {
        throw new Error('Failed to generate signed allow spend transaction');
      }

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(allowSpendResponse.hash, message);
    } catch (e) {
        showAlert(
          `There was an error with the transaction.\nPlease try again later.`,
          'danger'
        );
        StargazerExternalPopups.addResolvedParam(location.href);
        StargazerWSMessageBroker.sendResponseError(e, message);
        return;
    }

    window.close();
  };

  return (
    <CardLayoutV3
      logo={current?.logo}
      title="AllowSpend"
      subtitle={origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: feeValue,
        symbol: tokenAsset.symbol,
        disabled: false,
        setFee: setFeeValue,
      }}
      onNegativeButtonClick={onNegativeButtonClick}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={walletLabel} />
          <CardRow label="Network:" value={chainLabel} />
          {destinationInfo?.isMetagraph && (
            <CardRow label={'Metagraph:'} value={renderMetagraphValue(destinationInfo)} />
          )}
        </Card>
        <Card>
          <CardRow label="Token:" value={renderTokenValue(tokenAsset)} />
          <CardRow label="Amount:" value={amountString} />
          <CardRow
            label="Valid Until Epoch:"
            value={renderEpochValue(validUntilEpoch, latestEpoch)}
          />
        </Card>
        <Card>
          {!destinationInfo?.isMetagraph && (
            <CardRow
              label="Destination:"
              value={renderCopyAddress(destination, textTooltip, copyAddress)}
            />
          )}
          <CardRow
            label="Allowed Spender:"
            value={renderCopyAddress(spenderAddress, textTooltip, copyAddress)}
          />
        </Card>
        <Card>
          <TextV3.CaptionRegular extraStyles={styles.description}>
            Allow{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {spenderInfo?.isMetagraph ? spenderInfo?.label : ellipsis(spenderAddress)}
            </TextV3.CaptionStrong>{' '}
            to spend{' '}
            <TextV3.CaptionStrong extraStyles={styles.descriptionStrong}>
              {amountString}
            </TextV3.CaptionStrong>{' '}
            from your wallet. These tokens will be temporarily locked in your wallet until
            {spenderInfo?.isMetagraph ? ' the Metagraph spends them.' : ` it's spend.`}
          </TextV3.CaptionRegular>
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export * from './types';
export default AllowSpend;
