import { ReactNode } from 'react';

export interface IModal {
  visible: boolean;
  children: ReactNode;
  containerStyle?: any;
  onBackdropPress?: () => void;
}
