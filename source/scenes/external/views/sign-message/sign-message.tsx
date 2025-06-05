import React from 'react';
import { useSelector } from 'react-redux';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import type { StargazerSignatureRequest } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import styles from './styles.scss';

export interface ISignMessageProps {
  title: string;
  isDagSignature: boolean;
  message: StargazerSignatureRequest;
  footer?: string;
  onSign: () => Promise<void>;
  onReject: () => void;
}

const SignMessageView = ({ title, message, isDagSignature, footer, onSign, onReject }: ISignMessageProps) => {
  const { current, activeWallet, constellationNetwork, evmNetwork } = useExternalViewData();
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);
  const network = isDagSignature ? constellationNetwork : evmNetwork;

  let parsedMetadata: any = null;

  try {
    if (!!message?.metadata && Object.keys(message.metadata).length > 0) {
      // Pretty-print JSON object
      parsedMetadata = JSON.stringify(message.metadata, null, 4);
    }
  } catch (err) {
    // Decoded data is not a valid JSON
    parsedMetadata = null;
  }

  return (
    <CardLayoutV3 logo={current.logo} title={title} subtitle={current.origin} onNegativeButtonClick={onReject} negativeButtonLabel="Reject" onPositiveButtonClick={onSign} positiveButtonLabel="Sign">
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} />
          <CardRow label="Network:" value={network} />
          {!!deviceId && <CardRow label="Device ID:" value={deviceId} />}
        </Card>
        <Card>
          <div className={styles.content}>
            <div className={styles.block}>
              <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
                Message:
              </TextV3.CaptionStrong>
              <TextV3.CaptionRegular extraStyles={styles.message}>{message.content}</TextV3.CaptionRegular>
            </div>
            {!!parsedMetadata && (
              <div className={styles.block}>
                <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
                  Metadata:
                </TextV3.CaptionStrong>
                <TextV3.CaptionRegular extraStyles={styles.message}>{parsedMetadata}</TextV3.CaptionRegular>
              </div>
            )}
          </div>
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

export default SignMessageView;
