/// ////////////////////
// Modules
/// ////////////////////

import React from 'react';
import clsx from 'clsx';

/// ////////////////////
// Styles
/// ////////////////////

import styles from './Card.scss';

/// ////////////////////
// Interface
/// ////////////////////
interface ICardProps {
  children?: React.ReactNode;
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: {};
}

/// ////////////////////
// Component
/// ////////////////////

const Card = ({ id, children, disabled, onClick, style = {} }: ICardProps) => {
  const onClickFn = disabled ? null : onClick;
  const cardStyle = clsx(styles.card, style);
  return (
    <div key={id} id={id} onClick={onClickFn} className={cardStyle}>
      {children}
    </div>
  );
};

export default Card;
