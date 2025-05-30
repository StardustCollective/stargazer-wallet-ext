import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckCircle';
import 'assets/styles/global.scss';
import SignTransactionView, {
  ISignTransactionProps,
} from 'scenes/external/views/sign-transaction';
import { useSelector } from 'react-redux';
import assetsSelectors from 'selectors/assetsSelectors';
import { getChainLabel } from 'scripts/Provider/constellation';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import styles from './styles.module.scss';

interface ISignViewProps {
  code: string;
  waiting: boolean;
  waitingMessage: string;
  transactionSigned: boolean;
  onSignPress: () => Promise<void>;
}

const SignView = ({
  waiting,
  code,
  waitingMessage,
  transactionSigned,
  onSignPress,
}: ISignViewProps) => {
  const dagAsset = useSelector(assetsSelectors.getAssetBySymbol('DAG'));

  const network = getChainLabel();

  const {
    message: messageRequest,
    data,
    origin,
  } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
    from: string;
    to: string;
    value: string;
    fee: string;
    deviceId: string;
    publicKey: string;
  }>(location.href);

  const { from, to, value, fee, deviceId } = data;

  const fromDapp = origin !== 'stargazer-wallet';

  const onReject = async (): Promise<void> => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  };

  const props: ISignTransactionProps = {
    title: 'Bitfi - Sign Transaction',
    network,
    asset: dagAsset,
    amount: value,
    fee,
    from,
    to,
    deviceId,
    footer:
      'Please connect your Bitfi device to WiFI to sign the transaction. Only sign transactions on sites you trust.',
    fromDapp,
    containerStyles: styles.container,
    onSign: onSignPress,
    onReject,
  };

  return transactionSigned ? (
    <div className={styles.layout}>
      <section className={styles.heading}>
        <span className="heading-1">Your transaction is underway</span>
      </section>
      <section className={styles.content}>
        <CheckIcon className={styles.checked} />
        <div className="body-description">
          You can follow your transaction under activity on your account screen.
        </div>
      </section>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <SignTransactionView {...props} />
      {waiting && (
        <div className={styles.progressWrapper}>
          <div className={styles.progress}>
            <div>
              <CircularProgress />
            </div>
            <div className={styles.message}>
              <h1 style={{ color: 'white', margin: '0px' }}>{code}</h1>
              <span>{waitingMessage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignView;
