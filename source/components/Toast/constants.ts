import { ToastType } from './types';

export const BackgroundColorMap: { [type: string]: string } = {
  [ToastType.warning]: '#FFF',
  [ToastType.error]: '#FFF',
  [ToastType.success]: '#FFF',
  [ToastType.info]: '#EBEFFF',
};

export const BorderColorMap: { [type: string]: string } = {
  [ToastType.warning]: '#FFF',
  [ToastType.success]: '#FFF',
  [ToastType.error]: '#FFF',
  [ToastType.info]: '#798EF6',
};
