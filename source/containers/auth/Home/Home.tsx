import React from 'react';
import Header from 'containers/common/Header';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import { useCopyClipboard, useController } from 'hooks/index';
import { useFiat } from 'hooks/usePrice';

import { ellipsis } from '../helpers';
import styles from './Home.scss';
import TxsPanel from './TxsPanel';

const Home = () => {
  const controller = useController();
  const getFiatAmount = useFiat();
  const accountInfo = controller.wallet.account.currentAccount();
  const [isCopied, copyText] = useCopyClipboard();

  return (
    <div className={styles.wrapper}>
      <Header showLogo />
      <section className={styles.account}>
        Account 1
        <small>
          {ellipsis(accountInfo?.address || '')}
          <Tooltip
            title={isCopied ? 'Copied' : 'Copy to clipboard'}
            arrow
            placement="bottom"
          >
            <IconButton
              className={styles.copy}
              onClick={() => copyText(accountInfo?.address || '')}
            >
              <FileCopyIcon className={styles.icon} />
            </IconButton>
          </Tooltip>
        </small>
      </section>
      <section className={styles.center}>
        <span>DAG Balance</span>
        <h3>{accountInfo?.balance || 0}</h3>
        <small>{getFiatAmount(accountInfo?.balance || 0)}</small>
        <Button
          type="button"
          theme="primary"
          variant={styles.send}
          linkTo="/send"
        >
          Send
        </Button>
      </section>
      {accountInfo && (
        <TxsPanel
          address={accountInfo.address}
          transactions={accountInfo.transactions}
        />
      )}
    </div>
  );
};

export default Home;
