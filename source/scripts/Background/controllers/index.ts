import AccountsController, { IAccountsController } from './AccountsController';

export interface IMasterController {
  accounts: Readonly<IAccountsController>;
}

const MasterController = (): IMasterController => {
  const accounts = Object.freeze(AccountsController());

  return {
    accounts,
  };
};

export default MasterController;
