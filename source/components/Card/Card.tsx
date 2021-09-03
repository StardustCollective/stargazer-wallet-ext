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
  children?: React.ReactNode;
  onClick?: () => void;
}

///////////////////////
// Component
///////////////////////

const Card = ({ children, onClick }: ICardProps) => {

  return (
    <div onClick={onClick} className={styles.card}>
      {children}
    </div>
  );

}

export default Card;