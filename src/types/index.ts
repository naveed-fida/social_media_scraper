export type SelectedSite = 'Reddit' | 'Twitter' | 'LinkedIn' | 'none';

export interface Settings {
  subReddits: Array<string>;
  keywords: Array<string>;
}

export type FetchedComments = Array<{
  comments: Array<string>;
  postTitle: string;
}>;
