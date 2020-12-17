import { browser } from 'webextension-polyfill-ts';
import get from 'lodash/get';

export function useController(path = '') {
  const controller = browser.extension.getBackgroundPage().controller;
  return get(controller, path, controller);
}
