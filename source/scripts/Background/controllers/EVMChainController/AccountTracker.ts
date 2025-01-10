import * as ethers from 'ethers';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import StargazerRpcProvider from 'scripts/Provider/evm/StargazerRpcProvider';

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
  private callback: (e: string, t: TokenBalances) => Promise<void>;
  private ethAddress: string;
  private debounceTimeSec: number;
  private timeoutId: any;

  async config(
    ethAddress: string,
    rpcProviderURL: string,
    accounts: TokenInfo[],
    chainId = 1,
    callback: (e: string, t: TokenBalances) => Promise<void>,
    debounceTimeSec = 1
  ) {
    if (this.isRunning) {
      this.stop();
    }
    this.ethAddress = ethAddress;
    this.accounts = accounts;
    this.chainId = chainId;
    this.provider = rpcProviderURL ? new StargazerRpcProvider(rpcProviderURL) : null;
    this.callback = callback;
    this.debounceTimeSec = debounceTimeSec > 0.1 ? debounceTimeSec : 1;

    if (!!this.ethAddress) {
      await this.start();
    } else if (this.isRunning) {
      this.stop();
    }
  }

  async getTokenBalances() {
    if (!this.provider) return;
    const tokenAddresses = this.accounts.map((t) => t.contractAddress);
    const tokenBalances: TokenBalances = {};
    let mainTokenBalance = null;
    if (tokenAddresses?.length) {
      const [mainBalance, rawTokenBalances] = await Promise.all([
        this.provider.getBalance(this.ethAddress),
        tokenContractHelper.getAddressBalances(
          this.provider,
          this.ethAddress,
          tokenAddresses,
          this.chainId
        ),
      ]);
      mainTokenBalance = mainBalance;
      this.accounts.forEach((t) => {
        const tokenBalance = ethers.utils.formatUnits(
          rawTokenBalances[t.contractAddress],
          t.decimals
        );
        if (!!tokenBalance) {
          tokenBalances[`${t.contractAddress}-${t.chain}`] = tokenBalance;
        }
      });
    } else {
      mainTokenBalance = await this.provider.getBalance(this.ethAddress);
    }
    const mainTokenBalanceNum = mainTokenBalance
      ? ethers.utils.formatEther(mainTokenBalance)
      : null;
    await this.callback(mainTokenBalanceNum, tokenBalances);
  }

  private async start() {
    this.isRunning = true;
    await this.runInterval();
  }

  private async runInterval() {
    if (!this.provider) return;
    try {
      await this.getTokenBalances();

      this.timeoutId = setTimeout(() => this.runInterval(), this.debounceTimeSec * 1000);
    } catch (e) {
      // Wait 30 seconds
      this.timeoutId = setTimeout(() => this.runInterval(), 30 * 1000);
    }
  }

  stop() {
    clearTimeout(this.timeoutId);
    this.isRunning = false;
    this.provider = null;
  }
}
