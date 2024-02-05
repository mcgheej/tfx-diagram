import { BrowserWindow, screen, shell } from 'electron';
// import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { join } from 'path';
import { format } from 'url';
import { environment } from '../environments/environment';
import { rendererAppName, rendererAppPort } from './constants';

export default class App {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }

  private static onClose() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    App.mainWindow = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static onRedirect(event: any, url: string) {
    if (url !== App.mainWindow.webContents.getURL()) {
      // this is a normal external redirect, open it in a new browser window
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  private static onReady() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    App.initMainWindow();
    App.loadMainWindow();
  }

  private static onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static initMainWindow() {
    // Create the browser window.
    App.mainWindow = new BrowserWindow(App.getBrowserWindowOptions());
    App.mainWindow.setMenu(null);
    App.mainWindow.center();
    App.mainWindow.maximize();
    App.mainWindow.on('unmaximize', () =>
      App.mainWindow.webContents.send('unmaximize-window-event')
    );
    App.mainWindow.on('maximize', () =>
      App.mainWindow.webContents.send('maximize-window-event')
    );

    // if main window is ready to show, close the splash window and show the main window.
    App.mainWindow.once('ready-to-show', () => {
      App.mainWindow.show();
    });

    // handle all external redirects in a new browser window
    // App.mainWindow.webContents.on('will-navigate', App.onRedirect);
    // App.mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //     App.onRedirect(event, url);
    // });

    // Emitted when the window is closed.
    App.mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      App.mainWindow = null;
    });
  }

  private static getBrowserWindowOptions(): Electron.BrowserWindowConstructorOptions {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(720, workAreaSize.height || 720);
    return {
      width: width,
      height: height,
      frame: false,
      show: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'main.preload.js'),
      },
    };
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow.loadURL(`http://localhost:${rendererAppPort}`);
      // Open dev tools
      App.mainWindow.webContents.openDevTools({ mode: 'detach' });

      // OR
      // Add redux tools and open devtools
      // App.application.whenReady().then(() => {
      //   installExtension(REDUX_DEVTOOLS)
      //     .then((name) => console.log(`Added Extentsion: ${name}`))
      //     .catch((err) => console.log('An error occurred: ', err))
      //     .finally(() => {
      //       App.mainWindow.webContents.openDevTools({ mode: 'detach' });
      //     });
      // });
      // App.mainWindow.webContents.once('dom-ready', async () => {
      //   await installExtension(REDUX_DEVTOOLS)
      //     .then((name) => console.log(`Added Extension ${name}`))
      //     .catch((err) => console.log('An error occurred: ', err))
      //     .finally(() => {
      //       App.mainWindow.webContents.openDevTools({ mode: 'detach' });
      //     });
      // });
    } else {
      App.mainWindow.loadURL(
        format({
          pathname: join(__dirname, '..', rendererAppName, 'index.html'),
          protocol: 'file:',
          slashes: true,
        })
      );
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for

    App.BrowserWindow = browserWindow;
    App.application = app;

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated
  }
}
