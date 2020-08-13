const puppeteer = require('puppeteer');

(async () => {
const browser = await puppeteer.launch({
headless: false,
slowMo: 250 // slow down by 250ms
});
const page = await browser.newPage();
await page.setViewport({
width: 640,
height: 480,
deviceScaleFactor: 1,
});
await page.goto('https://elcomercio.pe');
await page.screenshot({path: 'ec.png'});

await browser.close();
})();