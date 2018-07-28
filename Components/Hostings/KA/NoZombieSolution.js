const rp = require("request-promise-native");
const cheerio = require("cheerio");

let options = {
  method: "GET",
  url: "http://kissanime.ru/M",
  headers: {
    "User-Agent": userAgent
  }
};

module.exports = async () => {
  let body;
  try {
    body = await rp(options);
  } catch (e) {
    body = e.response.body;
  }

  const $ = cheerio.load(body);

  let Chalange = $("script").html();
  let jschl_vc = $("[name=jschl_vc]").attr("value");
  let pass = $("[name=pass]").attr("value");
  let jschl_answer = null;

  let obj = { jschl_vc, pass, jschl_answer };

  let lines = Chalange.split("\n");

  let code = [
    "(()=>{",
    lines[8],
    "t = 'kissanime.ru'",
    "a = {}",
    lines[15],
    "return a",
    "})()"
  ];
  code = code.join("\n");

  obj.jschl_answer = eval(code).value;

  const url = `http://kissanime.ru/cdn-cgi/l/chk_jschl?jschl_vc=${
    obj.jschl_vc
  }&pass=${obj.pass}&jschl_answer=${obj.jschl_answer}`;

  let requestModule = require("request");

  let jar = requestModule.jar();
  request = requestModule.defaults({ jar: jar });

  let CookieOptions = {
    method: "GET",
    url: url,
    headers: {
      "User-Agent": userAgent,
      cookie: ""
    }
  };

  let b = await (() =>
    new Promise((res, rej) => {
      request(CookieOptions, function(error, response, body) {
        if (error) throw new Error(error);
        res(body);
      });
    }))();

  return b;
};
