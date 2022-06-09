const readOnlyProxy = <T extends object>(object: T): T => {
  return new Proxy(object, {
    set: () => false,
    defineProperty: () => false,
    deleteProperty: () => false,
    setPrototypeOf: () => false,
    get: (target: any, prop) => {
      if (typeof target[prop] === 'function') {
        return target[prop].bind(target);
      }
      return target[prop];
    },
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
