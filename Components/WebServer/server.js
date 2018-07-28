const express = require("express");
let cookie;

const app = express();

const fs = require("fs");
const path = require("path");

app.get("/getcookie", async (req, res) => {
  const cookieGet = await require("../Hostings/KA/CookeParser")();

  cookie = cookieGet + " ";

  res.set("Access-Control-Allow-Origin", "*");
  res.send(cookieGet + " ");
  // setTimeout(() => {
  //   res.send(" ");
  // }, 5000);
});

app.get("/add", async (req, res) => {
  const name = req.param("name", "");

  const addfromKa = require("../Hostings/KA/AddFromKAModule");

  await addfromKa(name,cookie);

  res.set("Access-Control-Allow-Origin", "*");
  res.json(true);
})

app.get("/remove", async (req, res) => {
  const FileName = req.param("name", "");

  fs.unlinkSync(cfgPath + "/Anime/" + FileName);

  res.set("Access-Control-Allow-Origin", "*");
  res.json(true);
})

app.get("/find", async (req, res) => {
  let hosting = req.param("hosting", "KA");
  let keyword = req.param("keyword", "");

  let re = await require("../Hostings/KA/AnimeSearchModule")(keyword, cookie);

  res.set("Access-Control-Allow-Origin", "*");
  res.json(re);
});

app.get("/getfiles", async (req, res) => {
  let dir = fs.readdirSync(cfgPath + "/Anime");
  dir = dir.filter(name => path.extname(name) == ".json");

  dir = dir.map(anime => {
    let obj = JSON.parse(fs.readFileSync(cfgPath + "/Anime/" + anime, "utf8"))
    obj.filename = anime;
    return obj;
  });

  res.set("Access-Control-Allow-Origin", "*");
  res.json(dir);
});

const start = () => {
  app.listen(3131, () => console.log("App Running on port 3131!"));
};

module.exports = start;
