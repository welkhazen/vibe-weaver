const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');
  const goldS = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--gold-s').trim();
  });
  const goldL = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--gold-l').trim();
  });
  console.log('gold-s:', goldS);
  console.log('gold-l:', goldL);
  await browser.close();
})();
