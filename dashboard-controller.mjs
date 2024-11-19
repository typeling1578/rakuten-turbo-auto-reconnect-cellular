import sleep from "./sleep.mjs";
import config from "./config.json" with { type: "json" };

export async function login(page, username, password) {
  await page.goto(`http://${config.dashboard_host}/pages.html#/login`);
  await page.reload();

  await page.waitForSelector("#activation-content-right input");
  await page.type('#activation-content-right input[type="text"]', username);
  await page.type('#activation-content-right input[type="password"]', password);
  await page.click('#activation-content-right input[type="button"]');

  let wait_count = 0;
  while ((new URL(page.url())).hash != "#/overview") {
    if (wait_count >= 10) {
      throw new Error("Login failed");
    }
    await sleep(500);
    wait_count++;
  }
}

export async function logout(page) {
  await page.goto(`http://${config.dashboard_host}/pages.html#/overview`);
  await page.reload();

  await page.waitForSelector(".logout_text");
  await page.click(".logout_text");

  let wait_count = 0;
  while ((new URL(page.url())).hash != "#/login") {
    if (wait_count >= 10) {
      throw new Error("Logout failed");
    }
    await sleep(500);
    wait_count++;
  }
}

export async function reconfig_lte_5g(page) {
  await page.goto(`http://${config.dashboard_host}/pages.html#/internet/lte_advanced`);
  await page.reload();

  await page.waitForSelector(".lte-advanced-content select > option");
  let current_value;
  let wait_count = 0;
  while (current_value !== "1" && current_value !== "2") {
    if (wait_count >= 10) {
      throw new Error("Invalid selected option");
    }
    await sleep(500);
    current_value = await page.$eval(".lte-advanced-content select", node => node.value);
    wait_count++;
  }
  await sleep(500);
  if (current_value === "1") {
    await page.select(".lte-advanced-content select", "2");
  } else if (current_value === "2") {
    await page.select(".lte-advanced-content select", "1");
  }
  await sleep(500);
  await page.select(".lte-advanced-content select", current_value);
  await page.click(".lte-advanced-content .button-apply");

  await sleep(10000);
}
