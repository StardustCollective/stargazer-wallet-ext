/*
 * This module tracks accounts, caches their balances & transaction counts.
 *
 * It also monitor pending transactions and checks their inclusion status
 * on each new block.
 */

export class AccountTracker {
  currentBlockNumber: number = 0;

  constructor() {

    //Monitor incoming blocks on chainId
    //this.store = new ObservableStore(initState);
  }

  // start() {
  //   // remove first to avoid double add
  //   this._blockTracker.removeListener('latest', this._updateForBlock);
  //   // add listener
  //   this._blockTracker.addListener('latest', this._updateForBlock);
  //   // fetch account balances
  //   this._updateAccounts();
  // }
  //
  // stop() {
  //   // remove listener
  //   this._blockTracker.removeListener('latest', this._updateForBlock);
  // }


  async _updateForBlock(blockNumber: number) {
    this.currentBlockNumber = blockNumber;

    // block gasLimit polling shouldn't be in account-tracker shouldn't be here...
    const currentBlock: any = { };// = await this._query.getBlockByNumber(blockNumber, false);
    if (!currentBlock) {
      return;
    }
    //const currentBlockGasLimit = currentBlock.gasLimit;
    //this.store.updateState({ currentBlockGasLimit });

    try {
      await this._updateAccounts();
    } catch (err) {
      // log.error(err);
    }
  }


  async _updateAccounts() {
    // const { accounts } = this.store.getState();
    // const addresses = Object.keys(accounts);
    // const chainId = this.getCurrentChainId();

    //XCHAIN
    //await this._updateAccountsViaBalanceChecker(addresses, chainId);
    //accounts[address] = { address, balance };
    //this.store.updateState({ accounts });
  }

}
