const fs = require('fs')
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const config = require('./config');

const csvDir = 'csv';
const timeout = 20000;

(async () => {
const urls = config.urls.split('\n')
console.log(chalk.greenBright.bold('Amount of URLs to be checked: '), urls.length)

const browser = await puppeteer.launch();
const page = await browser.newPage();

const iterate = async (num = 0) => {
if(num<urls.length){
const response = await page.goto(
`${config.siteUrl}${urls[num].replace(/\s+/, '')}?outputType=${config.parameters.outputType}&_website=${config.parameters._website}`,
{
timeout,
waitUntil: 'domcontentloaded'
}
);
let label = ` ${response.status()} `
if(response.status() >= 200 && response.status() < 300) {
label = chalk.black.bgGreenBright.bold(` ${response.status()} `)
} else if(response.status() >= 300 && response.status() < 400) {
label = chalk.black.bgYellow.bold(` ${response.status()} `)
} else if(response.status() >= 400) {
label = chalk.black.bgRed.bold(` ${response.status()} `)
}

await fs.appendFile(`${csvDir}/${config.outputCSV}.csv`, `${response.status()}, ${response.url()}, ${new Date().toLocaleDateString()}\r\n`, 'utf8', async function (err) {
await console.log(`${num} - ${label}: ${response.url()}`)
})

await iterate(num+1)
}
}

if (!fs.existsSync(csvDir)){
  fs.mkdirSync(csvDir);
}
await fs.writeFile(`${csvDir}/${config.outputCSV}.csv`, 'status, URL, date\r\n', 'utf8', async function (err) {
  await console.log(chalk.bgGreen(` Header written in the '${csvDir}/${config.outputCSV}.csv' file `))
})
await iterate()
await browser.close();
})();