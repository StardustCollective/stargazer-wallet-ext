enum StargazerChain {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
}

const readOnlyProxy = <T extends object>(object: T): T => {
  return new Proxy(object, {
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
    setPrototypeOf: () => false,
  });
};

const genProxyReqId = () => `stargazer:${window.btoa([Date.now(), Math.random()].join('.'))}`;

export { StargazerChain, readOnlyProxy, genProxyReqId };
