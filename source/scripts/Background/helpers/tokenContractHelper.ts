import { ethers, Contract, Signer } from 'ethers';
import SINGLE_CALL_BALANCES_ABI from 'single-call-balance-checker-abi';
import ERC_20_ABI from 'erc-20-abi';

type Provider = ethers.providers.Provider;

type BalanceMap = {
  [tokenAddress: string]: string;
}

type AddressBalanceMap = {
  [address: string]: BalanceMap;
}

// TODO-349: Update object with all contract addresses
const NETWORK_TO_CONTRACT_MAP = {
  1: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',
  3: '0x9a5f9a99054a513d1d6d3eb1fef7d06981b4ba9d',
  4: '0x3183B673f4816C94BeF53958BaF93C671B7F8Cf2'
}

export class TokenContractHelper {

  formatAddressBalances (values: string[], addresses: string[], tokens: string[]) {
    const balances: AddressBalanceMap = {};
    addresses.forEach((addr, addrIdx) => {
      balances[addr] = {};
      tokens.forEach((tokenAddr, tokenIdx) => {
        const balance = values[addrIdx * tokens.length + tokenIdx];
        balances[addr][tokenAddr] = balance;
      });
    });
    return balances;
  }


  async getAddressBalances (provider: Provider | Signer, ethAddress: string, tokenContractAddress: string[], chainId = 1) {
    let contractAddress: string;
    switch (chainId) {
      case 1:
        contractAddress = NETWORK_TO_CONTRACT_MAP[1];
        break;
      case 3:
        contractAddress = NETWORK_TO_CONTRACT_MAP[3];
        break;
      case 4:
        contractAddress = NETWORK_TO_CONTRACT_MAP[4];
        break;
      default:
        contractAddress = NETWORK_TO_CONTRACT_MAP[1];
        break;
    }
    const contract = new Contract(
      contractAddress,
      SINGLE_CALL_BALANCES_ABI,
      provider
    );

    // TODO-349: Check why "balances" fails sometimes. 
    // What happens if "balances" is not defined in the contract? 
    const balances = await contract.balances([ethAddress], tokenContractAddress);

    return this.formatAddressBalances(balances, [ethAddress], tokenContractAddress)[ethAddress];
  }

  async getTokenBalance(provider: Provider | Signer, ethAddress: string, tokenContractAddress: string, chainId = 1) {
    let contractAddress: string;
    switch (chainId) {
      case 1:
        contractAddress = NETWORK_TO_CONTRACT_MAP[1];
        break;
      case 3:
        contractAddress = NETWORK_TO_CONTRACT_MAP[3];
        break;
      case 4:
        contractAddress = NETWORK_TO_CONTRACT_MAP[4];
        break;
      default:
        contractAddress = NETWORK_TO_CONTRACT_MAP[1];
        break;
    }
    const contract = new Contract(
      contractAddress,
      SINGLE_CALL_BALANCES_ABI,
      provider
    );

    const balances = await contract.balances([ethAddress], [tokenContractAddress]);

    return this.formatAddressBalances(balances, [ethAddress], [tokenContractAddress])[ethAddress];
  }


  async getTokenInfo (
    provider: Provider | Signer,
    tokenContractAddress: string
  ) {
    let name = '', decimals, symbol;
    const contract = new Contract(tokenContractAddress, ERC_20_ABI as any, provider);

    try {
      decimals = await contract.decimals();
      symbol = await contract.symbol();
      name = await contract.name();
    } catch (e) {
      throw new Error(`ERROR: getTokenInfo = ${e}`);
    }

    return {
      address: tokenContractAddress,
      decimals,
      symbol,
      name
    }
  }
}


export const tokenContractHelper = new TokenContractHelper();