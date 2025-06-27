import React from 'react';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './Header.scss';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <TextV3.BodyStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.title}>
        {title}
      </TextV3.BodyStrong>
    </div>
  );
};

export default Header;
