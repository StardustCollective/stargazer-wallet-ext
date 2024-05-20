import { v4 as uuidv4 } from 'uuid';

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

const generateUUIDv4NamespaceId = (namespace: string) =>
  `stargazer:${namespace}:${uuidv4()}`;

/**
 * Native object references passed between different execution contexts are not
 * the same always.
 *
 * CustomEvent constructors between contexts/frames may not be the same, thus instanceof may not work.
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

export { readOnlyProxy, generateUUIDv4NamespaceId, isCustomEvent, isError };
