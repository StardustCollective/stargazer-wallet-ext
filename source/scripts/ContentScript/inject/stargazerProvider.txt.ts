// @ts-nocheck

const SUPPORTED_WALLET_METHODS = window.SUPPORTED_WALLET_METHODS;

const REQUEST_MAP = {
  ETH: {
    chainId: SUPPORTED_WALLET_METHODS.getChainId,
    accounts: SUPPORTED_WALLET_METHODS.getAccounts,
    blockNumber: SUPPORTED_WALLET_METHODS.getBlockNumber,
    estimateGas: SUPPORTED_WALLET_METHODS.estimateGas,
    sendTransaction: SUPPORTED_WALLET_METHODS.sendTransaction,
    signMessage: SUPPORTED_WALLET_METHODS.signMessage,
  },
  DAG: {
    chainId: SUPPORTED_WALLET_METHODS.getChainId,
    accounts: SUPPORTED_WALLET_METHODS.getAccounts,
    chainId: SUPPORTED_WALLET_METHODS.sendTransaction,
    getBalance: SUPPORTED_WALLET_METHODS.getBalance,
  },
  isConnected: SUPPORTED_WALLET_METHODS.isConnected,
  getNetwork: SUPPORTED_WALLET_METHODS.getNetwork,
  getAddress: SUPPORTED_WALLET_METHODS.getAddress,
  getBalance: SUPPORTED_WALLET_METHODS.getBalance,
}

const SUPPORTED_CHAINS = {
  constellation: {
    prefix: 'dag',
    asset: 'DAG'
  },
  ethereum: {
    prefix: 'eth',
    asset: 'ETH'
  }
};

const ERRORS = {
  USER_REJECTED: (message = 'User Rejected Request') => {
    const err = new Error(message);
    err.code = 4001;
    return err;
  },
  INVALID_METHOD: (message = 'Unsupported Method') => {
    const err = new Error(message);
    err.code = 4200;
    return err;
  }
}

async function handleRequest(chain, req) {
  const asset = SUPPORTED_CHAINS[chain].asset;

  const provider = window.providerManager.getProviderFor(asset);

  let [prefix, method] = req.method.split('_');

  if (prefix && prefix.toLowerCase() !== SUPPORTED_CHAINS[chain].prefix) {
    throw ERRORS.INVALID_METHOD()
  }

  if (!method) {
    prefix = null;
    method = req.method;
  } else {
    prefix = prefix.toUpperCase();
  }

  // All request accounts go to the same place
  if (method === 'requestAccounts') {
    const { result, data } = await window.providerManager.enable();

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  }

  if (
    prefix &&
    REQUEST_MAP.hasOwnProperty(prefix) &&
    REQUEST_MAP[prefix].hasOwnProperty(method)
  ) {
    return provider.getMethod(REQUEST_MAP[prefix][method])(...req.params);
  }

  throw ERRORS.INVALID_METHOD();
}

const provider = (chain) => {
  chain = chain.toLowerCase();
  
  if (!Object.keys(SUPPORTED_CHAINS).includes(chain)) {
    console.error('Unsupported chain: ' + chain);
  }

  return {
    request: async (req) => {
      const params = req.params || []
      return await handleRequest(chain, {
        method: req.method,
        params
      });
    },
    on: (method, callback) => {
      let origin = window.location.hostname;
      if (window.location.port) {
        origin += ":" + window.location.port;
      }
  
      const id = chain + "." + origin + "." + method;
  
      window.stargazer._listeners[id] = ({ detail }) => {
        if (detail) {
          callback(JSON.parse(detail));
        }
      };
  
      window.addEventListener(
        id,
        window.stargazer._listeners[id],
        { passive: true }
      );
  
      // Register the origin of the listening site.
      window.postMessage({ id, type: 'STARGAZER_EVENT_REG', data: { method, origin, chain } }, '*');
    },
    removeListener: (method) => {
      let origin = window.location.hostname;
      if (window.location.port) {
        origin += ":" + window.location.port;
      }
  
      const id = chain + "." + origin + "." + method;
  
      if (window.stargazer._listeners[id]) {
        window.removeEventListener(id, window.stargazer._listeners[id]);
  
        delete window.stargazer._listeners[id];
      }
  
      window.postMessage({ id, type: 'STARGAZER_EVENT_DEREG', data: { method, origin, chain } }, '*');
    }
  }
}

const allPrivider = provider('ethereum');

window.stargazer = {
  evtRegMap: {},
  version: 1,
  getProvider: (chain) => provider(chain),
  isConnected: async () => {
    const provider = window.providerManager.getProviderFor('main');
    return provider.getMethod('wallet.isConnected')()
  },
  enable: async () => {
    const { result, data } = await window.providerManager.enable()

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  },
  request: async (req) => {
    return allPrivider.request(req);
  },
  on: (method, callback) => {
    return allPrivider.on(method, callback);
  },
  removeListener: (method) => {
    return allPrivider.removeListener(method);
  },
  _listeners: {}
}