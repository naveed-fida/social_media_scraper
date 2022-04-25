/* eslint-disable @typescript-eslint/ban-types */
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };

    electronAPI: {
      saveRedditComments: Function;
      getRedditComments: Function;
      getTweets: Function;
      saveTweets: Function;
    };
  }
}

export {};
