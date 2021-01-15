import React, { FC } from 'react';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/esm/formatDistanceToNow';
import { Transaction } from '@stardust-collective/dag4-network';
import BulletIcon from '@material-ui/icons/FiberManualRecord';
import RightAngleIcon from '@material-ui/icons/ChevronRightOutlined';
import { useFiat } from 'hooks/usePrice';

import styles from './Home.scss';

interface ITxsPanel {
  address: string;
  transactions: Transaction[];
}

const TxsPanel: FC<ITxsPanel> = ({ address, transactions }) => {
  const getFiatAmount = useFiat();

  return (
    <section className={styles.activity}>
      <div className={styles.heading}>Activity</div>
      <ul>
        {transactions.map((tx: Transaction) => {
          const isRecived = tx.receiver === address;
          console.log(tx);
          return (
            <li className={clsx({ [styles.receive]: isRecived })} key={tx.hash}>
              <div>
                <BulletIcon className={styles.bullet} />
                <span>
                  {isRecived ? 'Received' : 'Sent'}
                  <small>
                    {`${formatDistanceToNow(new Date(tx.timestamp))} ago`}
                  </small>
                </span>
              </div>
              <div>
                <span>
                  {tx.amount / 1e8} DAG
                  <small>{getFiatAmount(tx.amount / 1e8, 8)}</small>
                </span>
                <RightAngleIcon className={styles.angle} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TxsPanel;
