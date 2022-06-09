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

/**
 * CustomEvents are not allways instances of the CustomEvent class
 */
const isCustomEvent = (value: any): value is CustomEvent => {
  return value instanceof CustomEvent || value[Symbol.toStringTag] === 'CustomEvent';
};

export { readOnlyProxy, generateNamespaceId, isCustomEvent };
