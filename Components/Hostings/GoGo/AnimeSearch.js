//
//  AnimeSearch
//

const rp = require("request-promise-native");
const cheerio = require("cheerio");

const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async () => {
  let list = [];
  let output = [];

  const answer = await inquirerMenager.prompt([
    {
      type: "autocomplete",
      name: "anime",
      message: "Select anime:",
      pageSize: 15,
      source: async (answers, keyword) => {
        if (!keyword) keyword = " ";

        var options = {
          method: "GET",
          url: "https://www2.gogoanime.se/search.html",
          qs: { keyword: keyword, id: "-1" },
          headers: {
            Referer: "https://www2.gogoanime.se/",
            "X-Requested-With": "XMLHttpRequest"
          }
        };

        const body = await rp(options);
        // console.log(body);
        const $ = cheerio.load(body);

        list = [];

        $("a").each((i, elem) => {
          let url = $(elem).attr("href");
          let text = $(elem)
            .text()
            .trim();
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
