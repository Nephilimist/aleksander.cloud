const path = require('node:path');
const fs = require('node:fs');
const puppeteer = require('puppeteer');

async function main() {
  const projectRoot = __dirname;
  const referenceHtmlPath = path.join(projectRoot, 'references.html');

  if (!fs.existsSync(referenceHtmlPath)) {
    console.error('references.html not found in project root.');
    process.exit(1);
  }

  const outputPath = path.join(projectRoot, 'Aleksander-Banaszak_Reference.pdf');
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    const fileUrl = `file://${referenceHtmlPath}`;

    await page.goto(fileUrl, {
      waitUntil: ['load', 'networkidle0'],
    });

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

    console.log(`Reference exported to ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

