const puppeteer = require("puppeteer");
const express = require("express");
const router = express.Router();

const csMarketApi = async () => {
  // Import puppeteer

  // Launch the browser.
  const browser = await puppeteer.launch();

  // Create a page.
  const page = await browser.newPage();

  // Go to your site.
  await page.goto("https://csqaq.com/home");

  // 等待页面渲染完成
  await page.waitForSelector("div.ant-pro-card.card_radius_small___2XbtU");
  await page.waitForSelector(
    "div.ant-row.ant-row-space-between.ant-row-middle"
  );

  await new Promise((resolve) => setTimeout(resolve, 1000)); // 延时 3 秒
  // 抓取最终显示的文本
  const text = await page.evaluate(() => {
    const element = document.querySelector(
      "div.ant-pro-card.card_radius_small___2XbtU"
    );
    return element ? element.textContent.trim() : "数据未找到";
  });
  const text1 = await page.evaluate(() => {
    const element = document.querySelector(
      "div.ant-row.ant-row-space-between.ant-row-middle"
    );
    return element ? element.textContent.trim() : "数据未找到";
  });

  console.log("抓取到的最终数据:", text);
  console.log("抓取到的最终数据:", text1);
  await browser.close();
  return [text, text1];
};

router.get("/index/cs_market", async (req, res) => {
  try {
    const data = await csMarketApi();
    res.json({ data });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
