import React, { ReactNode, FC } from 'react';

import styles from './Layout.scss';

interface ILayout {
  children: ReactNode;
  linkTo?: string;
  showLogo?: boolean;
  title: string;
}

const Layout: FC<ILayout> = ({
  title,
  children,
}) => {
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
