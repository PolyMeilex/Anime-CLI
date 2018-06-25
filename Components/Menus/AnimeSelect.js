//
// Anime Select
//

const fs = require("fs");
const path = require("path");

module.exports = async () => {
  let dir = fs.readdirSync(cfgPath + "/Anime");
  dir = dir.filter(name => path.extname(name) == ".json");

  dir.unshift(new inquirerMenager.Separator());

  const answares = await inquirerMenager.prompt([
    {
      type: "list",
      name: "anime",
      message: "Select Anime To Play",
      pageSize: 15,
      choices: dir,
      default: 0
    }
  ]);

  const file = fs.readFileSync(cfgPath + "/Anime/" + answares.anime);
  const json = JSON.parse(file);

  return json;
};
