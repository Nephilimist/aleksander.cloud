/**
 * screenshot.js — Portfolio screenshot tool
 * 1920x1080, aggressively dismisses cookie banners,
 * hides Elementor badge + WP admin bar before shooting.
 *
 * Usage:
 *   node screenshot.js                         # batch mode
 *   node screenshot.js <url> <filename.png>    # single URL
 */

const puppeteer = require('puppeteer');
const path = require('path');

const BATCH = [
  { url: 'https://improtak.pl/',            filename: 'improtak.png' },
  { url: 'https://wsnm.edu.pl/',            filename: 'wsnm.png'     },
  { url: 'https://famev.de/',               filename: 'famev.png'    },
  { url: 'https://myorlen.pl/kotly-gazowe', filename: 'myorlen.png'  },
  { url: 'https://hernest.estate/oferty/',  filename: 'hernest.png'  },
];

const VIEWPORT = { width: 1920, height: 1080 };

// CSS injected before every screenshot — hides WP/Elementor chrome + cookie overlays
const HIDE_CSS = `
  /* WordPress admin bar */
  #wpadminbar { display: none !important; }
  html { margin-top: 0 !important; }

  /* Elementor "Made with Elementor" badge */
  .elementor-widget-container .e-logo-wrapper,
  #e-logo-wrapper,
  .elementor-editor-active .elementor-edit-area,
  a[href*="elementor.com"],
  .elementor-clearfix ~ a[href*="elementor"],
  [class*="elementor-icon-list"] a[href*="elementor.com"],
  /* common footer Elementor badge wrappers */
  .powered-by, .site-info a[href*="elementor"],
  #footer-bottom a[href*="elementor"],
  .footer-credits a[href*="elementor"],
  /* WP "Powered by WordPress" */
  a[href*="wordpress.org"],
  /* Cookiebot */
  #CybotCookiebotDialog, #CybotCookiebotDialogBodyUnderlay,
  .CybotCookiebotFader, #CybotCookiebotDialogTabContent,
  /* cookie overlays / modals */
  [class*="cookie-bar"], [id*="cookie-bar"],
  [class*="cookie-banner"], [id*="cookie-banner"],
  [class*="cookie-notice"], [id*="cookie-notice"],
  [class*="cookie-overlay"], [id*="cookie-overlay"],
  [class*="cookiebanner"], [id*="cookiebanner"],
  [class*="cookieConsent"], [id*="cookieConsent"],
  [class*="cookie-consent"], [id*="cookie-consent"],
  [class*="cc-window"], [id*="cc-window"],
  [class*="cmpwrapper"], [id*="cmpwrapper"],
  .onetrust-pc-dark-filter, #onetrust-banner-sdk,
  #onetrust-consent-sdk, .onetrust-blur,
  [class*="gdpr"], [id*="gdpr"],
  [class*="consent-banner"], [id*="consent-banner"],
  body > div[class*="modal"][style*="z-index: 999"],
  body > div[id*="modal"][style*="z-index: 999"]
  { display: none !important; opacity: 0 !important; visibility: hidden !important; }

  /* Unblock body scroll that cookie overlays often lock */
  body, html { overflow: auto !important; }
`;

// Cookie accept selectors (try clicking before hiding)
const COOKIE_SELECTORS = [
  // Cookiebot
  '#CybotCookiebotDialogBodyButtonAccept',
  '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
  '#CybotCookiebotDialogBodyLevelButtonAccept',
  // OneTrust
  '#onetrust-accept-btn-handler',
  '.cc-btn.cc-allow', '.cc-allow', '.cc-accept',
  '[id*="accept"]', '[class*="accept-all"]',
  '[id*="zgod"]',   '[class*="zgod"]',
  '.cookieConsent__Button--Accept',
  '[data-cy="accept"]', '[data-testid*="accept"]',
  'button[class*="primary"]',
];

// Also try matching by visible button text
const COOKIE_TEXT = [
  'Akceptuję', 'Akceptuj wszystkie', 'Akceptuj', 'Zgadzam się',
  'Zezwól na wszystkie', 'Zezwól', 'Accept all', 'Accept All',
  'Accept', 'Alle akzeptieren', 'Akzeptieren', 'OK',
];

async function dismissCookies(page) {
  // 1. Try selector-based click
  for (const sel of COOKIE_SELECTORS) {
    try {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 900));
        return 'selector:' + sel;
      }
    } catch (_) {}
  }

  // 2. Try matching button text
  const found = await page.evaluate((texts) => {
    const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="button"]'));
    for (const text of texts) {
      const btn = buttons.find(b => (b.textContent || '').trim().startsWith(text));
      if (btn) { btn.click(); return btn.textContent.trim(); }
    }
    return null;
  }, COOKIE_TEXT);

  if (found) {
    await new Promise(r => setTimeout(r, 900));
    return 'text:' + found;
  }

  return null;
}

async function shoot(page, url, filename) {
  const out = path.join(__dirname, 'assets', 'img', filename);
  console.log('Capturing: ' + url);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for overlays/animations to settle
    await new Promise(r => setTimeout(r, 2500));

    // Try to click the cookie accept button
    const dismissed = await dismissCookies(page);
    if (dismissed) {
      console.log('  Cookie dismissed via ' + dismissed);
      await new Promise(r => setTimeout(r, 1200));
    }

    // Inject CSS to hide any remaining WP/Elementor chrome + cookie overlays
    await page.addStyleTag({ content: HIDE_CSS });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 300));

    await page.screenshot({ path: out });
    console.log('  Saved: ' + out);
  } catch (e) {
    console.error('  FAIL: ' + e.message);
  }
}

(async () => {
  const args = process.argv.slice(2);
  const targets = args.length >= 2 ? [{ url: args[0], filename: args[1] }] : BATCH;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );

  for (const { url, filename } of targets) {
    await shoot(page, url, filename);
  }

  await browser.close();
  console.log('Done!');
})();
