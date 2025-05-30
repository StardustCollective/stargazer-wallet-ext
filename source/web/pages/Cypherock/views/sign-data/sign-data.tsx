import React from 'react';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { useSelector } from 'react-redux';
import dappSelectors from 'selectors/dappSelectors';
import { CypherockService } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';
import type { ISignDataParams } from 'scripts/Provider/constellation';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { decodeFromBase64 } from 'utils/encoding';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import { WalletState } from '../../Cypherock';
import styles from './styles.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

interface ISignDataProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (
    result: any,
    messageRequest: StargazerRequestMessage
  ) => Promise<void>;
  handleErrorResponse: (
    err: unknown,
    messageRequest: StargazerRequestMessage
  ) => Promise<void>;
}

const SignDataView = ({
  service,
  changeState,
  handleSuccessResponse,
  handleErrorResponse,
}: ISignDataProps) => {
  const current = useSelector(dappSelectors.getCurrent);

  const { message: messageRequest, data } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<ISignDataParams>(
      location.href
    );

  const { payload, cypherockId, wallet, chain } = data;

  // Decode base64 data
  const payloadDecoded = decodeFromBase64(payload);
  let message = payloadDecoded;

  try {
    // Try to parse and check if it's a JSON object
    const parsedData = JSON.parse(payloadDecoded);
    if (parsedData) {
      // Pretty-print JSON object
      message = JSON.stringify(parsedData, null, 4);
    }
  } catch (err) {
    // Decoded data is not a valid JSON
    message = payloadDecoded;
  }

  const onSignData = async () => {
    try {
      const walletId = decodeArrayFromBase64(cypherockId);

      changeState(WalletState.VerifyTransaction);

      const { signature } = await service.signDagData({
        walletId,
        derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
        message: payload,
      });

      await handleSuccessResponse(signature, messageRequest);
      changeState(WalletState.SignedSuccess);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('aborted')) {
        return;
      }

      await handleErrorResponse(err, messageRequest);
      changeState(WalletState.SignedError);
    }
  };

  const onReject = () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  };

  return (
    <CardLayoutV3
      logo={current.logo}
      title="Cypherock - Sign Data"
      subtitle={current.origin}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSignData}
      positiveButtonLabel="Sign"
      containerStyles={styles.layoutContainer}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={wallet} />
          <CardRow label="Network:" value={chain} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={message} />
        </Card>
        <TextV3.CaptionRegular color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.CENTER}>
          Only sign messages on sites you trust
        </TextV3.CaptionRegular>
      </div>
    </CardLayoutV3>
  );
};

export default SignDataView;
