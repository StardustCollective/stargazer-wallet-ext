import { ProcessStates } from './enums';

export default interface IProcessState {
  login: ProcessStates;
  fetchDagBalance: ProcessStates;
}
