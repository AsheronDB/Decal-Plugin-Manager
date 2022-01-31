'use strict'

const APP_GITHUB_REPO = 'AsheronDB/Decal-Plugin-Manager';

// Automatic updates
require('update-electron-app')({
    repo: APP_GITHUB_REPO
})

import { app, shell, ipcMain, protocol, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';
import Store from 'electron-store';
const fs = require('fs');
let {
    fork,
    execSync
} = require('child_process')

const isDevelopment = process.env.NODE_ENV !== 'production'
const CHILD_PROCESS_PATH = `${__static}/processes`;
const SERVER_PATH = `${CHILD_PROCESS_PATH}/server.js`;
const WORKER_PATH = `${CHILD_PROCESS_PATH}/worker.js`;
const localStore = new Store();

let defaultAppSettings = {
    preferences: {
        launchOnStartup: true,
        telemetry: true
    },
    app: {
        screen: {
            size: {
                width: 800,
                height: 600,
            },
            position: {
                x: 0,
                y: 0
            },
            maximized: false,
            fullscreen: false
        }
    }

};

if (!localStore.get('settings')) {
    localStore.set({ settings: defaultAppSettings });
}

let rendererWindow;
let childProcesses = {};

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function startServerProcess() {
    return new Promise((resolve) => {
        let process = fork(SERVER_PATH, ['--subprocess', app.getPath('userData')]);
        childProcesses[process.pid] = process;
        process.on('message', msg => {
            if (msg.status == 'ready') {
                console.log('SERVER READY IN FUCNTION')
                console.log(msg);
                resolve(msg.port);
            }
        });
    });
}

async function startWorkerProcess() {
    return new Promise((resolve) => {
        let process = fork(WORKER_PATH, ['--subprocess', app.getPath('userData')]);
        childProcesses[process.pid] = process;
        process.on('message', msg => {
            if (msg.status == 'ready') {
                console.log('WORKER READY IN FUCNTION')
                process.send('message');
                resolve();
            }
        });
    });
}

async function runChildProcess(scriptName, data) {
    return new Promise((resolve, reject) => {
        let scriptPath = path.join(CHILD_PROCESS_PATH, `${scriptName}.js`);
        let process = fork(scriptPath, ['--subprocess', app.getPath('userData')]);
        childProcesses[process.pid] = process;
        process.on('message', msg => {
            if (msg.status == 'ready') {
                // Execute script logic on worker startup
                process.send({ data: data });
            } else if (msg.status = 'finished') {
                // Clean up worker process when complete
                childProcesses[process.pid].kill();
                delete childProcesses[process.pid];
                // Return data
                resolve();
            }
        });
    });
}

async function installPlugin(plugin) {
    console.log('uninstall plugin');

    let installed = await runChildProcess('installPlugin', plugin);
}

async function uninstallPlugin(plugin) {
    console.log('uninstall plugin')
}

function openPluginFolder(plugin) {
    shell.openPath(plugin.path)
}

function openPluginHomepage(plugin) {
    shell.openExternal("http://google.com");
}

async function createWindow() {
    // Create the browser window.
    return new Promise(async (resolve) => {

        let window = new BrowserWindow({
            width: localStore.get('settings.app.screen.size.width') || defaultAppSettings.app.screen.size.width,
            height: localStore.get('settings.app.screen.size.height') || defaultAppSettings.app.screen.size.height,
            x: localStore.get('settings.app.screen.position.x') || null,
            y: localStore.get('settings.app.screen.position.y') || null,
            minWidth: 800,
            minHeight: 500,
            frame: false,
            titleBarStyle: 'hidden',
            backgroundColor: '#444444',
            webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                preload: path.join(app.getAppPath(), 'preload.js')
            }
        });

        // Restore maximization on startup
        localStore.get('settings.app.screen.maximized') ? window.maximize() : null;

        // Restore fullscreen on startup
        //localStore.get('settings.app.screen.fullscreen') ? window.maximize() : null;

        // Remove default Windows file menu
        window.removeMenu();

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
            if (!process.env.IS_TEST) window.webContents.openDevTools()
        } else {
            createProtocol('app')
            // Load the index.html when not in development
            await window.loadURL('app://./index.html')
            window.webContents.openDevTools()

        }

        resolve(window);

    });

}

function setupWindowEvents() {

    rendererWindow.on('maximize', () => {
        let maximized = rendererWindow.isMaximized() ? true : false;
        localStore.set('settings.app.screen.maximized', maximized);
    });

    rendererWindow.on('unmaximize', () => {
        let maximized = rendererWindow.isMaximized() ? true : false;
        localStore.set('settings.app.screen.maximized', maximized);
    });

    rendererWindow.on('enter-full-screen', () => {
        userConfigStore.set('settings.app.screen.fullscreen', true);
        rendererWindow.webContents.send('enter-full-screen');
    });

    rendererWindow.on('leave-full-screen', () => {
        localStore.set('settings.app.screen.fullscreen', false);
        rendererWindow.webContents.send('leave-full-screen');
    })

    rendererWindow.on('resize', () => {
        let size = rendererWindow.getSize();
        localStore.set('settings.app.screen.size.width', size[0]);
        localStore.set('settings.app.screen.size.height', size[1]);
    });

    rendererWindow.on('move', () => {
        let position = rendererWindow.getPosition();
        localStore.set('settings.app.screen.position.x', position[0]);
        localStore.set('settings.app.screen.position.y', position[1]);
    });

}


function setupIpcEvents() {

    ipcMain.on('mounted', async () => {

        console.log('App mounted event in main...')

        await startWorkerProcess();
        let serverPort = await startServerProcess();

        rendererWindow.webContents.send('server-ready', serverPort);



        //createBackgroundProcess();

        //await saveInstalledPlugins();


        // serverProcess = fork(__static + '/server/index.js', [
        //     '--subprocess',
        //     app.getVersion(),
        //     __static
        // ])

        // serverProcess.on('message', msg => {
        //     if (msg.status == 'ready') {
        //         rendererWindow.webContents.send('server-ready', msg.port);
        //     }
        // });
    });

    // win.webContents.on('did-finish-load', function () {
    //     console.log('window finished loading');
    // });

    ipcMain.on('install-plugin', (event, plugin) => {
        console.log('install plugin event received')
        installPlugin(plugin);
    });

    ipcMain.handle('read-local-store', async (event, msg) => {
        return localStore.store;
    });

    ipcMain.on('minimize', () => {
        console.log('minimize received')
        rendererWindow.isMinimized() ? rendererWindow.restore() : rendererWindow.minimize();
    })

    ipcMain.on('maximize', () => {
        console.log('maximize received');
        rendererWindow.isMaximized() ? rendererWindow.unmaximize() : rendererWindow.maximize();
    })

    ipcMain.on('show-context-menu', (event, data) => {

        let updateAvailable = false;
        let menuTemplate = [];

        menuTemplate.push({
            label: `${data.name} (${data.version})`
        })
        menuTemplate.push({ type: 'separator' })

        if (updateAvailable) {

        }

        menuTemplate.push({ label: 'Ignore', type: 'checkbox', checked: (data.ignored ? true : false) })
        menuTemplate.push({
            label: 'Open Folder', click: () => (openPluginFolder(data))
        })

        menuTemplate.push({
            label: 'Visit Homepage', click: () => (openPluginHomepage(data))
        })

        menuTemplate.push({ type: 'separator' })

        menuTemplate.push({
            label: 'Remove', click: () => (uninstallPlugin(data))
        })

        const menu = Menu.buildFromTemplate(menuTemplate)
        menu.popup(BrowserWindow.fromWebContents(event.sender))
    })

    ipcMain.on('close', () => {
        console.log('APP QUIT')
        if (rendererWindow.isDevToolsOpened()) {
            rendererWindow.closeDevTools();
        }
        rendererWindow.close();
    })

}



// APP EVENTS

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        console.log('quitting app')
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    //if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    setupIpcEvents();

    rendererWindow = await createWindow();
    setupWindowEvents();

    // localStore.onDidChange('settings', (newValue, oldValue) => {
    //     console.log(newValue);
    //     console.log('ON DID CHANGE!')
    //     //rendererWindow.webContents.send('store-changed', newValue);
    // });

    localStore.onDidAnyChange((newValue, oldValue) => {
        rendererWindow.webContents.send('store-changed');
    });

})

function cleanupChildProcesses() {
    Object.values(childProcesses).forEach(process => (process.kill()));
    childProcesses = {};
}

app.on('before-quit', () => {
    // Kill all child worker processes
    cleanupChildProcesses();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}