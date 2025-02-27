import { ToastType } from './types';

export const BackgroundColorMap: { [type: string]: string } = {
  [ToastType.warning]: '#FFF',
  [ToastType.error]: '#FEF2F2',
  [ToastType.success]: '#FFF',
  [ToastType.info]: '#EBEFFF',
};

export const BorderColorMap: { [type: string]: string } = {
  [ToastType.warning]: '#FFF',
  [ToastType.success]: '#FFF',
  [ToastType.error]: '#F87171',
  [ToastType.info]: '#798EF6',
};
