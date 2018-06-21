const Browser = require("zombie");

module.exports = async (Username, Password) => {
  const browser = new Browser({ silent: true, debug: true });

  try {
    await browser.visit("https://myanimelist.net/login.php");
  } catch (e) {}

  try {
    await browser.wait({ element: "[name=user_name]" });
  } catch (e) {}

  console.log(browser.location.href);

  browser.fill("[name=user_name]", Username);
  browser.fill("[name=password]", Password);

  browser.document.forms[1].submit();

  try {
    await browser.wait({ element: ".header-profile-button" });
  } catch (e) {}

  let fs = require("fs");
  fs.writeFileSync(Root + "/mal.session", browser.getCookie("MALSESSIONID"));
};
