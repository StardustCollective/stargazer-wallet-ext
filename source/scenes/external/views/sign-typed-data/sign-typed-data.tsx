import React from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import type { MessagePayload } from 'scripts/Provider/evm';

import styles from './styles.scss';

export interface ISignTypedDataProps {
  title: string;
  typedData: MessagePayload;
  footer?: string;
  onSign: () => Promise<void>;
  onReject: () => void;
}

const SignTypedDataView = ({ title, typedData, footer, onSign, onReject }: ISignTypedDataProps) => {
  const { current, activeWallet, evmNetwork } = useExternalViewData();

  const domainString = typedData?.domain?.name || 'Unknown';
  const contractAddress = typedData?.domain?.verifyingContract || '';

  let parsedMessage = '';
  try {
    if (typedData?.message && typeof typedData.message === 'object') {
      // Pretty-print JSON object
      parsedMessage = JSON.stringify(typedData.message, null, 4);
    } else {
      parsedMessage = String(typedData?.message || '');
    }
  } catch (err) {
    parsedMessage = String(typedData?.message || '');
  }

  return (
    <CardLayoutV3 logo={current?.logo} title={title} subtitle={current?.origin} onNegativeButtonClick={onReject} negativeButtonLabel="Reject" onPositiveButtonClick={onSign} positiveButtonLabel="Sign">
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} />
        </Card>
        <Card>
          <CardRow label="Domain:" value={domainString} />
          <CardRow label="Network:" value={evmNetwork} />
          {!!contractAddress && <CardRow.Address label="Contract:" value={contractAddress} />}
        </Card>
        <Card>
          <CardRow.Object label="Message:" value={parsedMessage} />
        </Card>
        {!!footer && (
          <TextV3.CaptionRegular color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.CENTER}>
            {footer}
          </TextV3.CaptionRegular>
        )}
      </div>
    </CardLayoutV3>
  );
};

export default SignTypedDataView;
