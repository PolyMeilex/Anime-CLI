//
//  AnimeSearch
//

const rp = require("request-promise-native");
const cheerio = require("cheerio");
// const CookeParser = require("../Utils/CookeParser");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async Cookie => {
  // let Cookie = await CookeParser();

  if (!Cookie) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but this hosting blocked me, please try again")
    );
    return;
  }
  let list = [];
  let output = [];

  const answer = await inquirerMenager.prompt([
    {
      type: "autocomplete",
      name: "anime",
      message: "Select anime:",
      pageSize: 15,
      source: async (answers, keyword) => {
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
        // console.log(body);
        const $ = cheerio.load(body);

        list = [];

        $("a").each((i, elem) => {
          let url = $(elem).attr("href");
          let text = $(elem).text();
          list.push({ text, url });
        });

        output = list.map(e => e.text);

        return output;
      }
    }
  ]);

  let id = output.indexOf(answer.anime);
  return list[id];
};
