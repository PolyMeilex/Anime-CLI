const CLI = require("clui");
const Spinner = CLI.Spinner;
const rp = require("request-promise-native");
const cheerio = require("cheerio");

const Conf = require("../../../Settings/Settings");

const getRawLinks = list => {
  return new Promise((res, rej) => {
    let downloaded = 0;
    let countdown = new Spinner("Starting...  ");

    countdown.start();

    for (let i = 0; i < list.length; i++) {
      let func = () => {
        rp(list[i].Downloadlink).then(body => {
          let $ = cheerio.load(body);
          list[i].rawLink = $(".dowload a").attr("href");
          // console.log(links);
          downloaded++;
          countdown.message("Parsed " + downloaded + " Raw Links...  ");

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

module.exports = getRawLinks;
