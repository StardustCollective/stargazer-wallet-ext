import { ReactNode } from 'react';

export interface ISheet {
  children: ReactNode;
  title: {
    label: string | JSX.Element;
    align?: string;
  };
  showCloseButton?: boolean;
  height?: number | string;
  snaps?: number[];
  isVisible: boolean;
  backdropOpacity?: number;
  onClosePress: () => void;
}
