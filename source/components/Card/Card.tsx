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
  id?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

///////////////////////
// Component
///////////////////////

const Card = ({ id, children, onClick }: ICardProps) => {

  return (
    <div id={id} onClick={onClick} className={styles.card}>
      {children}
    </div>
  );

}

export default Card;