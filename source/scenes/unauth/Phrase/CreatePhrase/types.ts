export default interface ICreatePhrase {
  title: string;
  description: string;
  nextHandler: () => void;
  phrases: any;
  passed: boolean;
}
