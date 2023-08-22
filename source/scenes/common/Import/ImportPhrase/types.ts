export default interface IImportPhrase {
  onSubmit: (data: any) => void;
  handleInputChange: (text: string, index: number) => void;
  togglePassword: (index: number) => void;
  title: string;
  buttonTitle: string;
  isDisabled: boolean;
  isInvalidPhrase: boolean;
  phraseOptions: any;
  phraseValues: string[];
  showPasswordArray: boolean[];
}
