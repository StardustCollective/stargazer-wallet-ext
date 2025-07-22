import React, { useEffect, useMemo, useState } from 'react';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import type { WalletParam } from 'scripts/Background/messaging';

import { IAssetInfoState } from 'state/assets/types';

import { decodeFromBase64 } from 'utils/encoding';

import { getFeeEstimation } from '../../SendMetagraphData/utils';

import styles from './styles.scss';

export interface ISendMetagraphDataProps {
  sign: boolean;
  payload: string;
  wallet: WalletParam;
  asset: IAssetInfoState;
  fee: { fee: string; address: string; updateHash: string } | null;
  setFee: (fee: { fee: string; address: string; updateHash: string } | null) => void;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const SendMetagraphDataView = ({ payload, sign, wallet, asset, isLoading, fee, setFee, onSign, onReject }: ISendMetagraphDataProps) => {
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);

  const decoded = decodeFromBase64(payload);

  const [isFeeLoading, setFeeLoading] = useState(false);

  useEffect(() => {
    const estimateFee = async () => {
      setFeeLoading(true);
      const feeResponse = await getFeeEstimation(asset, JSON.parse(decoded));
      setFee(feeResponse);
      setFeeLoading(false);
    };

    estimateFee();
  }, []);

  // Parse and format the transaction data
  const transactionData = useMemo(() => {
    try {
      const parsed = JSON.parse(decoded);
      return JSON.stringify(parsed, null, 4);
    } catch (err) {
      // Decoded data is not a valid JSON
      return decodeFromBase64(payload);
    }
  }, [payload]);

  const setFeeAmount = (value: string) => {
    setFee({ fee: value, address: fee?.address ?? '', updateHash: fee?.updateHash ?? '' });
  };

  const title = sign ? 'Sign Metagraph Data Transaction' : 'Send Metagraph Data Transaction';

  return (
    <CardLayoutV3
      title={title}
      logo={current?.logo}
      subtitle={current?.origin}
      fee={{
        show: true,
        defaultValue: '0',
        value: fee?.fee ?? '0',
        symbol: asset?.symbol,
        recommended: '0',
        disabled: fee?.fee === '0',
        loading: isFeeLoading,
        setFee: setFeeAmount,
      }}
      isPositiveButtonLoading={isLoading}
      isPositiveButtonDisabled={isLoading || accountChanged || networkChanged || isFeeLoading}
      onNegativeButtonClick={onReject}
      onPositiveButtonClick={onSign}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
          <CardRow.Token label="Metagraph:" value={{ logo: asset?.logo, symbol: asset?.symbol }} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={transactionData} />
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default SendMetagraphDataView;
