import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError } from 'scripts/common';

/*
  - "User cancelled request" response error is sent when the user clicks on
    the window close button.
*/

export const addBeforeUnloadListener = () => {
  const EVENT_NAME = 'beforeunload';
  const ERROR_MESSAGE = 'User Cancelled Request';

  window.addEventListener(EVENT_NAME, () => {
    const { message, resolved } =
      StargazerExternalPopups.decodeRequestMessageLocationParams(window.location.href);

    if (!resolved) {
      StargazerWSMessageBroker.sendResponseError(
        new EIPRpcError(ERROR_MESSAGE, EIPErrorCodes.Rejected),
        message
      );
    }
  });
};
