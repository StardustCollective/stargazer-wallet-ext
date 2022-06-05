const readOnlyProxy = <T extends object>(object: T): T => {
  return new Proxy(object, {
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
    setPrototypeOf: () => false,
  });
};

const generateNamespaceId = (namespace: string) =>
  `stargazer:${namespace}:${window.btoa([Date.now(), Math.random()].join('.'))}`;

export { readOnlyProxy, generateNamespaceId };
