import { Runtime } from 'webextension-polyfill-ts';
import { Message } from './types';
import { MasterController } from '../';

export const importLedgerAccounts = (
  port: Runtime.Port,
  masterController: MasterController,
  message: Message
) => {

  const { args } = message.data;
  masterController.wallet.createLedgerWallets(args[0]);
  port.postMessage({ id: message.id, data: { result: "success" } });

};