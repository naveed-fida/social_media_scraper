/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { open, lstat } from 'fs/promises';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { FetchedComments, LinkedInPost, Tweet } from 'types';
import RedditScrapper from './lib/reddit-scraper';
import TwitterScraper from './lib/twitter-scraper';
import LinkedInScrapper from './lib/linkedin-scrapper';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
    ipcMain.handle(
      'get_reddit_comments',
      async (_, subReddits: Array<string>, keywords: Array<string>) => {
        const scraper = new RedditScrapper(subReddits, keywords);
        const comments = await scraper.scrapeForComments();
        return comments;
      }
    );
    ipcMain.handle(
      'save_reddit_comments',
      async (_, comments: Array<FetchedComments>) => {
        const dialogRes = await dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory'],
        });

        let filePath = dialogRes.filePaths[0];

        const stat = await lstat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, '/reddit.json');
        }

        const file = await open(filePath, 'w');
        await file.write(JSON.stringify(comments));
        await file.close();
      }
    );

    ipcMain.handle(
      'get_tweets',
      async (_, keywords: Array<string>, tweetsPerKeyword: number) => {
        const scraper = new TwitterScraper(keywords, tweetsPerKeyword);
        const tweets = await scraper.getTweets();
        return tweets;
      }
    );

    ipcMain.handle('save_tweets', async (_, tweets: Array<Tweet>) => {
      const dialogRes = await dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory'],
      });

      let filePath = dialogRes.filePaths[0];

      const stat = await lstat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, '/twitter.json');
      }

      const file = await open(filePath, 'w');
      await file.write(JSON.stringify(tweets));
      await file.close();
    });

    ipcMain.handle(
      'get_linkedin_posts',
      async (
        _,
        keywords: Array<string>,
        postsPerKeyword: number,
        sessionId: string
      ) => {
        console.log('session_id', sessionId);
        const scraper = new LinkedInScrapper(sessionId);
        const posts = await scraper.search(keywords, postsPerKeyword);
        return posts;
      }
    );

    ipcMain.handle(
      'save_linkedin_posts',
      async (
        _,
        posts: Array<{ keyword: string; posts: Array<LinkedInPost> }>
      ) => {
        const dialogRes = await dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory'],
        });

        let filePath = dialogRes.filePaths[0];

        const stat = await lstat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, '/linkedin.json');
        }

        const file = await open(filePath, 'w');
        await file.write(JSON.stringify(posts));
        await file.close();
      }
    );
  })
  .catch(console.log);
