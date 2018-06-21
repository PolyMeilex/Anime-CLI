//
//  ADD NEW ANIME
//

const AnimeSearch = require("./AnimeSearch");
const EpParser = require("../Utils/EpParser");

const CookieParser = require("../Utils/CookeParser");

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

  fs.writeFileSync(Root + "/Anime/" + obj.name + ".json", JSON.stringify(obj));

  inquirerMenager.OpenMainMenu(
    chalk.green("Done! Direct Links Were Saved To Storage")
  );
};
