export type IInputClickableOptions = {
  icon: string;
  title: string;
  value: string;
  items: any;
  containerStyle?: object;
  onClick: () => void;
}

export default interface IInputClickable {
  options: IInputClickableOptions;
}