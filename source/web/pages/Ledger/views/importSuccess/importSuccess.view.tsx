/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';

/////////////////////////
// Image Imports
/////////////////////////

import LargeCheckMark from 'assets/images/svg/large-check-mark.svg';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Component
/////////////////////////

function ImportSuccess() {
  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        <div className={styles.instructions}>
          <img src={LargeCheckMark} alt="ledger_icon" width={84} height={84} />
          <span>
            Success! You can now close this tab <br />
            and continue in the wallet
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImportSuccess;
