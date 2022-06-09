import type { DappProviderExternalImplementation } from '../dappProvider';

/**
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
