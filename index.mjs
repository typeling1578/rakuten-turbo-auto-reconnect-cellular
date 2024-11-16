import puppeteer from "puppeteer";
import { login, reconfig_lte_5g, logout } from "./dashboard-controller.mjs";
import config from "./config.json" with { type: "json" };

const browser = await puppeteer.launch({
  headless: true,
  executablePath: config.chromium_browser_path,
  defaultViewport: {
    width: 1280,
    height: 720,
  }
});

const page = await browser.newPage();

await login(page, config.username, config.password);
await reconfig_lte_5g(page);
await logout(page);

await page.close();
await browser.close();
