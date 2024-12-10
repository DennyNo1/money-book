const axios = require("axios");
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

  // console.log("抓取到的最终数据:", text);
  // console.log("抓取到的最终数据:", text1);
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

router.get("/index/stock", async (req, res) => {
  try {
    const nasdaq100Index = await googleSearch("纳斯达克100");
    const sp500Index = await googleSearch("标普500");
    res.json({
      nasdaq100Index: nasdaq100Index,
      sp500Index: sp500Index,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

async function googleSearch(searchWord) {
  // 启动浏览器
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 设置用户代理，避免触发机器人检测
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );

  // 打开 Google
  await page.goto("https://www.google.com", { waitUntil: "domcontentloaded" });

  // 等待并找到搜索框
  const searchBoxSelector = "#APjFqb"; // 输入框的正确选择器
  await page.waitForSelector(searchBoxSelector, { timeout: 60000 });

  // 输入关键词并提交
  await page.type(searchBoxSelector, searchWord);
  await page.keyboard.press("Enter");

  // 等待搜索结果加载
  const resultsSelector = "#search";
  await page.waitForSelector(resultsSelector, { timeout: 60000 });

  // 提取纳斯达克指数
  try {
    const selector = "span.IsqQVc.NprOob.wT3VGc"; // 数值的 CSS 选择器
    await page.waitForSelector(selector, { timeout: 10000 });
    const index = await page.$eval(selector, (el) => el.textContent.trim());

    return index;
    // console.log(`当前纳斯达克指数: ${nasdaqIndex}`);
  } catch (error) {
    // console.error("未找到纳斯达克指数信息:", error);

    return error;
  } finally {
    await browser.close();
  }
}

module.exports = router;
