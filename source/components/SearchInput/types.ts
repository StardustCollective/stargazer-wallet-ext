export default interface ISearchInput {
  value: string;
  placeholder?: string;
  onChange: (text: any) => any;
  extraStyles?: any;
  extraInputStyles?: any;
  placeholderTextColor?: string;
  selectionColor?: string;
}
