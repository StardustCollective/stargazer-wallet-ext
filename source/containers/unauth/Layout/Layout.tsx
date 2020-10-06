import React, { ReactNode, FC } from 'react';
import Header from 'containers/common/Header';

import styles from './Layout.scss';

interface ILayout {
  children: ReactNode;
  title: string;
}

const Layout: FC<ILayout> = ({ title, children }) => {
  return (
    <>
      <Header />
      <div className={styles.layout}>
        <section className={styles.heading}>
          <span className="heading-1 t-purple">{title}</span>
        </section>
        <section className={styles.content}>{children}</section>
      </div>
    </>
  );
};

export default Layout;
