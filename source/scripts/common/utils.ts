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
 * Native object references passed between different execution contexts are not
 * the same always.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_context_e.g._frames_or_windows
 */

const isCustomEvent = (value: any): value is CustomEvent => {
  return value instanceof CustomEvent || value[Symbol.toStringTag] === 'CustomEvent';
};

const isError = (value: any): value is Error => {
  return (
    value instanceof Error ||
    (typeof value?.name === 'string' && typeof value?.message === 'string')
  );
};

export { readOnlyProxy, generateNamespaceId, isCustomEvent, isError };
