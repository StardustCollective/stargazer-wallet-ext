//////////////////////
// Modules Imports
///////////////////// 

import React from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import TextV3 from 'components/TextV3';
import { browser } from 'webextension-polyfill-ts';

//////////////////////
// Common Layouts
///////////////////// 

import CardLayout from 'scenes/external/Layouts/CardLayout';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './index.module.scss';


//////////////////////
// Component
///////////////////// 

const ApproveSpend = () => {

  //////////////////////
  // Hooks
  ///////////////////// 

  const history = useHistory();
  const { route } = queryString.parse(location.search);

  //////////////////////
  // Callbacks
  ///////////////////// 

  const onNegativeButtonClick = () => {
    window.close();
  }

  const onPositiveButtonClick = async () => {

    const background = await browser.runtime.getBackgroundPage();

    background.dispatchEvent(
      new CustomEvent('spendApproved', { detail: { hash: window.location.hash, approved: true } })
    );

    window.close();
  }

  //////////////////////
  // Renders
  ///////////////////// 

  return (
    <CardLayout
      stepLabel={``}
      originDescriptionLabel={'Grant permissions to:'}
      headerLabel={'Grant Permissions'}
      captionLabel={''}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Confirm'}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <TextV3.Caption color={COLORS_ENUMS.BLACK}>
          Do you trust this site? By granting permissions you're allowing this site to withdraw your LTX and automate transaction for you.
        </TextV3.Caption>
        <div className={styles.transactionFee}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            Transaction Fee
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            A fee is associated with this request.
          </TextV3.Caption>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            $0.45
          </TextV3.CaptionStrong>
        </div>
      </div>
    </CardLayout>
  );
};

export default ApproveSpend;
