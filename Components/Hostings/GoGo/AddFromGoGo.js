//
//  ADD NEW ANIME
//

const BaseURL = "https://www2.gogoanime.se";

const AnimeSearch = require("./AnimeSearch");
const EpParser = require("./EpParser");

const fs = require("fs");
const chalk = require("chalk");

module.exports = async () => {
  const find = await AnimeSearch();
  find.BaseURL = BaseURL;

  const obj = await EpParser(find);

  console.log(obj);
  if (!obj) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but something went wrong, please try again")
    );
    return;
  }

  obj.host = "GoGo";

  fs.writeFileSync(
    Root + "/Anime/" + obj.name + ".json",
    JSON.stringify(obj, null, "\t")
  );
  inquirerMenager.OpenMainMenu(
    chalk.green("Done! Direct Links Were Saved To Storage")
  );
};
