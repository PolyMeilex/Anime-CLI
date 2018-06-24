const CLI = require("clui");
const Spinner = CLI.Spinner;
const rp = require("request-promise-native");
const cheerio = require("cheerio");

const Conf = require("../../../Settings/Settings");

const GetRawLinks = eps => {
  return new Promise((res, rej) => {
    console.log(
      "RawLink Parser... Timeout = " + Conf.Read("Link-Timeout") + "ms"
    );

    let downloaded = 0;
    let countdown = new Spinner("Starting...  ");
    countdown.start();

    for (let i = 0; i < eps.length; i++) {
      let func = () => {
        rp(eps[i].link).then(body => {
          const $ = cheerio.load(body);
          const rawLink = $("source").attr("src");
          eps[i].rawLink = rawLink;
          downloaded++;
          countdown.message("Parsed " + downloaded + " Raw Links...  ");

          if (downloaded == eps.length) {
            countdown.stop();
            res(eps);
          }
        });
      };
      setTimeout(func, i * Conf.Read("Link-Timeout"));
    }

    // return obj;
  });
};

module.exports = GetRawLinks;
