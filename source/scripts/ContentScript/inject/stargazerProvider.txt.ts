// @ts-nocheck

const REQUEST_MAP = {
  isConnected: 'wallet.isConnected',
  getNetwork: 'wallet.getNetwork',
  getAddress: 'wallet.getAddress',
  getBalance: 'wallet.getBalance',
  signMessage: 'wallet.signMessage',
  sendTransaction: 'wallet.sendTransaction',
  eth_chainId: 'wallet.getChainId',
  eth_accounts: 'wallet.getAccounts',
  eth_blockNumber: 'wallet.getBlockNumber',
  eth_estimateGas: 'wallet.estimateGas'
}

const ERRORS = {
  USER_REJECTED: (message = 'User rejected') => {
    const err = new Error(message);
    err.code = 4001;
    return err;
  }
}

async function handleRequest(req) {
  const dag = window.providerManager.getProviderFor('DAG');
  const eth = window.providerManager.getProviderFor('ETH');

  if (req.method === 'eth_sendTransaction') {
    return eth.getMethod('wallet.sendTransaction')({ ...req.params[0] });
  } else if (req.method === 'dag_requestAccounts') {
    const { result, data } = await window.providerManager.enable('Constellation');

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  } else if (req.method === 'eth_requestAccounts') {
    const { result, data } = await window.providerManager.enable('Ethereum')

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  } else if (req.method.startsWith('eth_')) {
    const method = REQUEST_MAP[req.method] || req.method;
    return eth.getMethod(method)(...req.params);
  }

  const method = REQUEST_MAP[req.method] || req.method;
  return dag.getMethod(method)(...req.params);
}

window.stargazer = {
  evtRegMap: {},
  version: 1,
  isConnected: async () => {
    const dag = window.providerManager.getProviderFor('DAG')
    return dag.getMethod('wallet.isConnected')()
  },
  enable: async () => {
    const { result, data } = await window.providerManager.enable()

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  },
  request: async (req) => {
    const params = req.params || []
    const response = await handleRequest({
      method: req.method, params
    })

    return response;
  },
  on: (method, callback) => {
    let origin = window.location.hostname;
    if (window.location.port) {
      origin += ":" + window.location.port;
    }

    const id = origin + "." + method;

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
    window.postMessage({ id, type: 'STARGAZER_EVENT_REG', data: { method, origin } }, '*');
  },
  removeListener: (method) => {
    let origin = window.location.hostname;
    if (window.location.port) {
      origin += ":" + window.location.port;
    }

    const id = origin + "." + method;

    if (window.stargazer._listeners[id]) {
      window.removeEventListener(id, window.stargazer._listeners[id]);

      delete window.stargazer._listeners[id];
    }

    window.postMessage({ id, type: 'STARGAZER_EVENT_DEREG', data: { method, origin } }, '*');
  },
  _listeners: {},
  testTest: ['it works']
}