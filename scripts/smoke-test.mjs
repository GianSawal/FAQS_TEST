import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(siteUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: "desktop-preview.png", fullPage: true });
  const title = await page.locator("h1").innerText();
  if (title.replace(/\s+/g, " ").trim() !== "UPDATED GUIDELINES ON ATTENDANCE MONITORING AND LEAVE ADMINISTRATION") throw new Error("Incorrect page title");
  if (await page.locator("details.faq-item").count() !== 15) throw new Error("Expected 15 FAQs");
  const search = page.getByRole("searchbox", { name: "Search this guide" });
  for (const [term, minimum] of [["DTR", 3], ["biometric", 1], ["FWA", 2], ["overtime", 1], ["OB", 4]]) {
    await search.fill(term);
    if (await page.locator("details.faq-item").count() < minimum) throw new Error(`Search for ${term} returned too few answers`);
  }
  await search.fill("leave");
  if (!(await page.getByText("Additional leave administration questions will appear here after HR verification.").isVisible())) throw new Error("Leave placeholder missing");
  await search.fill("");
  const first = page.locator("#work-schedule-1");
  await first.locator("summary").click();
  if (!(await first.getByText("You must work 40 hours per week", { exact: false }).isVisible())) throw new Error("Answer did not open");
  await page.waitForTimeout(350);
  await first.screenshot({ path: "answer-preview.png" });
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  if (await first.evaluate((element) => element.open)) throw new Error("Keyboard did not close answer");
  await page.getByRole("button", { name: "Expand all" }).click();
  if (await page.locator("details.faq-item[open]").count() !== 15) throw new Error("Expand all failed");
  await page.getByRole("button", { name: "Collapse all" }).click();
  if (await page.locator("details.faq-item[open]").count()) throw new Error("Collapse all failed");
  await page.getByRole("button", { name: "Daily Time Record (DTR)", exact: false }).first().click();
  if (await page.locator("details.faq-item").count() !== 3) throw new Error("DTR filter failed");
  await page.locator("#daily-time-record-1 summary").click();
  await page.getByRole("button", { name: "Next question" }).click();
  if (!(await page.locator("#daily-time-record-2").evaluate((element) => element.open))) throw new Error("Next question failed");
  await page.getByRole("button", { name: "Clear filters" }).click();
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(100);
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    if (dimensions.scroll > dimensions.client) throw new Error(`Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "mobile-preview.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu" }).click();
  if (!(await page.getByRole("navigation", { name: "Mobile navigation" }).isVisible())) throw new Error("Mobile menu did not open");
  await page.getByRole("button", { name: "Close menu" }).click();
  if (await page.getByRole("navigation", { name: "Mobile navigation" }).count()) throw new Error("Mobile menu did not close");
  const plain = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  await plain.goto(siteUrl, { waitUntil: "domcontentloaded" });
  if (!(await plain.locator("h1").isVisible())) throw new Error("No-JavaScript hero is hidden");
  if (!(await plain.locator(".category-card").first().isVisible())) throw new Error("No-JavaScript topics are hidden");
  if (await plain.locator("details.faq-item").count() !== 15) throw new Error("No-JavaScript page lost questions");
  await plain.locator("#work-schedule-1 summary").click();
  if (!(await plain.locator("#work-schedule-1 .faq-answer").isVisible())) throw new Error("No-JavaScript answer did not open");
  console.log("Smoke test passed: search, answer reveal, keyboard, sequential browsing, no-JavaScript reading, and responsive widths.");
} finally {
  await browser.close();
}


