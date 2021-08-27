///////////////////////
// Modules
///////////////////////

import React from 'react';

///////////////////////
// Styles
///////////////////////

import styles from './Card.scss';

///////////////////////
// Interface
///////////////////////
interface ICardProps {
  children: React.ReactNode;
}

///////////////////////
// Component
///////////////////////

const Card = ({ children }: ICardProps) => {

  return (
    <div className={styles.card}>
      {children}
    </div>
  );

}

export default Card;