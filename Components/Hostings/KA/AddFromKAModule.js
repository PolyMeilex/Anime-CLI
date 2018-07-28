const fs = require("fs");
const EpParser = require("./EpParser");

module.exports = async (name, Cookie) => {
    console.log(name);
  const obj = await EpParser(name, Cookie);
    
  if (!obj) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but this hosting blocked me, please try again")
    );
    return;
  }

  obj.host = "KA";

  // console.log(obj);

  fs.writeFileSync(
    cfgPath + "/Anime/" + obj.name + ".json",
    JSON.stringify(obj, null, "\t")
  );

  console.log(obj);

  return true;


}


