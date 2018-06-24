//
//  ADD NEW ANIME
//

const AddFromKA = require("../Hostings/KA/AddFromKA");
const AddFromGoGo = require("../Hostings/GoGo/AddFromGoGo");

module.exports = async () => {
  const ans = await inquirerMenager.prompt([
    {
      type: "list",
      name: "host",
      message: "Select Hosting",
      choices: [
        new inquirerMenager.Separator(),
        "AnimeGoGo",
        "KissAnime",
        new inquirerMenager.Separator()
      ],
      default: 0
    }
  ]);

  if (ans.host == "AnimeGoGo") AddFromGoGo();
  else if (ans.host == "KissAnime") AddFromKA();
};
