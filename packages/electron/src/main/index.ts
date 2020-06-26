import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { staticPath } from './utils/staticPath';

const CRA_DEV_URL = 'http://localhost:3000';

// Global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

const createMainWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.webContents.openDevTools();

    // By default opens file:///path/to/crale-react/build/index.html, unless
    // there's a ENV variable set, which we will use for development.
    mainWindow.loadURL(
        process.env.NODE_ENV === 'production'
            ? url.format({
                pathname: path.join(staticPath, 'build', 'index.html'),
                protocol: 'file:',
                slashes: true
            })
            : CRA_DEV_URL
    );

    mainWindow.on('closed', () => {
        mainWindow = undefined;
    });

    mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            if (mainWindow) {
                mainWindow.webContents.send('PING', 'Hello From Main Thread!')
            }
        }, 10000);
    });

};

// Quit application when all windows are closed
app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it is common to re-create a window even after all windows have been closed
    if (!mainWindow) {
        createMainWindow();
    }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
    createMainWindow();
});

ipcMain.on('PINGBACK', (data: any, message: any) => {
    console.log(message);
})