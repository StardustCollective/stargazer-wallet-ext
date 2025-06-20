import React from 'react';
import Header from '../Header';
import Footer, { ButtonProps } from '../Footer';
import styles from './Layout.scss';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
};

const Layout = ({ title, primaryButton, secondaryButton, children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header title={title} />
      <div className={styles.content}>{children}</div>
      <Footer primaryButton={primaryButton} secondaryButton={secondaryButton} />
    </div>
  );
};

export default Layout;
