import { ethers } from 'ethers';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';
import { InfuraCreds } from './types';

type TokenBalances = {
  [address: string]: string;
}

type TokenInfo = {
  contractAddress: string,
  decimals: number,
  balance?: string
}

type AccountTrackerParams = {
  infuraCreds: InfuraCreds;
}

export class AccountTracker {

  private infuraProjectId: string;
  private chainId: number;
  private isRunning = false;
  private accounts: TokenInfo[];
  private provider: ethers.providers.InfuraProvider;
  private callback: (e: string, t:TokenBalances) => void;
  private ethAddress: string;
  private debounceTimeSec: number;
  private timeoutId: any;
  private lastBlock: number;

  constructor ({ infuraCreds }: AccountTrackerParams) {
    if (infuraCreds.projectId) {
      this.infuraProjectId = infuraCreds.projectId;
    }
  }

  config (ethAddress: string, accounts: TokenInfo[], chainId = 1, callback: (e: string, t:TokenBalances) => void, debounceTimeSec = 1) {
    this.ethAddress = ethAddress;
    this.accounts = accounts;
    this.chainId = chainId;
    this.callback = callback;
    this.debounceTimeSec = debounceTimeSec > 0.1 ? debounceTimeSec : 1

    if (accounts && accounts.length) {
      this.start();
    } else if (this.isRunning) {
      this.stop();
    }
  }

  async getTokenBalances () {
    const ethBalance = await this.provider.getBalance(this.ethAddress);
    const ethBalanceNum = ethers.utils.formatEther(ethBalance) || '0';
    const tokenAddresses = this.accounts.map(t => t.contractAddress);
    const rawTokenBalances = await tokenContractHelper.getAddressBalances(this.provider, this.ethAddress, tokenAddresses, this.chainId);
    const tokenBalances: TokenBalances = {};
    this.accounts.forEach(t => {
      tokenBalances[t.contractAddress] = ethers.utils.formatUnits(rawTokenBalances[t.contractAddress], t.decimals) || '0';
    })
    this.callback(ethBalanceNum, tokenBalances);
  }

  private start () {
    if (this.isRunning) {
      this.stop();
    }
    this.provider = new ethers.providers.InfuraProvider(this.chainId, this.infuraProjectId);
    this.isRunning = true;
    this.runInterval();
  }

  private async runInterval () {
    try {
      const block = await this.provider.getBlockNumber();
      if (this.lastBlock !== block) {
        await this.getTokenBalances();
        this.lastBlock = block;
      }

      this.timeoutId = setTimeout(() => this.runInterval(), this.debounceTimeSec * 1000);
    } catch (e) {
      //Wait 30 seconds
      this.timeoutId = setTimeout(() => this.runInterval(), 30 * 1000);
    }
  }

  private stop () {
    clearTimeout(this.timeoutId);
    this.isRunning = false;
    this.provider = null;
    this.lastBlock = null;
  }
}
