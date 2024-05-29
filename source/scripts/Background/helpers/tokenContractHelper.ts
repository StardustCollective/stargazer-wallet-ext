import { ethers, Contract, Signer } from 'ethers';
import SINGLE_CALL_BALANCES_ABI from 'single-call-balance-checker-abi';
import ERC_20_ABI from 'erc-20-abi';

type Provider = ethers.providers.Provider;

type BalanceMap = {
  [tokenAddress: string]: string;
};

type AddressBalanceMap = {
  [address: string]: BalanceMap;
};

// This contract address is taken from https://github.com/wbobeirne/eth-balance-checker
const NETWORK_TO_CONTRACT_MAP = {
  1: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39', // ETH mainnet
  11155111: '0x8ec67c7de63d595eb5f912b39c30d70265915600', // ETH sepolia (this contract was deployed by us)
  137: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4', // Polygon mainnet
  80002: '0x8ec67c7de63d595eb5f912b39c30d70265915600', // Polygon amoy (this contract was deployed by us)
  56: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4', // BSC mainnet
  97: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4', // BSC testnet
  43114: '0xD023D153a0DFa485130ECFdE2FAA7e612EF94818', // AVAX mainnet
  43113: '0xaaEe9Ece50e5a5A1b125cf9300b6a8AdC72cDE40', // AVAX testnet (this contract was deployed by us)
};

export class TokenContractHelper {
  formatAddressBalances(values: string[], addresses: string[], tokens: string[]) {
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

  async getAddressBalances(
    provider: Provider | Signer,
    ethAddress: string,
    tokenContractAddress: string[],
    chainId = 1
  ) {
    const contract = new Contract(
      NETWORK_TO_CONTRACT_MAP[chainId as keyof typeof NETWORK_TO_CONTRACT_MAP],
      SINGLE_CALL_BALANCES_ABI,
      provider
    );

    const balances = await contract.balances([ethAddress], tokenContractAddress);

    return this.formatAddressBalances(balances, [ethAddress], tokenContractAddress)[
      ethAddress
    ];
  }

  async getTokenBalance(
    provider: Provider | Signer,
    ethAddress: string,
    tokenContractAddress: string,
    chainId = 1
  ) {
    const contract = new Contract(
      NETWORK_TO_CONTRACT_MAP[chainId as keyof typeof NETWORK_TO_CONTRACT_MAP],
      SINGLE_CALL_BALANCES_ABI,
      provider
    );

    const balances = await contract.balances([ethAddress], [tokenContractAddress]);

    return this.formatAddressBalances(balances, [ethAddress], [tokenContractAddress])[
      ethAddress
    ];
  }

  async getTokenInfo(provider: Provider | Signer, tokenContractAddress: string) {
    let name = '',
      decimals,
      symbol;
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
      name,
    };
  }
}

export const tokenContractHelper = new TokenContractHelper();
