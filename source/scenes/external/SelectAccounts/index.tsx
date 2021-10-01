///////////////////////////
// Modules
///////////////////////////

import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import {
  KeyringNetwork
} from '@stardust-collective/dag4-keyring';


///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import Checkbox from '@material-ui/core/Checkbox';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Icon from 'components/Icon';

///////////////////////////
// Selectors
///////////////////////////

import walletsSelectors from 'selectors/walletsSelectors'

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { withStyles } from '@material-ui/core/styles';
import styles from './index.module.scss';
const PurpleCheckbox = withStyles({
  root: {
    color: '#2B1D52',
    '&$checked': {
      color: '#2B1D52',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

///////////////////////////
// Images
///////////////////////////

import ConstellationIcon from 'assets/images/svg/constellation.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';

///////////////////////////
// Hooks Imports
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Types
///////////////////////////

import { IAccountDerived } from 'state/vault/types';

type ICheckedPayload = {
  name: string;
  address: string;
}

type IAccountItem = {
  accountName: string;
  accountAddress: string;
  accountBalance: string;
  onCheckboxChange: (checked: boolean, payload: ICheckedPayload) => void;
}

enum SCENE_STATE {
  SELECT_ACCOUNTS = 1,
  PERMISSIONS,
}

///////////////////////////
// View
///////////////////////////

const SelectAccounts = () => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const allDagAccounts = useSelector(walletsSelectors.selectAllDagAccounts);
  const allEthAccounts = useSelector(walletsSelectors.selectAllEthAccounts);
  const [accounts, setAccounts] = useState<IAccountDerived[]>([]);
  const [network, setNetwork] = useState<string>("");
  const [selectedAccounts, setSelectedAccounts] = useState<ICheckedPayload[]>([])
  const [sceneState, setSceneState] = useState<SCENE_STATE>(SCENE_STATE.SELECT_ACCOUNTS);
  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

  // Set the account data based on the type of network
  // that is retrieved from the query parameter.
  useEffect(() => {
    const { network } = queryString.parse(location.search);
    setNetwork(network as string);
    if (network === KeyringNetwork.Constellation) {
      setAccounts(allDagAccounts)
    } else if (network === KeyringNetwork.Ethereum) {
      setAccounts(allEthAccounts)
    }
  }, []);

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const handleClose = () => {
    window.close();
  };

  const handleSubmit = async () => {
    controller.dapp.fromUserConnectDApp(origin, current);
    const background = await browser.runtime.getBackgroundPage();

    background.dispatchEvent(
      new CustomEvent('connectWallet', { detail: window.location.hash })
    );

    window.close();
  };

  const onButtonPressed = () => {

  }

  const onCheckboxChange = (checked: boolean, payload: ICheckedPayload) => {
    // Add the account address to the white list.
    if (checked) {
      let accounts = [...selectedAccounts, payload];
      setSelectedAccounts(accounts);
    } else {
      let accounts = selectedAccounts.filter((account) => account.address !== payload.address);
      setSelectedAccounts(accounts);
    }
  }

  ///////////////////////////
  // Renders
  ///////////////////////////

  const RenderAccountItem = ({
    accountName,
    accountAddress,
    accountBalance,
    onCheckboxChange
  }: IAccountItem) => {

    const shortAddress = accountAddress.substring(accountAddress.length - 4)
    const symbol = network === KeyringNetwork.Constellation ? 'DAG' : 'ETH';
    let icon = '';

    if (network === KeyringNetwork.Constellation) {
      icon = ConstellationIcon
    } else if (network === KeyringNetwork.Ethereum) {
      icon = EthereumIcon;
    }

    return (
      <div key={accountAddress} className={styles.walletItem}>
        <div className={styles.walletItemCheckBox}>
          <PurpleCheckbox
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onCheckboxChange(event.target.checked, { name: accountName, address: accountAddress })}
            checked={(selectedAccounts.filter((account) => account.address === accountAddress).length > 0)}
          />
        </div>
        <div className={styles.walletItemIcon}>
          <Icon width={25} Component={icon} iconStyles={styles.icon} />
        </div>
        <div className={styles.walletItemDetails}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {accountName} (...{shortAddress})
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            {accountBalance} {symbol}
          </TextV3.Caption>
        </div>
      </div>
    );

  }

  const RenderContentByState = () => {

    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      return (
        <>
          {accounts.length > 0 && accounts.map((account: IAccountDerived) => (
            <RenderAccountItem
              accountName={account.label}
              accountAddress={account.address}
              accountBalance=""
              onCheckboxChange={onCheckboxChange}
            />
          ))}
        </>
      );
    }

  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.topCircle} />
      <div className={styles.content}>
        <div className={styles.stepsLabel}>
          <TextV3.Caption>1 out 2</TextV3.Caption>
        </div>
        <div className={styles.heading}>
          <img className={styles.logo} src={current.logo} />
          <div className={styles.originLabel}>
            <TextV3.BodyStrong color={COLORS_ENUMS.WHITE}>
              Connect to:
            </TextV3.BodyStrong>
            <TextV3.Body color={COLORS_ENUMS.WHITE}>
              {origin}
            </TextV3.Body>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <TextV3.Header color={COLORS_ENUMS.BLACK}>
                Connect with Stargazer
              </TextV3.Header>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                Select Account(s)
              </TextV3.Caption>
            </div>
            <div className={styles.cardBody}>
              <RenderContentByState />
            </div>
            <div className={styles.cardFooter}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                Only connect with sites you trust.
              </TextV3.Caption>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Next' : 'Connect'}
            extraStyle={styles.nextButton}
            onClick={() => { }}
          />
        </div>
      </div>

    </div >
  );

  // return (
  //   <div className={styles.wrapper}>
  //     <div className={styles.frame}>
  //       <section className={styles.heading}>
  //         <img className={styles.logo} src={current.logo} />
  //         <span>{current.title}</span>
  //       </section>
  //       <div className={styles.title}>
  //         {`Allow this site to\n connect to\n Stargazer Wallet`}
  //       </div>
  //       <label>Only connect to sites you trust</label>
  //       <section className={styles.actions}>
  //         <Button
  //           type="button"
  //           theme="secondary"
  //           variant={clsx(styles.button, styles.close)}
  //           onClick={handleClose}
  //         >
  //           Cancel
  //         </Button>
  //         <Button type="submit" variant={styles.button} onClick={handleSubmit}>
  //           Connect
  //         </Button>
  //       </section>
  //     </div>
  //   </div>
  // );
};

export default SelectAccounts;
