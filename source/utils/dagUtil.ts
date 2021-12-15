import { dag4 } from '@stardust-collective/dag4';

export const getAccountByAddress = async (
  address: string
) => {
  
  dag4.account.setKeysAndAddress('', '', address);
  const balance = await dag4.account.getBalance();
  const transactions = await dag4.account.getTransactions(10);
  
  return {
    address: {
      constellation: dag4.account.address,
    },
    balance,
    transactions,
  };
};
