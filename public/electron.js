import path from 'path';
import electron from 'electron';
import electronIsDev from 'electron-is-dev';
import electronUpdater from 'electron-updater';

const { app, BrowserWindow } = electron;
const { autoUpdater } = electronUpdater;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, './app-icons/Icon-512x512.png'),
  });

  const hostUrl = electronIsDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  win.loadURL(hostUrl);

  if (electronIsDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});