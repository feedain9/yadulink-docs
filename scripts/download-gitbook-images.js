const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = path.join(__dirname, '..', 'static', 'img');

const PAGES = [
  {
    url: 'https://help.yadulink.com/partager-une-liste-de-contacts',
    outputDir: 'liste-de-contacts',
    prefix: 'partager'
  },
  {
    url: 'https://help.yadulink.com/exporter-une-liste-de-contacts',
    outputDir: 'liste-de-contacts',
    prefix: 'exporter'
  },
  {
    url: 'https://help.yadulink.com/ia/parametrer-lia-des-premiers-messages',
    outputDir: 'ia',
    prefix: 'parametrer'
  },
  {
    url: 'https://help.yadulink.com/ia/generer-un-premier-message-via-une-publication',
    outputDir: 'ia',
    prefix: 'message-publication'
  },
  {
    url: 'https://help.yadulink.com/ia/creer-un-template-de-message',
    outputDir: 'ia',
    prefix: 'creer-template'
  },
  {
    url: 'https://help.yadulink.com/ia/utiliser-un-template-de-message',
    outputDir: 'ia',
    prefix: 'utiliser-template'
  },
  {
    url: 'https://help.yadulink.com/fils-dactus/creer-un-fil-dactu',
    outputDir: 'fils-dactus',
    prefix: 'creer'
  },
  {
    url: 'https://help.yadulink.com/cas-dusage/envoyer-un-lead-magnet',
    outputDir: 'cas-dusage',
    prefix: 'leadmagnet'
  },
  {
    url: 'https://help.yadulink.com/bugs-and-erreurs/yadulink-napparait-pas-dans-la-section-commentaire',
    outputDir: 'bugs-erreurs',
    prefix: 'commentaire'
  },
  {
    url: 'https://help.yadulink.com/workhours',
    outputDir: 'pour-commencer',
    prefix: 'horaires'
  },
  {
    url: 'https://help.yadulink.com/pour-commencer/icp-personnalization',
    outputDir: 'pour-commencer',
    prefix: 'ciblage'
  },
  {
    url: 'https://help.yadulink.com/pour-commencer/synchronize',
    outputDir: 'pour-commencer',
    prefix: 'sync'
  }
];

async function downloadImage(page, imgElement, outputPath) {
  try {
    // Get the image as base64 using canvas
    const base64 = await page.evaluate((img) => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png').split(',')[1]);
      });
    }, imgElement);

    // Write the base64 data to file
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`  Saved: ${outputPath} (${buffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`  Error saving ${outputPath}:`, err.message);
    return false;
  }
}

async function processPage(browser, pageConfig) {
  const { url, outputDir, prefix } = pageConfig;
  console.log(`\n=== Processing: ${url} ===`);

  const outputPath = path.join(BASE_DIR, outputDir);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for images to load
    await page.waitForSelector('img', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 2000)); // Extra wait for lazy loading

    // Scroll to bottom to load all images
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait for any lazy-loaded images
    await new Promise(r => setTimeout(r, 2000));

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Get all content images (excluding logos and small images)
    const images = await page.$$eval('img', (imgs) => {
      return imgs.filter(img => {
        const src = img.src || '';
        return img.naturalWidth > 200 &&
               !src.includes('logo') &&
               !src.includes('favicon') &&
               img.naturalHeight > 100;
      }).map((img, i) => ({
        index: i,
        width: img.naturalWidth,
        height: img.naturalHeight
      }));
    });

    console.log(`  Found ${images.length} images`);

    // Get image elements and download each one
    const imgElements = await page.$$('img');
    let count = 1;

    for (const imgElement of imgElements) {
      const imgInfo = await page.evaluate((img) => ({
        width: img.naturalWidth,
        height: img.naturalHeight,
        src: img.src
      }), imgElement);

      // Skip logos and small images
      if (imgInfo.width <= 200 || imgInfo.height <= 100 ||
          imgInfo.src.includes('logo') || imgInfo.src.includes('favicon')) {
        continue;
      }

      const outputFile = path.join(outputPath, `${prefix}-step${count}.png`);
      const success = await downloadImage(page, imgElement, outputFile);
      if (success) count++;
    }

    console.log(`  Total saved: ${count - 1} images`);
  } catch (err) {
    console.error(`  Error processing ${url}:`, err.message);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('Starting GitBook image download...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const pageConfig of PAGES) {
      await processPage(browser, pageConfig);
    }
  } finally {
    await browser.close();
  }

  console.log('\n=== All downloads complete ===');
}

main().catch(console.error);
