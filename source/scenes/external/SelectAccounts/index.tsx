///////////////////////////
// Modules
///////////////////////////
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';

///////////////////////////
// Components
///////////////////////////
import TextV3 from 'components/TextV3';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Icon from 'components/Icon';

///////////////////////////
// Layouts
///////////////////////////
import CardLayout from 'scenes/external/Layouts/CardLayout';

///////////////////////////
// Selectors
///////////////////////////
import walletsSelectors from 'selectors/walletsSelectors';

///////////////////////////
// Styles
///////////////////////////
import { COLORS_ENUMS } from 'assets/styles/colors';
import { withStyles } from '@material-ui/core/styles';

///////////////////////////
// Images
///////////////////////////
import ConstellationIcon from 'assets/images/svg/constellation.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import StargazerIcon from 'assets/images/svg/stargazerLogoV3.svg';

///////////////////////////
// Hooks Imports
///////////////////////////

import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, ProtocolProvider } from 'scripts/common';
import styles from './index.module.scss';
import dappSelectors from 'selectors/dappSelectors';
import {
  DappMessage,
  DappMessageEvent,
  MessageType,
} from 'scripts/Background/messaging/types';

const PurpleCheckbox = withStyles({
  root: {
    color: '#2B1D52',
    '&$checked': {
      color: '#2B1D52',
    },
  },
  checked: {
    color: '#2B1D52',
  },
})((props: CheckboxProps) => <Checkbox color="default" disabled {...props} />);

///////////////////////////
// Types
///////////////////////////
type IWalletItem = {
  wallet: KeyringWalletState;
};

///////////////////////////
// Enums
///////////////////////////
enum SCENE_STATE {
  SELECT_ACCOUNTS = 1,
  CONNECT,
}

///////////////////////////
// View
///////////////////////////
const SelectAccounts = () => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const allWallets = useSelector(walletsSelectors.selectAllWallets);
  const current = useSelector(dappSelectors.getCurrent);
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);

  const [sceneState, setSceneState] = useState<SCENE_STATE>(SCENE_STATE.SELECT_ACCOUNTS);

  const { message, origin } = StargazerExternalPopups.decodeRequestMessageLocationParams(
    location.href
  );

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const onPositiveButtonPressed = async () => {
    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      setSceneState(SCENE_STATE.CONNECT);
    } else if (sceneState === SCENE_STATE.CONNECT) {
      const currentWallet = allWallets.find((wallet) => wallet.id === activeWallet.id);

      const { accounts } = currentWallet;

      const dagAccounts = accounts
        .filter(({ network }) => network === KeyringNetwork.Constellation)
        .map(({ address }) => address);

      const ethAccounts = accounts
        .filter(({ network }) => network === KeyringNetwork.Ethereum)
        .map(({ address }) => address);

      const network = message.data.chainProtocol;
      const networkAccounts =
        network === ProtocolProvider.CONSTELLATION ? dagAccounts : ethAccounts;

      const dappMessageDAG: DappMessage = {
        type: MessageType.dapp,
        event: DappMessageEvent.connect,
        payload: {
          origin,
          dapp: current,
          network: ProtocolProvider.CONSTELLATION,
          accounts: dagAccounts,
        },
      };

      const dappMessageETH: DappMessage = {
        type: MessageType.dapp,
        event: DappMessageEvent.connect,
        payload: {
          origin,
          dapp: current,
          network: ProtocolProvider.ETHEREUM,
          accounts: ethAccounts,
        },
      };

      // Connect both accounts in the SW store
      chrome.runtime.sendMessage(dappMessageDAG);
      chrome.runtime.sendMessage(dappMessageETH);

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(networkAccounts, message);

      window.close();
    }
  };

  const onNegativeButtonPressed = () => {
    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseError(
        new EIPRpcError('User denied provider activation', EIPErrorCodes.Rejected),
        message
      );
      window.close();
    } else if (sceneState === SCENE_STATE.CONNECT) {
      setSceneState(SCENE_STATE.SELECT_ACCOUNTS);
    }
  };

  ///////////////////////////
  // Renders
  ///////////////////////////

  const RenderWalletItem = ({ wallet }: IWalletItem) => {
    let icon = '';
    let symbolText = '';
    let iconStyle = styles.icon;
    if (
      wallet.type === KeyringWalletType.SingleAccountWallet &&
      wallet.supportedAssets[0] === 'DAG'
    ) {
      icon = ConstellationIcon;
      symbolText = 'DAG';
    } else if (
      wallet.type === KeyringWalletType.SingleAccountWallet &&
      wallet.supportedAssets[0] === 'ETH'
    ) {
      icon = EthereumIcon;
      symbolText = 'ETH';
    } else {
      icon = StargazerIcon;
      symbolText = 'Multi Chain Wallet';
      iconStyle = styles.iconPurple;
    }

    return (
      <div key={wallet.id} className={styles.walletItem}>
        <div className={styles.walletItemCheckBox}>
          <PurpleCheckbox onChange={(_: any) => {}} checked={true} />
        </div>
        <div className={styles.walletItemIcon}>
          <Icon width={25} Component={icon} iconStyles={iconStyle} />
        </div>
        <div className={styles.walletItemDetails}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {wallet.label}
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>{symbolText}</TextV3.Caption>
        </div>
      </div>
    );
  };

  const RenderContentByState = ({ state }: { state: SCENE_STATE }) => {
    if (state === SCENE_STATE.SELECT_ACCOUNTS) {
      return (
        <>
          {allWallets.length > 0 &&
            allWallets.map((wallet: KeyringWalletState) => (
              <RenderWalletItem key={wallet.id} wallet={wallet} />
            ))}
        </>
      );
    }
    if (state === SCENE_STATE.CONNECT) {
      return (
        <div className={styles.connectPermissionsPrompt}>
          <TextV3.Header color={COLORS_ENUMS.BLACK}>Connect To</TextV3.Header>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>
            {allWallets.length} Wallet(s)
          </TextV3.Body>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.allowSitesText}
          >
            Allow this site to:
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.permissionText}>
            View the addresses of your wallets.
          </TextV3.Caption>
        </div>
      );
    }

    return null;
  };

  return (
    <CardLayout
      stepLabel={`${sceneState === SCENE_STATE.SELECT_ACCOUNTS ? '1' : '2'} out 2`}
      originDescriptionLabel="Connect to:"
      headerLabel="Connect with Stargazer"
      captionLabel={
        sceneState === SCENE_STATE.SELECT_ACCOUNTS ? ' ' : 'Grant Permissions'
      }
      negativeButtonLabel={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Cancel' : 'Back'}
      onNegativeButtonClick={onNegativeButtonPressed}
      positiveButtonLabel={
        sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Next' : 'Connect'
      }
      onPositiveButtonClick={onPositiveButtonPressed}
      isPositiveButtonDisabled={allWallets.length === 0}
    >
      <RenderContentByState state={sceneState} />
    </CardLayout>
  );
};

export default SelectAccounts;
