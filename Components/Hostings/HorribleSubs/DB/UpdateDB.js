const rp = require("request-promise-native");
const cherieo = require("cheerio");
const fs = require("fs");

const GetList = async () => {
  let list = [];

  const file = fs.readFileSync(__dirname + "/list.json", "utf8");

  let obj = JSON.parse(file);

  const body = await rp("http://horriblesubs.info/shows/");
  const $ = cherieo.load(body);

  let as = $(".shows-wrapper a");
  as.each((i, elem) => {
    let link = $(elem).attr("href");
    let name = $(elem)
      .attr("title")
      .trim();
    list.push({ name, link });
  });

  list.forEach(el => {
    let find = obj.find(anime => anime.name == el.name);
    if (!find) {
      obj.push(el);
      console.log(el);
    }
  });

  fs.writeFileSync(__dirname + "/list.json", JSON.stringify(obj, null, "\t"));
};

const base = "http://horriblesubs.info";

const main = async () => {
  await GetList();
  console.log("=== \n ===");
  const file = fs.readFileSync(__dirname + "/list.json", "utf8");

  let obj = JSON.parse(file);

  for (let i = 0; i < obj.length; i++) {
    await (async () => {
      const el = obj[i];
      if (el.id) return;
      let link = base + el.link;

      let body;
      try {
        body = await rp(link);
      } catch (e) {
        // obj[i].broken = true;
        // obj[i].id = 99999;
        console.log(el.name);
        return;
      }

      const $ = cherieo.load(body);

      let ScriptTag = $(".entry-content p script");

      if (ScriptTag.length > 1) ScriptTag = ScriptTag.eq(1);

      let text = ScriptTag.html();

      text = text.replace("var hs_showid = ", "");
      text = text.replace(" ;", "");

      obj[i].id = parseInt(text);
      fs.writeFileSync(
        __dirname + "/list.json",
        JSON.stringify(obj, null, "\t")
      );
    })();
  }

  await sort();
};

const sort = () => {
  const file = fs.readFileSync(__dirname + "/list.json", "utf8");
  let obj = JSON.parse(file);

  obj = obj.sort((a, b) => a.id - b.id);
  fs.writeFileSync(
    __dirname + "/HS-Sorted.json",
    JSON.stringify(obj, null, "\t")
  );
};
main();

// http://horriblesubs.info/lib/getshows.php?type=show&showid=
// http://horriblesubs.info/lib/getshows.php?type=batch&showid=
