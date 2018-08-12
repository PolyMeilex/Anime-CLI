//
// Anime Download
//

const AnimeSelect = require("./AnimeSelect");
const fs = require("fs");

// const request = require("request");
// const progress = require("request-progress");

// const CLI = require("clui"),
//   clc = require("cli-color");

// let Line = CLI.Line,
//   LineBuffer = CLI.LineBuffer;

// let Progress = CLI.Progress;

const Conf = require("../Settings/Settings");

const path = require("path");

module.exports = async () => {
  let obj = await AnimeSelect();
  const AnimeName = obj.name;

  clear();
  console.log("");
  console.log(CliLogo);
  console.log(path.resolve("./"));
  console.log("");

  const ans = await inquirerMenager.prompt([
    {
      type: "list",
      name: "location",
      message: "Select Download Location",
      choices: [
        new inquirerMenager.Separator(),
        "Anime CLI Directory",
        "Current Directory",
        new inquirerMenager.Separator()
      ],
      default: 0
    }
  ]);

  if (ans.location == "Current Directory")
    global.DownloadPath = path.resolve("./");

  const mkdirp = require("mkdirp");
  try {
    mkdirp.sync(DownloadPath + "/Downloads");
  } catch (e) {}

  try {
    mkdirp.sync(DownloadPath + "/Downloads/" + AnimeName);
  } catch (e) {}

  clear();

  require("../Utils/EpDisplay")(obj);

  let choice = obj.eps.map((ep, i) => `${ep.name}`);

  const answer = await inquirerMenager.prompt([
    {
      type: "input",
      name: "ep",
      message: "Select Ep To Download",
      validate: input => {
        input = input.split("-");

        if (input.length == 2) {
          let start = parseInt(input[0]);
          let end = parseInt(input[1]);

          if (start == null) return "Error";
          if (end == null) return "Error";

          if (isNaN(start)) return "Error";
          if (isNaN(end)) return "Error";

          return true;
        }

        return "Error ";
      },
      default: `0-${obj.eps.length - 1}`
    }
  ]);

  let range = () => {
    let r = answer.ep;
    if (!r) r = "";

    r = answer.ep.split("-");

    if (r.length == 2) {
      let start = parseInt(r[0]);
      let end = parseInt(r[1]);

      let out = [];
      for (let i = start; i < end + 1; i++) {
        const ep = obj.eps[i];
        if (ep) out.push(ep);
        else return { e: "Out of range )-:", data: null };
      }

      return { e: null, data: out };
    } else return { e: "Error", data: null };
  };
  let o = range();

  let list = [];

  if (!o.e) {
    list = o.data;
  }

  clear();

  if (obj.host == null) {
    const GetRawLinks = require("../Hostings/KA/LinkParsers/GetRawLinks");
    list = await GetRawLinks(list);
  } else {
    const GetRawLinks = require("../Hostings/" +
      obj.host +
      "/LinkParsers/GetRawLinks");
    list = await GetRawLinks(list);
  }

  //
  // Overwrite Check
  //
  let Allowed = true;

  try {
    const dir = fs.readdirSync(DownloadPath + "/Downloads/" + AnimeName);
    const over = dir.find(file => {
      for (let i = 0; i < list.length; i++) {
        const ep = list[i];
        if (ep.name == path.basename(file, path.extname(file))) return true;
      }

      return false;
    });

    if (!over) {
      Allowed = true;
    } else {
      const ans = await inquirerMenager.prompt([
        {
          type: "confirm",
          name: "c",
          message: `${over} Will Be Overwriten`,
          default: true
        }
      ]);

      if (ans.c) Allowed = true;
      else if (!ans.c) Allowed = false;
    }
  } catch (e) {}

  const DownloadMenager = require("../DownloadMenager/mainDmModule")
    .DownloadMenager;
  const Dobject = require("../DownloadMenager/mainDmModule").Dobject;

  list = list.map(ep => new Dobject(ep));


  if (Allowed) {
    let dm = new DownloadMenager(AnimeName,list);
    dm.draw();

    for (let i = 0; i < Conf.Read("Max-Downloads"); i++) dm.InitDownload(i);
    
  }
};
