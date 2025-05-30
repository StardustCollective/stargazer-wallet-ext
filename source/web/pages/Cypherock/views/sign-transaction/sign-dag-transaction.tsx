import React from 'react';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { useSelector } from 'react-redux';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import {
  EIPErrorCodes,
  EIPRpcError,
  ProtocolProvider,
  StargazerRequestMessage,
} from 'scripts/common';
import { WalletState } from '../../Cypherock';
import { dag4 } from '@stardust-collective/dag4';
import type { PostTransactionV2 } from '@stardust-collective/dag4-keystore';
import type { ISignTxnData } from '@cypherock/sdk-app-constellation';
import { getChainLabel } from 'scripts/Provider/constellation';
import assetsSelectors from 'selectors/assetsSelectors';
import { usePlatformAlert } from 'utils/alertUtil';
import SignTransactionView, {
  ISignTransactionProps,
} from 'scenes/external/views/sign-transaction';
import styles from './styles.scss';

interface ISignMessageProps {
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

const SignTxnView = ({
  service,
  changeState,
  handleSuccessResponse,
  handleErrorResponse,
}: ISignMessageProps) => {
  const showAlert = usePlatformAlert();

  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const network = getChainLabel();

  const {
    message: messageRequest,
    data,
    origin,
  } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
    from: string;
    to: string;
    value: number;
    fee: number;
    chain: ProtocolProvider;
    cypherockId: string;
    publicKey: string;
  }>(location.href);

  const { from, to, value: amount, fee, cypherockId, publicKey } = data;

  const fromDapp = origin !== 'stargazer-wallet';

  const onSign = async () => {
    try {
      if (!publicKey) {
        throw new CypherockError('No public key found', ErrorCode.UNKNOWN);
      }

      const walletId = decodeArrayFromBase64(cypherockId);
      const lastRef = await dag4.network.getAddressLastAcceptedTransactionRef(from);

      // Prepare transaction
      const { tx }: { tx: PostTransactionV2 } = dag4.keyStore.prepareTx(
        amount,
        to,
        from,
        lastRef,
        fee,
        '2.0'
      );

      const txn: ISignTxnData = {
        txn: {
          ...tx.value,
          amount: tx.value.amount.toString(), // amount should be converted to string
          salt: BigInt(tx.value.salt as string).toString(16),
        },
      };

      changeState(WalletState.VerifyTransaction);

      const { signature } = await service.signDagTransaction({
        walletId,
        derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
        txn,
      });

      if (!signature) {
        throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
      }

      // Add the signature to the transaction
      tx.proofs = [
        {
          id: publicKey.substring(2), // Remove 04 prefix
          signature,
        },
      ];

      // Post transaction to the network
      const txHash = await dag4.network.postTransaction(tx);

      if (!txHash) {
        throw new CypherockError('No transaction hash found', ErrorCode.UNKNOWN);
      }

      await handleSuccessResponse(txHash, messageRequest);
      changeState(WalletState.SignedSuccess);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const { message } = err;

        if (message.includes('aborted')) {
          return;
        }

        if (message.includes('InsufficientBalance')) {
          showAlert('Insufficient balance', 'danger');
          return;
        }

        if (message.includes('TransactionLimited')) {
          showAlert(
            'Feeless Transaction Limit Reached. Please try again with a higher fee.',
            'danger'
          );
          return;
        }
      }

      await handleErrorResponse(err, messageRequest);
      changeState(WalletState.SignedError);
    }
  };

  const onReject = async (): Promise<void> => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  };

  const props: ISignTransactionProps = {
    title: 'Cypherock - Sign Transaction',
    network,
    asset: dagAsset,
    amount,
    fee,
    from,
    to,
    footer: 'Only sign transactions on sites you trust',
    fromDapp,
    containerStyles: styles.container,
    onSign,
    onReject,
  };

  return <SignTransactionView {...props} />;
};

export default SignTxnView;
