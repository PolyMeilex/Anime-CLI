const CLI = require("clui");
const Spinner = CLI.Spinner;
const rp = require("request-promise-native");
const cheerio = require("cheerio");

const Conf = require("../Settings/Settings");

const GetRawLink = async link => {
  console.log("RawLink Parser...");

  let countdown = new Spinner("Starting...  ");
  countdown.start();

  const body = await rp(link);

  const $ = cheerio.load(body);
  const rawLink = $("source").attr("src");

  countdown.message("Parsed " + 1 + " Raw Links...  ");

  countdown.stop();
  return rawLink;
};

module.exports = GetRawLink;
