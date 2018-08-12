//
//  AnimeSearch
//

// const CookeParser = require("../Utils/CookeParser");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async Cookie => {
  // let Cookie = await CookeParser();

  if (!Cookie) {
    inquirerMenager.OpenMainMenu(
      chalk.red("Sorry but this hosting blocked me, please try again")
    );
    return;
  }
  let list = [];
  let output = [];


  const answer = await inquirerMenager.prompt([
    {
      type: "autocomplete",
      name: "anime",
      message: "Select anime:",
      pageSize: 15,
      source: async (answers, keyword) => {
        const res = await require("./AnimeSearchModule")(keyword, Cookie);
        list = res;
        output = res.map( n => n.text );
        return output;
      }
    }
  ]);

  let id = output.indexOf(answer.anime);

  // console.log(list[id]);
  return list[id];
};
