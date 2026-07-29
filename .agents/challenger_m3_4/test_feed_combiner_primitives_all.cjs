const path = require('path');
const { pathToFileURL } = require('url');

async function testPrimitives() {
  const fileUrl = pathToFileURL(path.resolve(__dirname, '../../src/utils/feedCombiner.js')).href;
  const { combineFeedItems } = await import(fileUrl);

  console.log('--- TEST: Primitives in events, news, announcements, jobs ---');
  const res = combineFeedItems([], ['bad_event', 456], ['bad_news'], ['bad_announcement'], [true]);
  console.log('Result for primitives in events/news/announcements/jobs:', JSON.stringify(res, null, 2));
}

testPrimitives();
