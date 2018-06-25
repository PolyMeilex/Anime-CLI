//
//  ADD NEW ANIME
//

const AnimeSearch = require("./AnimeSearch");
const EpParser = require("./EpParser");

const CookieParser = require("./CookeParser");

const fs = require("fs");
const chalk = require("chalk");

module.exports = async () => {
  const Cookie = await CookieParser();
  if (!Cookie) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but this hosting blocked me, please try again")
    );
    return;
  }
  const find = await AnimeSearch(Cookie);

  let name = find.url.replace("http://kissanime.ru/Anime/", "");
  console.log(name);
  console.log("");

  const obj = await EpParser(name, Cookie);

  if (!obj) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but this hosting blocked me, please try again")
    );
    return;
  }

  obj.host = "KA";

  fs.writeFileSync(
    cfgPath + "/Anime/" + obj.name + ".json",
    JSON.stringify(obj, null, "\t")
  );

  inquirerMenager.OpenMainMenu(
    chalk.green("Done! Direct Links Were Saved To Storage")
  );
};
