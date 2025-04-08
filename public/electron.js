import path from 'path';
import { app, BrowserWindow } from 'electron';
import electronIsDev from 'electron-is-dev';

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(process.cwd(), './public/app-icons/Icon-512x512.png'),
  });

  const hostUrl = electronIsDev
    ? 'http://localhost:3000'
    : `file://${path.join(process.cwd(), './dist/index.html')}`;

  win.loadURL(hostUrl);

  if (electronIsDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});