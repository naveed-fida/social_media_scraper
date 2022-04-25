import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { FetchedComments, Tweet } from 'types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  getRedditComments: (subReddits: Array<string>, keywords: Array<string>) =>
    ipcRenderer.invoke('get_reddit_comments', subReddits, keywords),
  saveRedditComments: (comments: Array<FetchedComments>) =>
    ipcRenderer.invoke('save_reddit_comments', comments),
  saveTweets: (tweets: Array<Tweet>) =>
    ipcRenderer.invoke('save_tweets', tweets),
  getTweets: (keywords: Array<string>, tweetsPerKeyword: number) =>
    ipcRenderer.invoke('get_tweets', keywords, tweetsPerKeyword),
});
