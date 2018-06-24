//
// Anime Download
//

const AnimeSelect = require("./AnimeSelect");
const fs = require("fs");

const request = require("request");
const progress = require("request-progress");

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

  try {
    fs.mkdirSync(DownloadPath + "/Downloads");
  } catch (e) {}

  try {
    fs.mkdirSync(DownloadPath + "/Downloads/" + AnimeName);
  } catch (e) {}

  clear();

  const CLI = require("clui"),
    clc = require("cli-color");

  let Line = CLI.Line,
    LineBuffer = CLI.LineBuffer;

  let Progress = CLI.Progress;

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

  function drawMod() {
    let outputBuffer = new LineBuffer({
      x: 0,
      y: 0,
      width: "console",
      height: "console"
    });

    new Line(outputBuffer).fill().store();

    new Line(outputBuffer)
      .column(obj.name, 50, [clc.green])
      .fill()
      .store();

    new Line(outputBuffer).fill().store();

    new Line(outputBuffer)
      .column("Name", 20, [clc.cyan])
      .column("Percent", 20, [clc.cyan])
      .column("Progress", 50, [clc.cyan])
      .fill()
      .store();

    this.Dobjects.forEach(d => {
      if (d.done) return;
      let thisProgressBar = new Progress(20);

      let state;
      if (d.state) state = d.state;
      else state = { percent: 0 };

      new Line(outputBuffer)
        .column(d.name, 20)
        .column(`${Math.round(state.percent * 100 * 1000) / 1000}`, 20)
        .column(thisProgressBar.update(state.percent * 100, 100), 50)
        .fill()
        .store();
    });
    outputBuffer.output();
  }

  class DownloadMenager {
    constructor(Dobjects) {
      this.Dobjects = Dobjects;
      this.LastDownloading = 0;
    }

    draw() {
      let binded = drawMod.bind(this);
      binded();
    }

    InitDownload(i = 0) {
      const d = this.Dobjects[i];
      if (!d) return;
      if (d.PlaceHolder) return;
      d.StartDownload();
      d.progress.on("progress", state => {
        d.state = state;
        this.draw();
      });
      d.progress.on("end", () => {
        d.state.percent = 1;
        d.done = true;

        // this.Dobjects.splice(i, 1);
        this.Dobjects.push({
          PlaceHolder: true,
          name: d.name,
          state: d.state
        });

        this.InitDownload(this.LastDownloading + 1);
      });

      d.progress.pipe(
        fs.createWriteStream(
          DownloadPath + "/Downloads/" + AnimeName + "/" + d.name + ".mp4"
        )
      );
      this.LastDownloading = i;
    }
  }

  class Dobject {
    constructor(ep) {
      this.name = ep.name;
      this.rawLink = ep.rawLink;
      this.progress = null;
      this.state = null;
      this.done = false;
      this.moved = false;
    }
    StartDownload() {
      this.progress = progress(request(this.rawLink));
    }
  }

  if (obj.host == "KA" || obj.host == null) {
    const GetRawLinks = require("../LinkParsers/GetRawLinks");
    list = await GetRawLinks(list);
  }

  list = list.map(ep => new Dobject(ep));

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

  if (Allowed) {
    let dm = new DownloadMenager(list);
    dm.draw();

    for (let i = 0; i < Conf.Read("Max-Downloads"); i++) dm.InitDownload(i);
  }
};
