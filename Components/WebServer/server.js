const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

let cookie;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const fs = require("fs");
const path = require("path");

app.use(express.static(__dirname + "/Frontend/dist/spa-mat"));

// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/FrontEndApp/index.html");
// });

app.get("/getcookie", async (req, res) => {
  const cookieGet = await require("../Hostings/KA/CookeParser")();
  cookie = cookieGet + " ";

  res.send(cookieGet + " ");
});

app.get("/find", async (req, res) => {
  let hosting = req.param("hosting", "KA");
  let keyword = req.param("keyword", "");

  let re = await require("../Hostings/KA/AnimeSearchModule")(keyword, cookie);

  res.json(re);
});

app.get("/add", async (req, res) => {
  const name = req.param("name", "");

  const addfromKa = require("../Hostings/KA/AddFromKAModule");

  await addfromKa(name, cookie);

  res.json(true);
});

app.get("/remove", async (req, res) => {
  const FileName = req.param("name", "");

  fs.unlinkSync(cfgPath + "/Anime/" + FileName);

  res.json(true);
});

app.get("/getfiles", async (req, res) => {
  let dir = fs.readdirSync(cfgPath + "/Anime");
  dir = dir.filter(name => path.extname(name) == ".json");

  dir = dir.map(anime => {
    let obj = JSON.parse(fs.readFileSync(cfgPath + "/Anime/" + anime, "utf8"));
    obj.filename = anime;
    return obj;
  });

  res.json(dir);
});

//
// D M
//

let DownloadMenager = null;

app.post("/startDM", async (req, res) => {
  const obj = req.body;
  const force = req.param("force", 0);

  let output = null;

  if (DownloadMenager == null || force == 1) {
    DownloadMenager = await require("../DownloadMenager/WebWrapper")(obj);
    output = DownloadMenager;
  } else {
    output = {
      e:
        "Server detected another download menager in background, there is no function to chcek if all downloads in this DM are done. Do you want to overwrite old DM ? "
    };
  }

  res.json(output);
});

app.get("/getdm", async (req, res) => {
  let output = null;

  if (DownloadMenager == null) output = {};
  else output = DownloadMenager;

  res.json(output);
});

const start = () => {
  app.listen(3131, () => console.log("App Running on port 3131!"));
};

module.exports = start;
