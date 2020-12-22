import React from 'react';
import clsx from 'clsx';
import Header from 'containers/common/Header';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import BulletIcon from '@material-ui/icons/FiberManualRecord';
import RightAngleIcon from '@material-ui/icons/ChevronRightOutlined';
import Button from 'components/Button';

import styles from './Home.scss';
import { ellipsis } from '../helpers';
import { useClipboard } from 'hooks/index';
import useAccount from 'hooks/useAccount';
import Tooltip from 'components/Tooltip';

const Home = () => {
  const accountInfo = useAccount();
  const { copyTooltip, handleCopy } = useClipboard();

  return (
    <div className={styles.wrapper}>
      <Header showLogo />
      <section className={styles.account}>
        Account 1
        <small>
          {ellipsis(accountInfo?.address || '')}
          <Tooltip title={copyTooltip} arrow placement="bottom">
            <IconButton className={styles.copy} onClick={handleCopy}>
              <FileCopyIcon className={styles.icon} />
            </IconButton>
          </Tooltip>
        </small>
      </section>
      <section className={styles.center}>
        <span>DAG Balance</span>
        <h3>{accountInfo?.balance || 0}</h3>
        <small>$20,000.75 USD</small>
        <Button
          type="button"
          theme="primary"
          variant={styles.send}
          linkTo="/send"
        >
          Send
        </Button>
      </section>
      <section className={styles.activity}>
        <div className={styles.heading}>Activity</div>
        <ul>
          <li>
            <div>
              <BulletIcon className={styles.bullet} />
              <span>
                Sent
                <small>1 min ago</small>
              </span>
            </div>
            <div>
              <span>
                1.000 DAG
                <small>$20.00</small>
              </span>
              <RightAngleIcon className={styles.angle} />
            </div>
          </li>
          <li className={clsx({ [styles.receive]: true })}>
            <div>
              <BulletIcon className={styles.bullet} />
              <span>
                Sent
                <small>1 min ago</small>
              </span>
            </div>
            <div>
              <span>
                1.000 DAG
                <small>$20.00</small>
              </span>
              <RightAngleIcon className={styles.angle} />
            </div>
          </li>
        </ul>
        <Button type="button" theme="secondary" variant={styles.more}>
          Load more
        </Button>
      </section>
    </div>
  );
};

export default Home;
