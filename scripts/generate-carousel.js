#!/usr/bin/env node

/**
 * LinkedIn Carousel PDF Generator
 *
 * Takes a carousel config JSON and generates a branded PDF carousel
 * using Playwright to render HTML slides.
 *
 * Usage: node scripts/generate-carousel.js <config-path>
 * Example: node scripts/generate-carousel.js carousel-configs/your-job-is-not-a-function.json
 *
 * Output: public/blogs/carousels/<slug>-carousel.pdf
 */

// Use playwright from npx cache (already installed with Chromium)
const playwrightPath = require('child_process')
  .execSync('find /home/ubuntu/.npm/_npx -path "*/playwright/index.js" -not -path "*/next/*" | head -1')
  .toString()
  .trim();
const { chromium } = require(playwrightPath);
const fs = require('fs');
const path = require('path');

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;

const BRAND = {
  bg: '#0f172a',
  bgAlt: '#1e293b',
  accent: '#3b82f6',
  accentLight: '#60a5fa',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDark: '#64748b',
  border: '#334155',
};

function generateSlideHTML(slide, config, index, total) {
  const footer = `
    <div style="
      position: absolute;
      bottom: 40px;
      left: 60px;
      right: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 22px;
      color: ${BRAND.textDark};
    ">
      <span>${config.website}</span>
      <span>${index + 1} / ${total}</span>
    </div>
  `;

  if (slide.type === 'title') {
    // Load profile photo
    let profilePhotoHTML = '';
    if (config.profilePhoto) {
      const photoPath = path.resolve(config.profilePhoto);
      if (fs.existsSync(photoPath)) {
        const photoBase64 = fs.readFileSync(photoPath).toString('base64');
        const photoExt = path.extname(photoPath).slice(1) === 'jpg' ? 'jpeg' : path.extname(photoPath).slice(1);
        profilePhotoHTML = `<img src="data:image/${photoExt};base64,${photoBase64}" style="
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
        " />`;
      }
    }
    if (!profilePhotoHTML) {
      profilePhotoHTML = `<div style="
        width: 56px; height: 56px; background: ${BRAND.accent}; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: 700; color: white;
      ">${config.author.split(' ').map(n => n[0]).join('')}</div>`;
    }

    // Load featured image for title slide
    let featuredImageHTML = '';
    if (config.featuredImage) {
      const featPath = path.resolve(config.featuredImage);
      if (fs.existsSync(featPath)) {
        const featBase64 = fs.readFileSync(featPath).toString('base64');
        const featExt = path.extname(featPath).slice(1) === 'jpg' ? 'jpeg' : path.extname(featPath).slice(1);
        featuredImageHTML = `
          <div style="
            margin-top: 32px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: white;
            border-radius: 16px;
            padding: 16px;
            max-height: 420px;
          ">
            <img src="data:image/${featExt};base64,${featBase64}" style="
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              border-radius: 8px;
            " />
          </div>
        `;
      }
    }

    return `
      <div style="
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        background: ${BRAND.bg};
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 60px 60px 80px 60px;
        box-sizing: border-box;
        position: relative;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        ">
          ${profilePhotoHTML}
          <div>
            <div style="font-size: 24px; font-weight: 600; color: ${BRAND.text};">${config.author}</div>
            <div style="font-size: 20px; color: ${BRAND.textMuted};">${config.handle} on Medium</div>
          </div>
        </div>
        <div style="
          width: 80px;
          height: 6px;
          background: ${BRAND.accent};
          border-radius: 3px;
          margin-bottom: 28px;
        "></div>
        <h1 style="
          font-size: 64px;
          font-weight: 800;
          color: ${BRAND.text};
          line-height: 1.15;
          margin: 0 0 20px 0;
          letter-spacing: -1.5px;
          white-space: pre-line;
        ">${config.title}</h1>
        <p style="
          font-size: 26px;
          color: ${BRAND.textMuted};
          line-height: 1.5;
          margin: 0;
          max-width: 880px;
        ">${config.subtitle}</p>
        ${featuredImageHTML}
        ${footer}
      </div>
    `;
  }

  if (slide.type === 'visual') {
    const imagePath = path.resolve(slide.image);
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');
    const ext = path.extname(imagePath).slice(1) === 'jpg' ? 'jpeg' : path.extname(imagePath).slice(1);
    const dataUri = `data:image/${ext};base64,${imageBase64}`;

    return `
      <div style="
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        background: ${BRAND.bg};
        display: flex;
        flex-direction: column;
        padding: 60px;
        box-sizing: border-box;
        position: relative;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      ">
        <h2 style="
          font-size: 42px;
          font-weight: 700;
          color: ${BRAND.text};
          margin: 0 0 24px 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        ">${slide.headline}</h2>
        <div style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
          overflow: hidden;
          background: white;
          border-radius: 16px;
          padding: 20px;
        ">
          <img src="${dataUri}" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
          " />
        </div>
        <p style="
          font-size: 26px;
          color: ${BRAND.textMuted};
          line-height: 1.5;
          margin: 16px 0 0 0;
          min-height: 80px;
        ">${slide.point}</p>
        ${footer}
      </div>
    `;
  }

  if (slide.type === 'cta') {
    // Load profile photo for CTA
    let ctaPhotoHTML = '';
    if (config.profilePhoto) {
      const photoPath = path.resolve(config.profilePhoto);
      if (fs.existsSync(photoPath)) {
        const photoBase64 = fs.readFileSync(photoPath).toString('base64');
        const photoExt = path.extname(photoPath).slice(1) === 'jpg' ? 'jpeg' : path.extname(photoPath).slice(1);
        ctaPhotoHTML = `<img src="data:image/${photoExt};base64,${photoBase64}" style="
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid ${BRAND.accent};
          margin-bottom: 24px;
        " />`;
      }
    }

    return `
      <div style="
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        background: ${BRAND.bg};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 80px 60px;
        box-sizing: border-box;
        position: relative;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        text-align: center;
      ">
        ${ctaPhotoHTML}
        <h2 style="
          font-size: 52px;
          font-weight: 800;
          color: ${BRAND.text};
          margin: 0 0 24px 0;
          line-height: 1.2;
        ">Read the full article</h2>
        <p style="
          font-size: 28px;
          color: ${BRAND.textMuted};
          margin: 0 0 48px 0;
        ">${config.url}</p>
        <div style="
          background: ${BRAND.accent};
          color: white;
          font-size: 28px;
          font-weight: 600;
          padding: 20px 48px;
          border-radius: 12px;
          margin-bottom: 48px;
        ">Follow for more</div>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
        ">
          <div style="font-size: 24px; color: ${BRAND.textMuted};">
            linkedin.com/in/${config.linkedin}
          </div>
          <div style="font-size: 24px; color: ${BRAND.textMuted};">
            medium.com/${config.handle}
          </div>
          <div style="font-size: 24px; color: ${BRAND.textMuted};">
            ${config.website}
          </div>
        </div>
        ${footer}
      </div>
    `;
  }

  throw new Error(`Unknown slide type: ${slide.type}`);
}

async function generateCarousel(configPath) {
  const projectRoot = path.resolve(__dirname, '..');
  const config = JSON.parse(fs.readFileSync(path.resolve(projectRoot, configPath), 'utf-8'));

  const slug = path.basename(configPath, '.json');
  const outputDir = path.join(projectRoot, 'public', 'blogs', 'carousels');
  const outputPath = path.join(outputDir, `${slug}-carousel.pdf`);

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Generating carousel for: ${config.title.replace('\n', ' ')}`);
  console.log(`Slides: ${config.slides.length}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: SLIDE_WIDTH, height: SLIDE_HEIGHT },
    deviceScaleFactor: 2,
  });

  const pngPaths = [];

  for (let i = 0; i < config.slides.length; i++) {
    const slide = config.slides[i];
    const html = generateSlideHTML(slide, config, i, config.slides.length);

    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; overflow: hidden; }
        </style>
      </head>
      <body>${html}</body>
      </html>
    `;

    const page = await context.newPage();
    await page.setContent(fullHTML, { waitUntil: 'networkidle' });

    const pngPath = path.join(outputDir, `${slug}-slide-${i + 1}.png`);
    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: SLIDE_WIDTH, height: SLIDE_HEIGHT },
    });

    pngPaths.push(pngPath);
    await page.close();
    console.log(`  Slide ${i + 1}/${config.slides.length}: ${slide.type}${slide.headline ? ` - ${slide.headline}` : ''}`);
  }

  // Generate PDF by creating a multi-page HTML with all slides
  const allSlidesHTML = pngPaths.map((p, i) => {
    const base64 = fs.readFileSync(p).toString('base64');
    const pageBreak = i < pngPaths.length - 1 ? 'page-break-after: always;' : '';
    return `<div style="width: ${SLIDE_WIDTH}px; height: ${SLIDE_HEIGHT}px; ${pageBreak}">
      <img src="data:image/png;base64,${base64}" style="width: 100%; height: 100%;" />
    </div>`;
  }).join('\n');

  const pdfHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }
        @page { size: ${SLIDE_WIDTH}px ${SLIDE_HEIGHT}px; margin: 0; }
      </style>
    </head>
    <body>${allSlidesHTML}</body>
    </html>
  `;

  const pdfPage = await context.newPage();
  await pdfPage.setContent(pdfHTML, { waitUntil: 'networkidle' });
  await pdfPage.pdf({
    path: outputPath,
    width: `${SLIDE_WIDTH}px`,
    height: `${SLIDE_HEIGHT}px`,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
  });

  await pdfPage.close();
  await browser.close();

  // Clean up individual PNGs (pass --keep-slides to preserve them)
  if (!process.argv.includes('--keep-slides')) {
    for (const p of pngPaths) {
      fs.unlinkSync(p);
    }
  } else {
    console.log(`Individual slides kept in: ${outputDir}/`);
  }

  console.log(`\nCarousel PDF generated: ${outputPath}`);
  console.log(`Slides: ${config.slides.length} | Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(1)} MB`);

  return outputPath;
}

// CLI entry point
const configPath = process.argv[2];
if (!configPath) {
  console.error('Usage: node scripts/generate-carousel.js <config-path>');
  console.error('Example: node scripts/generate-carousel.js carousel-configs/your-job-is-not-a-function.json');
  process.exit(1);
}

generateCarousel(configPath).catch(err => {
  console.error('Error generating carousel:', err.message);
  process.exit(1);
});
