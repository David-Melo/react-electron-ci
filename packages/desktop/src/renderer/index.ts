import { IpcRenderer, ipcRenderer } from "electron";

declare global {
    interface Window {
        ipcRenderer: IpcRenderer;
    }
}

window.ipcRenderer = ipcRenderer;

console.log('Renderer Loaded');

window.ipcRenderer.on('PING', (_, message) => {
    console.log(message)
});

window.ipcRenderer.send('PINGBACK', 'Hello From Renderer!');