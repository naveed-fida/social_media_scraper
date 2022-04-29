export type SelectedSite = 'Reddit' | 'Twitter' | 'LinkedIn' | 'none';

export interface RedditSettings {
  subReddits: Array<string>;
  keywords: Array<string>;
}

export interface TwitterSettings {
  keywords: Array<string>;
  tweetsPerKeyword: number;
}

export type LoadingStatus = 'not_fetched' | 'loading' | 'fetched';

export type FetchedComments = Array<{
  comments: Array<string>;
  postTitle: string;
}>;

export interface LinkedInSettings {
  keywords: Array<string>;
  postsPerKeyword: number;
  sessionId: string | null;
}

export type LinkedInPost = {
  poster: string;
  text: string;
};

export type Tweet = { id: string; text: string };
