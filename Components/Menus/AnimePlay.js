//
//  Anime Play
//

const AnimeSelect = require("./AnimeSelect");
const fs = require("fs");
const opn = require("opn");

module.exports = async () => {
  let obj = await AnimeSelect();

  clear();

  //   require("../Utils/EpDisplay")(obj);
  console.log(CliLogo);

  let choice = obj.eps.map(
    (ep, i) => (i == 0 ? chalk.green(ep.name) : ep.name)
  );

  const answer = await inquirerMenager.prompt([
    {
      type: "autocomplete",
      name: "ep",
      message: "Select Ep To Play",
      pageSize: 15,
      source: (answers, input) =>
        Promise.resolve().then(() => {
          if (!input) input = "";
          let filter = input.toUpperCase();
          let output = choice.filter(
            ep => ep.toUpperCase().indexOf(filter) > -1
          );

          return output;
        })
    }
  ]);

  let i = choice.indexOf(answer.ep);

  if (obj.host == "KA" || obj.host == null) {
    let RawLink = await require("../Hostings/KA/LinkParsers/GetRawLink")(
      obj.eps[i].link
    );
    obj.eps[i].rawLink = RawLink;
  } else {
    let RawLink = await require("../Hostings/" +
      obj.host +
      "/LinkParsers/GetRawLink")(obj.eps[i]);
    obj.eps[i].rawLink = RawLink;
  }

  opn(obj.eps[i].rawLink);

  inquirerMenager.OpenMainMenu(chalk.green(obj.eps[i].name + " Opened"));
};
