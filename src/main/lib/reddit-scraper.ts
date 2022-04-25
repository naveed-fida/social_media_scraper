import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';

type CommentsType = { postTitle: string; comments: Array<string> };

export default class RedditScrapper {
  private subReddits: Array<string> = [];

  static POSTS_PER_SUBREDDIT = 20;

  private keywords: Array<string>;

  private baseURL = 'https://reddit.com';

  constructor(subReddits: Array<string>, keywords: Array<string>) {
    this.subReddits = subReddits;
    this.keywords = keywords;
  }

  filterComments(commentsArr: Array<CommentsType>) {
    const prunedComments = commentsArr.map((cmnts) => ({
      ...cmnts,
      comments: cmnts.comments.filter((c) => c.length < 2000),
    }));

    const filteredComments = prunedComments.filter(
      (cmnts) => cmnts.comments.length > 0
    );

    return filteredComments;
  }

  async filterTitlesByKeywords(titles: Array<ElementHandle>, page: Page) {
    const titleTexts: Array<string> = await Promise.all(
      titles.map((title) => page.evaluate((el) => el.innerText, title))
    );

    const filtered: Array<ElementHandle> = [];

    for (let i = 0; i < titles.length; i += 1) {
      const titleEL = titles[i];
      const titleText = titleTexts[i];

      if (titleText.match(new RegExp(this.joinedKeywords(), 'i'))) {
        filtered.push(titleEL);
      }
    }

    return filtered;
  }

  async getPageHeight(page: Page): Promise<number> {
    const body = await page.$('body');
    const height = await page.evaluate((el) => el.scrollHeight, body);

    return Number(height);
  }

  async getPostTitles(page: Page, count: number) {
    let titles: Array<ElementHandle> = [];
    let unsuccessfulScrolls = 0;
    const self = this;

    let oldHeight = await this.getPageHeight(page);

    await (async function fetchTitles() {
      const postTitles = await page.$$('h3');
      const filteredTitles = await self.filterTitlesByKeywords(
        postTitles,
        page
      );

      titles = filteredTitles;
      if (titles.length < count && unsuccessfulScrolls < 3) {
        await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
        await page.waitForTimeout(3000);
        const height = await self.getPageHeight(page);

        if (oldHeight === height) {
          unsuccessfulScrolls += 1;
        } else unsuccessfulScrolls = 0;
        oldHeight = height;

        await fetchTitles();
      }
    })();

    return titles;
  }

  private async getPostURLs(titles: Array<ElementHandle>, page: Page) {
    const postLinks = await Promise.all(
      titles.map((title) => title.$x('../..'))
    );

    const postPaths = await Promise.all(
      postLinks
        .map((coll) => coll[0])
        .map((link) => page.evaluate((el) => el.getAttribute('href'), link))
    );

    return postPaths;
  }

  async getComments(subRedditURL: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(subRedditURL);
    const titles = await this.getPostTitles(
      page,
      RedditScrapper.POSTS_PER_SUBREDDIT
    );

    const postPaths = await this.getPostURLs(titles, page);
    const comments = await Promise.all(
      postPaths.map((path) => this.getCommentsFromPost(browser, path))
    );

    browser.close();
    return this.filterComments(comments);
  }

  joinedKeywords() {
    return this.keywords.map((kw) => kw.trim()).join('|');
  }

  async getCommentsFromPost(browser: Browser, path: string) {
    const page = await browser.newPage();
    await page.goto(`${this.baseURL}/${path}`);

    const title = await page.$('p.title');
    const heading: string = await page.evaluate((el) => el.innerText, title);
    const allComments = await page.$$('div.usertext-body');

    const innerTexts: Array<string> = await Promise.all(
      allComments.map((div) => page.evaluate((el) => el.innerHTML, div))
    );

    await page.close();
    return { postTitle: heading, comments: innerTexts };
  }

  async scrapeForComments() {
    const comments = await Promise.all(
      this.subReddits.map((subReddit) => {
        return this.getComments(`${this.baseURL}/${subReddit}`);
      })
    );

    return comments.reduce((cmnts, result) => result.concat(cmnts), []);
  }
}
