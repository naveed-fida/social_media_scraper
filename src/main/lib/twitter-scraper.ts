import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from 'types';

export default class TwitterScraper {
  private keywords: Array<string>;

  private MAX_LIMIT = 10;

  private tweetsPerKeyword: number;

  private client: TwitterApi;

  constructor(keywords: Array<string>, tweetsPerKeyword: number) {
    this.keywords = keywords;
    this.tweetsPerKeyword = tweetsPerKeyword;
    this.client = new TwitterApi(
      'AAAAAAAAAAAAAAAAAAAAAOt%2BbwEAAAAAoOBHhbnizmFj6Orq%2F4KXhskZ5nc%3DwoxZzVX9ajbhuF6HWmq8UmxHxCOyr5mSBv6JlgyU9eFpVplGx0'
    );
  }

  tweetsPerPage(limit: number) {
    return limit < this.MAX_LIMIT ? limit : this.MAX_LIMIT;
  }

  async getTweetsWithKeyword(keyword: string) {
    let tweets: Array<Tweet> = [];
    const self = this;

    const fetchedTweets = await self.client.v2.search(keyword, {
      max_results: this.tweetsPerPage(this.tweetsPerKeyword),
    });

    tweets = tweets.concat(fetchedTweets.data.data);

    if (this.tweetsPerKeyword <= this.MAX_LIMIT) return tweets;

    let prevTweets = fetchedTweets;
    await (async function fetchTweets() {
      const nextTweets = await prevTweets.next(
        self.tweetsPerPage(self.tweetsPerKeyword - tweets.length)
      );

      tweets = tweets.concat(Array.from(nextTweets.data.data));
      prevTweets = nextTweets;
      if (tweets.length < self.tweetsPerKeyword) {
        await fetchTweets();
      }
    })();

    return tweets;
  }

  async getTweets() {
    const allTweets = await Promise.all(
      this.keywords.map((keyword) => {
        return this.getTweetsWithKeyword(keyword);
      })
    );

    return allTweets.reduce((soFar, tweetSet) => soFar.concat(tweetSet), []);
  }
}

// (async () => {
//   const scraper = new TwitterScraper(["shaheen afridi", "babar azam"], 25);
//   const tweets = await scraper.getTweets();
//   console.log(tweets);
// })();
