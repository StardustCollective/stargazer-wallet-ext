import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { CypherockService } from './cypherockBridge';

/*
  - "User cancelled request" response error is sent when the user clicks on
    the window close button.
*/

export const addBeforeUnloadListener = (cypherockService?: CypherockService) => {
  const EVENT_NAME = 'beforeunload';
  const ERROR_MESSAGE = 'User Cancelled Request';

  window.addEventListener(EVENT_NAME, async () => {
    const { message, resolved } =
      StargazerExternalPopups.decodeRequestMessageLocationParams(window.location.href);

    if (!resolved) {
      StargazerWSMessageBroker.sendResponseError(
        new EIPRpcError(ERROR_MESSAGE, EIPErrorCodes.Rejected),
        message
      );

      if (cypherockService) {
        // Abort any running operation on the Cypherock device
        try {
          await cypherockService.abortOperation();
        } catch (err: unknown) {
          console.error('Failed to abort operation on Cypherock device', err);
        }
      }
    }
  });
};
