import { FC, ReactNode } from 'react';

export default interface IContainer {
  children: FC[] | ReactNode;
  safeArea: boolean;
}
