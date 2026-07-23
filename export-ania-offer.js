const path = require('node:path');
const fs = require('node:fs');
const puppeteer = require('puppeteer');

async function main() {
  const projectRoot = __dirname;
  const offerHtmlPath = path.join(projectRoot, 'offer-ania-kowalczyk.html');

  if (!fs.existsSync(offerHtmlPath)) {
    console.error('offer-ania-kowalczyk.html not found in project root.');
    process.exit(1);
  }

  const outputPath = path.join(projectRoot, 'Oferta_Landing_Page_Ksiazka_Aleksander_Banaszak.pdf');
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    const fileUrl = `file://${offerHtmlPath}`;

    await page.goto(fileUrl, {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    console.log(`Offer exported to ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
