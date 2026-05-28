const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const resumePath = path.join(process.cwd(), 'resume.html');
    const resumeUrl = `file://${resumePath}`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(resumeUrl, { waitUntil: 'networkidle0' });

    const outputPath = path.join(process.cwd(), 'ASSETS', 'Henry_Ani_CV.pdf');
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' } });

    console.log('PDF generated at', outputPath);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();
