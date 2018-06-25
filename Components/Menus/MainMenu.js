//
// MAIN MENU
//

const fs = require("fs");

// Menus
const AddNewAnime = require("./AddAnime");
const AnimePlay = require("./AnimePlay");
const AnimeDownload = require("./AnimeDownload");
const SettingsMenu = require("./SettingsMenu");
//

module.exports = async message => {
  clear();
  console.log("");
  console.log(CliLogo);
  console.log(message);
  console.log("");

  const MainQ = await inquirerMenager.prompt([
    {
      type: "list",
      name: "action",
      message: "Hi! What do you want to do?",
      pageSize: 15,
      choices: [
        new inquirerMenager.Separator(),
        "Add New Anime",
        "Watch Anime",
        "Download Anime",
        new inquirerMenager.Separator(),
        "Open Downloads Folder",
        "Open Anime Folder",
        "Open Settings",
        new inquirerMenager.Separator()
      ],
      default: 0
    }
  ]);

  const action = MainQ.action;

  if (action === "Add New Anime") AddNewAnime();
  else if (action === "Watch Anime") AnimePlay();
  else if (action === "Download Anime") AnimeDownload();
  else if (action === "Open Downloads Folder")
    require("opn")(DownloadPath + "/Downloads");
  else if (action === "Open Anime Folder") require("opn")(cfgPath + "/Anime");
  else if (action === "Open Settings") SettingsMenu();
};
