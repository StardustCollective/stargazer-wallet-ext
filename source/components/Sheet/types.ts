import { ReactNode } from 'react';

export interface ISheet {
  children: ReactNode;
  title: {
    label: string;
    align?: string;
  };
  height?: number | string;
  isVisible: boolean;
  onClosePress: () => void;
}
