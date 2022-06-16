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
    window.controller.wallet.createLedgerWallets(request.addresses);
  }

  return { type: 'import', result: true };
};

export { handleImportRequest };
