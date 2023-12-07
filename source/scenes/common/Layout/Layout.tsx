import React, { FC } from 'react';

import styles from './Layout.scss';
import ILayout from './types';

const Layout: FC<ILayout> = ({ title, children }) => {
  return (
    <>
      <div className={styles.layout}>
        <section className={styles.heading}>
          <span className="heading-1">{title}</span>
        </section>
        <section className={styles.content}>{children}</section>
      </div>
    </>
  );
};

export default Layout;
