const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

let promptList = [];

module.exports.list = promptList;

module.exports.closeAll = () => {
  promptList.forEach(p => {
    p.ui.close();
  });
  process.removeAllListeners();

  promptList = [];
};

module.exports.OpenMainMenu = mes => {
  module.exports.closeAll();
  OpenMainMenu(mes);
};

module.exports.prompt = a => {
  const prompt = inquirer.prompt(a);
  promptList.push(prompt);
  return prompt;
};

module.exports.Separator = inquirer.Separator;
