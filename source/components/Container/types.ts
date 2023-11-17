import { FC, ReactNode } from 'react';
import { CONTAINER_COLOR } from './';

export default interface IContainer {
  children: FC[] | ReactNode;
  safeArea?: boolean;
  color?: CONTAINER_COLOR;
  maxHeight?: boolean;
  showHeight?: boolean;
}
