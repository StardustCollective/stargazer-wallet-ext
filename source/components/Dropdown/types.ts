import { IItem } from 'scenes/settings/Networks/types';

export type IDropdownOptions = {
  icon?: string;
  title?: string;
  value: string;
  items: IItem[];
  isOpen: boolean;
  containerStyle?: object;
  onChange: (value: string) => void;
  toggleItem: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  displayValue?: boolean;
};

export default interface IDropdown {
  options: IDropdownOptions;
}
