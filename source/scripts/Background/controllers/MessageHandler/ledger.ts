import { Runtime } from 'webextension-polyfill-ts';
import { Message } from './types';
import { IMasterController } from '../';

export const importLedgerAccounts = (
  port: Runtime.Port,
  masterController: IMasterController,
  message: Message
) => {

  const { args } = message.data;
  masterController.wallet.createLedgerWallets(args[0]);
  port.postMessage({ id: message.id, data: { result: "success" } });

};