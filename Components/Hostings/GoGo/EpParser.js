const rp = require("request-promise-native");
const cheerio = require("cheerio");
const path = require("path");

const CLI = require("clui");
const Spinner = CLI.Spinner;

const Conf = require("../../Settings/Settings");

const getRawLinks = require("./LinkParsers/GetRawLinks");

const EpisodeParser = async AnimeObj => {
  let body = await rp(`${AnimeObj.BaseURL}/${AnimeObj.url}`);

  let $ = cheerio.load(body);

  let id = $("#movie_id").attr("value");
  // console.log(id);
  let options = {
    method: "GET",
    url: "https://www2.gogoanime.se/load-list-episode",
    qs: { ep_start: "0", ep_end: "20000", id: id, default_ep: "0" }
  };

  body = await rp(options);
  $ = cheerio.load(body);

  let list = [];

  $("a").each((i, elem) => {
    let link = $(elem)
      .attr("href")
      .trim();
    let name = $(elem)
      .find(".name")
      .text()
      .trim();
    list.push({ name, link });
  });

  list.reverse();

  console.log("Link Parser... Timeout = " + Conf.Read("Link-Timeout") + "ms");

  list = await getLinks(list, AnimeObj.BaseURL);
  list = await getRawLinks(list);

  const name = AnimeObj.text;
  const obj = { name, eps: list };

  return obj;
};

const getLinks = (list, BaseURL) => {
  return new Promise((res, rej) => {
    let downloaded = 0;
    let countdown = new Spinner("Starting...  ");

    countdown.start();

    for (let i = 0; i < list.length; i++) {
      let func = () => {
        rp(`${BaseURL}${list[i].link}`).then(body => {
          let $ = cheerio.load(body);
          list[i].Downloadlink = $(".download-anime a")
            .attr("href")
            .trim();
          // console.log(links);
          downloaded++;
          countdown.message("Parsed " + downloaded + " Links...  ");

          if (downloaded == list.length) {
            countdown.stop();
            res(list);
          }
        });
      };
      setTimeout(func, i * Conf.Read("Link-Timeout"));
    }
  });
};

const ConnectAll = async AnimeObj => {
  let obj = await EpisodeParser(AnimeObj);

  if (!obj) return;
  // eps = await require("../LinkParsers/GetRawLinks")(obj.eps);
  return obj;
};

module.exports = ConnectAll;
