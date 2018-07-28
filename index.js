#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const inquirer = require("inquirer");

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const mkdirp = require("mkdirp");

const applicationConfigPath = require("application-config-path");

//
// GLOBALS
//
global.userAgent =
  "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Mobile Safari/537.36";

global.cfgPath = applicationConfigPath("anime-cli");

global.Root = path.resolve(__dirname);
global.DownloadPath = cfgPath;

//
// Dir Check
//

try {
  mkdirp.sync(cfgPath);
} catch (e) {}

try {
  mkdirp.sync(cfgPath + "/Anime");
} catch (e) {}

try {
  mkdirp.sync(cfgPath + "/Downloads");
} catch (e) {}

const Conf = require("./Components/Settings/Settings");
Conf.Int();

global.chalk = require("chalk");
global.OpenMainMenu = require("./Components/Menus/MainMenu");
global.clear = require("clear");
global.CliLogo = fs.readFileSync(Root + "/colLogo.txt", "utf8");

global.inquirerMenager = require("./Components/Utils/inquirerMenager");

//
// Version Check
//
const rp = require("request-promise-native");

let ui = new inquirer.ui.BottomBar();

const start = async () => {
  let latest = null;
  let current = null;

  try {
    const body = await rp("https://registry.npmjs.org/anime-cli/latest/");
    let json = JSON.parse(body);
    latest = json.version;

    let file = fs.readFileSync(Root + "/package.json", "utf8");
    file = JSON.parse(file);
    current = file.version;
  } catch (e) {}

  if (latest != current) {
    ui.updateBottomBar(
      chalk.red("This version is outdated, run 'npm i -g anime-cli' ")
    );
  }
};

// start();
// const mode = "web-ui";
const mode = "cli";

if (mode === "cli") {
  start();
  inquirerMenager.OpenMainMenu(" ");
} else if (mode === "web-ui") {
  console.log(CliLogo);
  require("./Components/WebServer/server")();
}

// inquirerMenager.OpenMainMenu(" ");

// require("./Components/Menus/AddAnime")();
