export type IItem = {
  value: string;
  label: string;
  icon: string;
};

export type IInputClickableOptions = {
  icon: string;
  title: string;
  value: string;
  items: IItem[];
  containerStyle?: object;
  onClick: () => void;
}

export default interface IInputClickable {
  options: IInputClickableOptions;
}