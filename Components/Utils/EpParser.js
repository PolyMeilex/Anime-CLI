const rp = require("request-promise-native");
const cheerio = require("cheerio");
const path = require("path");

const CLI = require("clui");
const Spinner = CLI.Spinner;

const Conf = require("../Settings/Settings");

const EpisodeParser = async (AnimeName, Cookie) => {
  if (!Cookie) return;
  Cookie = `${Cookie}`;

  var options = {
    method: "GET",
    url: `http://kissanime.ru/M/Anime/${AnimeName}`,
    headers: {
      "User-Agent": userAgent,
      Cookie
    }
  };

  const body = await rp(options);
  const $ = cheerio.load(body);

  let list = [];

  $(".episode").each((i, elem) => {
    let kaId = $(elem).attr("data-value");
    let name = $(elem).text();
    list.push({ name, kaId });
  });

  list.reverse();

  console.log("Link Parser... Timeout = " + Conf.Read("Link-Timeout") + "ms");
  list = await getLinks(list, Cookie, userAgent);

  const name = $(".post-content h2 a").text();
  const obj = { name, eps: list };

  return obj;
};

const getLinks = (grouped, Cookie, userAgent) => {
  return new Promise((res, rej) => {
    let downloaded = 0;
    let countdown = new Spinner("Starting...  ");

    countdown.start();

    for (let i = 0; i < grouped.length; i++) {
      let func = () => {
        const options = {
          method: "POST",
          url: "http://kissanime.ru/Mobile/GetEpisode",
          headers: {
            Referer: "http://kissanime.ru/M/",
            "User-Agent": userAgent,
            Cookie: Cookie,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          form: { eID: grouped[i].kaId }
        };

        // console.log();

        rp(options).then(body => {
          // links.push();
          grouped[i].link = body.split("|||")[0];
          // console.log(links);
          downloaded++;
          countdown.message("Parsed " + downloaded + " Links...  ");

          if (downloaded == grouped.length) {
            countdown.stop();
            res(grouped);
          }
        });
      };
      setTimeout(func, i * Conf.Read("Link-Timeout"));
    }
  });
};

const ConnectAll = async (AnimeName, Cookie) => {
  let obj = await EpisodeParser(AnimeName, Cookie);

  if (!obj) return;
  // eps = await require("../LinkParsers/GetRawLinks")(obj.eps);
  return obj;
};

module.exports = ConnectAll;
