export type IItem = {
  value: string;
  label: string;
  icon: string;
};

export type IInputClickableOptions = {
  title: string;
  value: string;
  items: IItem[];
  containerStyle?: object;
  onClick?: () => void;
  disabled?: boolean;
  labelRight?: string;
};

export default interface IInputClickable {
  options: IInputClickableOptions;
  titleStyles?: any;
}
