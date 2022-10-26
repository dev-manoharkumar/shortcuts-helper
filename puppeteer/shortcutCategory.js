import puppeteer from 'puppeteer';
import { FILE_NAME, GENERATED_FILE_PATH } from '../csvHelper/constants.js';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://support.google.com/docs/answer/181110?hl=en&co=GENIE.Platform%3DDesktop&oco=1#zippy=%2Cpc-shortcuts%2Cmac-shortcuts%2Cchrome-os-shortcuts%2Ccommon-actions%2Cnavigate-spreadsheet%2Cformat-cells%2Cedit-notes-and-comments');
  await page.waitForSelector(`#hcfe-content`)
  const shortcutCategory = await page.evaluate(resultSelector => {
    return [...document.querySelectorAll('#hcfe-content > section > div > div.main-content > article > section > div > div > div:nth-child(6) > div.zippy-overflow > div > table > tbody > tr > th > p')].map(element => {
      return element.innerText
    })
  })
  writeCsvFile(GENERATED_FILE_PATH.SHORTCUT_CATEGORY)
  await browser.close();
})();
