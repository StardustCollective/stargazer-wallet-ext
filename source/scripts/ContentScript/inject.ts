const providerManager = () => `
class InjectedProvider {
  constructor (asset) {
    this.asset = asset
  }

  setClient () {}

  getMethod (method) {
    return (...args) => window.providerManager.proxy('CAL_REQUEST', {
      asset: this.asset,
      method,
      args
    })
  }
}

class ProviderManager {
  constructor () {
    this.cache = {}
  }

  proxy (type, data) {
    return new Promise((resolve, reject) => {
      const id = Date.now() + '.' + Math.random()
  
      window.addEventListener(id, ({ detail }) => {
        const response = JSON.parse(detail)
        if (response.error) reject(new Error(response.error))
        else resolve(response)
      }, {
        once: true,
        passive: true
      })
  
      window.postMessage({
        id,
        type,
        data
      }, '*')
    })
  }

  getProviderFor (asset) {
    if (this.cache[asset]) return this.cache[asset]

    this.cache[asset] = new InjectedProvider(asset)

    return this.cache[asset]
  }

  enable (network) {
    return this.proxy('ENABLE_REQUEST', {network})
  }
}

window.providerManager = new ProviderManager()
`;

// @ts-ignore
const ethereumProvider = ({
  name,
  asset,
  network,
  overrideEthereum = false,
}: {
  name: any;
  asset: any;
  network: any;
  overrideEthereum: boolean;
}) => `
async function getAddresses () {
  const eth = window.providerManager.getProviderFor('${asset}')
  let addresses = await eth.getMethod('wallet.getAddresses')()
  addresses = addresses.map(a => '0x' + a.address)
  return addresses
}

async function handleRequest (req) {
  console.log('handleRequest: ', req);
  const eth = window.providerManager.getProviderFor('${asset}')
  if (req.method.startsWith('metamask_')) return null

  if (req.method === 'eth_requestAccounts') {
    return await window.${name}.enable()
  }

  if (req.method === 'personal_sign') { 
    const sig = await eth.getMethod('wallet.signMessage')(req.params[0], req.params[1])
    return '0x' + sig
  }

  if (req.method === 'eth_sendTransaction') {
    const to = req.params[0].to
    const value = req.params[0].value
    const data = req.params[0].data
    const gas = req.params[0].gas
    const result = await eth.getMethod('chain.sendTransaction')({ to, value, data, gas })
    return '0x' + result.hash
  }

  if (req.method === 'eth_accounts') {
    return getAddresses()
  }

  if (req.method === 'eth_chainId') {
    return eth.getMethod('wallet.getChainId')()
  }

  return eth.getMethod('jsonrpc')(req.method, ...req.params)
}

window.${name} = {
  isLiquality: true,
  isEIP1193: true,
  networkVersion: '${network.networkId}',
  chainId: '${network.chainId.toString(16)}',
  enable: async () => {
    const accepted = await window.providerManager.enable()
    if (!accepted) throw new Error('User rejected')
    return getAddresses()
  },
  request: async (req) => {
    const params = req.params || []
    return handleRequest({
      method: req.method, params
    })
  },
  send: async (req, _paramsOrCallback) => {
    if (typeof _paramsOrCallback === 'function') {
      window.${name}.sendAsync(req, _paramsOrCallback)
      return
    }
    const method = typeof req === 'string' ? req : req.method
    const params = req.params || _paramsOrCallback || []
    return handleRequest({ method, params })
  },
  sendAsync: (req, callback) => {
    handleRequest(req)
      .then((result) => callback(null, {
        id: req.id,
        jsonrpc: '2.0',
        result
      }))
      .catch((err) => callback(err))
  },
  on: (method, callback) => {}, // TODO
  autoRefreshOnNetworkChange: false
}

${
  overrideEthereum
    ? `function override() {
    window.ethereum = window.${name}
  }

  if (!window.ethereum) {
    override()
    const retryLimit = 5
    let retries = 0
    const interval = setInterval(() => {
      retries++
      if (window.ethereum && !window.ethereum.isLiquality) {
        override()
        clearInterval(interval)
      }
      if (retries >= retryLimit) clearInterval(interval)
    }, 1000)
  } else {
    override()
  }`
    : ''
}
`;

const stargazerProvider = () => `

const REQUEST_MAP = {
  isConnected: 'wallet.isConnected',
  getNetwork: 'wallet.getNetwork',
  getAddress: 'wallet.getAddress',
  getBalance: 'wallet.getBalance',
  signMessage: 'wallet.signMessage',
  sendTransaction: 'wallet.sendTransaction',
  eth_chainId: 'wallet.getChainId',
}

const ERRORS = {
  USER_REJECTED: (message = 'User rejected') => {
    const err = new Error(message);
    err.code = 4001;
    return err;
  }
}

async function handleRequest (req) {
  const dag = window.providerManager.getProviderFor('DAG');
  const eth = window.providerManager.getProviderFor('ETH');
  
  if (req.method === 'eth_sendTransaction') {
    return eth.getMethod('wallet.sendTransaction')({...req.params[0]});
  } else if (req.method === 'dag_requestAccounts') {
    const {result, data} = await window.providerManager.enable('Constellation');
    
    if (!result) throw ERRORS.USER_REJECTED()
    
    return data.accounts;
  } else if (req.method === 'eth_requestAccounts') {
    const {result, data} = await window.providerManager.enable('Ethereum')

    console.log('stgzr eth_requestAccounts result: ', result);
    console.log('stgzr eth_requestAccounts data: ', data);
    
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
    const {result, data} = await window.providerManager.enable()

    if (!result) throw ERRORS.USER_REJECTED()

    return data.accounts;
  },
  request: async (req) => {
    const params = req.params || []
    return handleRequest({
      method: req.method, params
    })
  },
  on: (method, callback) => {
    let origin = window.location.hostname;
    if(window.location.port){
      origin += ":"+window.location.port;
    }

    const id = method + "." + "origin";

    window.addEventListener(
      id,
      ({ detail }) => {
        if(detail){       
          callback(JSON.parse(detail));
        }
      },
      { passive: true }
    );

    // Register the origin of the listening site.
    window.postMessage({ id, type: 'STARGAZER_EVENT_REG', data: {method, origin}}, '*');
  },
  removeListener: (method) => {
    let origin = window.location.hostname;
    if(window.location.port){
      origin += ":"+window.location.port;
    }

    const id = method + "." + "origin";

    window.removeEventListener(id);

    window.postMessage({ id, type: 'STARGAZER_EVENT_DEREG', data: {method, origin}}, '*');
  }
}
`;

export { providerManager, ethereumProvider, stargazerProvider };
