const CLI = require("clui");
const Spinner = CLI.Spinner;
const rp = require("request-promise-native");
const cheerio = require("cheerio");

const Conf = require("../../../Settings/Settings");

const GetRawLink = async ep => {
  let link = ep.Downloadlink;
  let countdown = new Spinner("Starting...  ");
  countdown.start();

  const body = await rp(link);
  let $ = cheerio.load(body);
  const rawLink = $(".dowload a").attr("href");

  countdown.message("Parsed " + 1 + " Raw Links...  ");

  countdown.stop();

  return rawLink;
};

module.exports = GetRawLink;
