const rp = require("request-promise-native");
const cheerio = require("cheerio");

module.exports = async (keyword, Cookie) => {
  if (!keyword) keyword = "";

  var options = {
    method: "POST",
    url: "http://kissanime.ru/Search/SearchSuggestx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Mobile Safari/537.36",
      Cookie: `${Cookie}`
    },
    form: { type: "Anime", keyword: keyword }
  };

  const body = await rp(options);
  //   console.log(body);
  const $ = cheerio.load(body);

  let list = [];

  $("a").each((i, elem) => {
    let url = $(elem).attr("href");
    let text = $(elem).text();
    list.push({ text, url });
  });


  return list;
};
