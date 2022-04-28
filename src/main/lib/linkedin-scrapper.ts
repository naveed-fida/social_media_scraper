import puppeteer, { ElementHandle, Page, Browser } from 'puppeteer';

export default class LinkedIn {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async getPostDetails(post: ElementHandle, page: Page) {
    const nameTag = await post.$('span.feed-shared-actor__name');
    const posterName = await page.evaluate((el) => el.textContent, nameTag);
    const textTag = await post.$('span.break-words');
    const text = await page.evaluate((el) => el.textContent, textTag);

    return {
      poster: posterName.trim(),
      text: text.trim(),
    };
  }

  async getPostsWithKeyword(browser: Browser, keyword: string) {
    const page = await browser.newPage();
    await page.setCookie({
      name: 'li_at',
      value: this.sessionId,
      url: 'https://www.linkedin.com',
    });

    await page.goto(
      `https://www.linkedin.com/search/results/content/?keywords=${keyword}`
    );

    const posts = await this.getPosts(page, 10);
    const postsWithDetails = await Promise.all(
      posts.map((post) => this.getPostDetails(post, page))
    );
    await page.close();

    return { keyword, posts: postsWithDetails };
  }

  async search(keywords: Array<string>) {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1028, height: 1065 },
    });

    const allPosts = await Promise.all(
      keywords.map((keyword) => this.getPostsWithKeyword(browser, keyword))
    );

    await browser.close();

    return allPosts;
  }

  async getPageHeight(page: Page): Promise<number> {
    const body = await page.$('body');
    const height = await page.evaluate((el) => el.scrollHeight, body);

    return Number(height);
  }

  async getPosts(page: Page, count: number) {
    let posts: Array<ElementHandle> = [];
    let unsuccessfulScrolls = 0;
    const self = this;
    let oldHeight = await this.getPageHeight(page);

    await (async function fetchPosts() {
      posts = await page.$$('div.feed-shared-update-v2');

      if (posts.length < count && unsuccessfulScrolls < 3) {
        await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
        await page.waitForTimeout(3000);
        const height = await self.getPageHeight(page);

        if (oldHeight === height) {
          unsuccessfulScrolls += 1;
        } else unsuccessfulScrolls = 0;
        oldHeight = height;

        await fetchPosts();
      }
    })();

    return posts;
  }
}

(async () => {
  const linkedin = new LinkedIn(
    'AQEDASJkY3EDwyZ1AAABgHALYh8AAAGAlBfmH00AhtDhSdLrqCEN3y3ZAXzrbLUY27fX2Y0msNPKwt3Tg_1eyFH8_3A3Ka0REqFikEhBNgC5MM3k6_8m8yE7jlEz20cWdwBjPnMqOs6Ycgr6-HRQo2It'
  );

  await linkedin.search(['productivity']);
})();
