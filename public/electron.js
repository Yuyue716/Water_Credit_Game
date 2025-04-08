import path from 'path';
import electron from 'electron';
import electronUpdater from 'electron-updater';

const { app, BrowserWindow } = electron;
const { autoUpdater } = electronUpdater;

// Replace electron-is-dev with a custom check
const isDev = process.env.NODE_ENV === 'development' || 
              process.env.ELECTRON_IS_DEV === '1';

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, './app-icons/Icon-512x512.png'),
  });

  const hostUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  win.loadURL(hostUrl);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // Only call autoUpdater in production
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Only run Electron app code if in Electron environment
if (app) {
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
}