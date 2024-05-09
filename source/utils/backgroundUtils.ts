import { sendExternalMessage } from '../scripts/Background/messaging/messenger';
import { ExternalMessageID } from '../scripts/Background/messaging/types';

export const cancelEvent = async (windowId: any) => {
  await sendExternalMessage(ExternalMessageID.transactionSent, {
    windowId,
    approved: false,
    result: false,
  });
};
