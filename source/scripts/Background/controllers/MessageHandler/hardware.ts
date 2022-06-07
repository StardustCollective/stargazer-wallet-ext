import { Runtime } from 'webextension-polyfill-ts';
import { Message } from './types';
import { IMasterController } from '..';

export const importHardwareWalletAccounts = (
  port: Runtime.Port,
  masterController: IMasterController,
  message: Message
) => {

  const { args } = message.data;
  masterController.wallet.importHardwareWalletAccounts(args[0]);
  port.postMessage({ id: message.id, data: { result: "success" } });

};