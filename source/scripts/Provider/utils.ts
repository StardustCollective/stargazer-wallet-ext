// import { browser } from 'webextension-polyfill-ts';
// let isBgScr: any;
//
// export const BG_PREFIX = '##BACKGROUND##'
//
// export const isBackgroundScript = (context: Window) => {
//   if (isBgScr !== undefined) return isBgScr
//
//   try {
//     isBgScr = context === browser.extension.getBackgroundPage()
//   } catch (e) {
//     isBgScr = false
//   }
//
//   return isBgScr
// }
//
// export const getAppId = () => browser.runtime.id

// export const getRootURL = () => browser.runtime.getURL('/')

// export const createPopup = (url: any) => {
//   const options = {
//     url: `./index.html#${url}`,
//     type: 'popup',
//     height: 620,
//     width: 360,
//     focused: false
//   }
//
//   if (!getRootURL().startsWith('moz-')) {
//     options.focused = true
//   }
//
//   browser.windows.create(options)
// }

// export const connectToBackground = (name: string | undefined) => browser.runtime.connect(name);

// export const handleConnection = callback => browser.runtime.onConnect.addListener(callback)

// export const newConnectId = () => `##${Math.random().toString(36).substring(2)}##`
//
// export const checkConnectId = (id: string) => /^##[0-9a-zA-Z]+##/.test(id)
//
// export const removeConnectId = (id: string) => id.replace(/^##[0-9a-zA-Z]+##/, '')

export const inject = (content: string) => {
  const container = document.head || document.documentElement
  const scriptTag = document.createElement('script')
  scriptTag.setAttribute('async', 'false')
  scriptTag.textContent = `(() => {${content}})()`
  container.insertBefore(scriptTag, container.children[0])
}
