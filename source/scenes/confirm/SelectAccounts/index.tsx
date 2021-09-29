///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import { browser } from 'webextension-polyfill-ts';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import Checkbox from '@material-ui/core/Checkbox';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Icon from 'components/Icon';

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

import StargazerIcon from 'assets/images/logo-s.svg';

///////////////////////////
// Hooks Imports
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Types
///////////////////////////

type ICheckedPayload = {
  name: string;
  address: string;
}

type IAccountItem = {
  accountName: string;
  accountAddress: string;
  accountBalance: string;
  onCheckboxClicked: (checked: boolean, payload: ICheckedPayload) => void;
}

///////////////////////////
// View
///////////////////////////

const SelectAccounts = () => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

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

  const onCheckboxClicked = (checked: boolean, payload: ICheckedPayload) => {
    // Add the account address to the white list.
    if (checked) {
      console.log(payload);
    } else {
      // Remove the account address from the white list.
    }
  }

  ///////////////////////////
  // Renders
  ///////////////////////////

  const RenderAccountItem = ({
    accountName,
    accountAddress,
    accountBalance,
    onCheckboxClicked
  }: IAccountItem) => {

    const shortAddress = accountAddress.substring(accountAddress.length - 8)

    return (
      <div className={styles.walletItem}>
        <div className={styles.walletItemCheckBox}>
          <PurpleCheckbox
            onChange={(event) => onCheckboxClicked(event.target.checked, { name: accountName, address: accountAddress })}
          />
        </div>
        <div className={styles.walletItemIcon}>
          <Icon width={25} Component={StargazerIcon} iconStyles={styles.icon} />
        </div>
        <div className={styles.walletItemDetails}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {accountName} (...{shortAddress})
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            {accountBalance} DAG
          </TextV3.Caption>
        </div>
      </div>
    );

  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topCircle} />
      <div className={styles.content}>
        <div className={styles.stepsLabel}>
          <TextV3.Caption>1 out 2</TextV3.Caption>
        </div>
        <div className={styles.heading}>
          <img className={styles.logo} src={'chrome://favicon/size/64@1x/https://www.pinterest.com'} />
          <div className={styles.originLabel}>
            <TextV3.BodyStrong color={COLORS_ENUMS.WHITE}>
              Connect to:
            </TextV3.BodyStrong>
            <TextV3.Body color={COLORS_ENUMS.WHITE}>
              www.pinterest.com
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
              <RenderAccountItem
                accountName="Account 1"
                accountAddress="1239812h1298h12983e1h893e1983e13319h8"
                accountBalance="1523"
                onCheckboxClicked={onCheckboxClicked}
              />
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
            label={'Next'}
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
