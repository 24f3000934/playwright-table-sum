const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let totalSum = 0;

  console.log('Starting scraping process...');

  for (let seed = 10; seed <= 19; seed++) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log(`Navigating to: ${url}`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' }, { timeout: 30000 });
      
      // Wait for the table to be rendered in the #table div
      await page.waitForSelector('#table table', { timeout: 10000 });
      
      // Get all table cells and sum the numeric contents
      const numbers = await page.$$eval('#table table td', cells => {
        return cells
          .map(cell => cell.textContent.trim())
          .map(text => parseFloat(text))
          .filter(num => !isNaN(num));
      });
      
      const pageSum = numbers.reduce((a, b) => a + b, 0);
      console.log(`Found ${numbers.length} numbers on this page.`);
      console.log(`Sum for seed ${seed}: ${pageSum}`);
      totalSum += pageSum;
    } catch (error) {
      console.error(`Error scraping seed ${seed}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(30));
  console.log(`TOTAL_SUM: ${totalSum}`);
  console.log('='.repeat(30));

  await browser.close();
})();
