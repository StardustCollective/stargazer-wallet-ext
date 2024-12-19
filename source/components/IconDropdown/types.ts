export type IItem = {
  id: string;
  label: string;
  icon?: string | JSX.Element;
  onPressItem: () => void;
};

export type IIconDropdownOptions = {
  icon: string | JSX.Element;
  items: IItem[];
  isOpen: boolean;
  containerStyle?: object;
  onPress: () => void;
  disabled?: boolean;
};

export default interface IIconDropdown {
  options: IIconDropdownOptions;
}
