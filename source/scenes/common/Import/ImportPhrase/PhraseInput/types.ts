export interface IPhraseInput {
  value: string;
  index: number;
  hasError?: boolean;
  showPassword: boolean;
  togglePassword: (index: number) => void;
  onChangeText: (value: string, index: number) => void;
}
