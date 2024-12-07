
// import puppeteer from "puppeteer"
// import chrome from "chrome-aws-lambda"
// const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar"
//  await chromium.executablePath(chromiumPack)

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = 'nodejs';
chromium.setGraphicsMode = false
export async function generatePDF(html: string) {

    const browser = await puppeteer.launch({
        args: [...chromium.args,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-web-security",
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--allow-file-access-from-files'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        //     args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        //     defaultViewport: chrome.defaultViewport,
        //     executablePath: await chrome.executablePath,
        //     headless: true,
        //     ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage()
    await page.setBypassCSP(true)
    await page.setJavaScriptEnabled(false)
    await page.emulateMediaType("screen")
    await page.setContent(html, {
        waitUntil: ["load", "networkidle0", "domcontentloaded", "networkidle2"],
    })

    const format = "A6"
    const docUnits = "0px"
    const pdfBuffer = await page.pdf({
        printBackground: true,  // enable css
        format,
        margin: {
            top: docUnits,
            bottom: docUnits,
            left: docUnits,
            right: docUnits,
        },
    })

    await page.close()
    await browser.close()
    return pdfBuffer
}

// page.on('request', request => {
//     console.log('Request:', request.url());
// });
// page.on('response', response => {
//     console.log('Response:', response.url(), response.status());
// });

// page.on('requestfailed', request => {
//     // ! fix error image not work in vercel production
//     console.log("Failed : " + request.url() + ' ' + request.failure()?.errorText ?? "");
//     Sentry.captureException(request.failure()?.errorText) // send error to sentry
// });
