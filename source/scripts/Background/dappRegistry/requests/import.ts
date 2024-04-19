import type { DappProviderExternalImplementation } from '../dappProvider';

/**
 * @deprecated ledger accounts can be directly imported using
 * Extended implementation of DappProvider.onImportRequest
 */
const handleImportRequest: DappProviderExternalImplementation<
  'onImportRequest',
  []
> = async (_dappProvider, _port, request, _encodedRequest) => {
  if (request.provider === 'ledger') {
    // TODO: test Manifest V3 (window object not available)
    // window.controller.wallet.importHardwareWalletAccounts(request.addresses);
  }

  return { type: 'import', result: true };
};

export { handleImportRequest };
