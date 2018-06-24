const Browser = require("zombie");
const path = require("path");
const fs = require("fs");

const CookieParser = async () => {
  const browser = new Browser({ silent: true, userAgent, debug: true });
  browser.waitDuration = "30s";

  try {
    await browser.visit("http://kissanime.ru/M/");
  } catch (e) {} // Zombie Thinks That KA Is Not Loaded Becouse Of Status Code

  console.log("AntiBot...");

  try {
    await browser.wait({ element: "div.content" });
  } catch (e) {}

  const content = await browser.document.querySelector("div.content");

  if (!content) return;

  const Cookie = browser.cookies;
  fs.writeFileSync(Root + "/main.cookie", Cookie);

  delete browser.cookies;
  browser.window.close();

  return Cookie;
};

module.exports = CookieParser;
