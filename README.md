# Description

This is an Electron desktop app that scrapes Twitter for tweets, and LinkedIn and Reddit for posts and comments that include the given words and phrases.

## How to build

To build an executable for your platform, simply run `npm run build` and it will create an executable for you in the `/release/app` directory.

### Twitter API key

In order for the twitter scraping to work, you need a Twitter API access key. Create a developer account at twitter and set the private property `TWITTER_AUTH_KEY` to your API token in the class at `src/main/lib/twitter-scraper.ts` file.
