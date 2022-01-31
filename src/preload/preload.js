import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    // whitelist channels

    console.log('SENDING DATA TO MAIN')
    let validChannels = ['toMain', 'maximize', 'minimize', 'close', 'mounted', 'read-local-store', 'show-context-menu', 'install-plugin'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = ['fromMain', 'store-changed', 'read-local-store', 'show-context-menu', 'maximized', 'minimized', 'server-ready']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  async invoke (eventName, ...params) {
    return await ipcRenderer.invoke(eventName, ...params)
  },
})