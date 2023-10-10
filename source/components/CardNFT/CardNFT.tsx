import React, { FC } from 'react';
// import clsx from 'clsx';
// import TextV3 from 'components/TextV3';
import ICardNFT from './types';
import styles from './CardNFT.scss';

const CardNFT: FC<ICardNFT> = ({}): JSX.Element => {
  return <div onClick={() => null} className={styles.container}></div>;
};

export default CardNFT;
