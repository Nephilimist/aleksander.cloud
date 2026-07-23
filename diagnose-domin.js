const puppeteer = require('puppeteer');

async function diagnose() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  console.log("=== Checking https://www.domin-krakow.pl/ ===");
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.toString()}`);
  });

  page.on('response', response => {
    if (!response.ok()) {
      console.log(`[FAILED NETWORK] ${response.status()} ${response.url()}`);
    }
  });

  try {
    await page.goto('https://www.domin-krakow.pl/', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch(e) {
    console.log(`Navigation error: ${e}`);
  }

  console.log("\n=== Checking https://domin-krakow.pl/sklep/warsztaty-haftu/ ===");
  
  try {
    await page.goto('https://domin-krakow.pl/sklep/warsztaty-haftu/', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch(e) {
    console.log(`Navigation error: ${e}`);
  }

  await browser.close();
}

diagnose();
