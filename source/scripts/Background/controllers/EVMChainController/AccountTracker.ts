import * as ethers from 'ethers';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';

type TokenBalances = {
  [address: string]: string;
};

type TokenInfo = {
  contractAddress: string;
  decimals: number;
  balance?: string;
  chain: string;
};

export class AccountTracker {
  private chainId: number;
  private isRunning = false;
  private accounts: TokenInfo[];
  private provider: ethers.providers.JsonRpcProvider;
  private callback: (e: string, t: TokenBalances) => void;
  private ethAddress: string;
  private debounceTimeSec: number;
  private timeoutId: any;
  private lastBlock: number;

  config(
    ethAddress: string,
    rpcProviderURL: string,
    accounts: TokenInfo[],
    chainId = 1,
    callback: (e: string, t: TokenBalances) => void,
    debounceTimeSec = 1
  ) {
    if (this.isRunning) {
      this.stop();
    }
    this.ethAddress = ethAddress;
    this.accounts = accounts;
    this.chainId = chainId;
    this.provider = rpcProviderURL
      ? new ethers.providers.JsonRpcProvider(rpcProviderURL)
      : null;
    this.callback = callback;
    this.debounceTimeSec = debounceTimeSec > 0.1 ? debounceTimeSec : 1;

    if (!!this.ethAddress) {
      this.start();
    } else if (this.isRunning) {
      this.stop();
    }
  }

  async getTokenBalances() {
    if (!this.provider) return;
    const tokenAddresses = this.accounts.map((t) => t.contractAddress);
    const mainTokenBalance = await this.provider.getBalance(this.ethAddress);
    const mainTokenBalanceNum = ethers.utils.formatEther(mainTokenBalance) || '-';
    const tokenBalances: TokenBalances = {};
    if (tokenAddresses?.length) {
      const rawTokenBalances = await tokenContractHelper.getAddressBalances(
        this.provider,
        this.ethAddress,
        tokenAddresses,
        this.chainId
      );
      this.accounts.forEach((t) => {
        tokenBalances[`${t.contractAddress}-${t.chain}`] =
          ethers.utils.formatUnits(rawTokenBalances[t.contractAddress], t.decimals) ||
          '-';
      });
    }
    this.callback(mainTokenBalanceNum, tokenBalances);
  }

  private start() {
    this.isRunning = true;
    this.runInterval();
  }

  private async runInterval() {
    if (!this.provider) return;
    try {
      const block = await this.provider.getBlockNumber();

      if (this.lastBlock !== block) {
        await this.getTokenBalances();
        this.lastBlock = block;
      }

      this.timeoutId = setTimeout(() => this.runInterval(), this.debounceTimeSec * 1000);
    } catch (e) {
      // Wait 30 seconds
      this.timeoutId = setTimeout(() => this.runInterval(), 30 * 1000);
    }
  }

  private stop() {
    clearTimeout(this.timeoutId);
    this.isRunning = false;
    this.provider = null;
    this.lastBlock = null;
  }
}
