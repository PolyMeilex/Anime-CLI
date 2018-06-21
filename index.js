#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const inquirer = require("inquirer");

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const Conf = require("./Components/Settings/Settings");
Conf.Int();

//
// GLOBALS
//
global.userAgent =
  "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Mobile Safari/537.36";

global.Root = path.resolve(__dirname);
global.DownloadPath = Root;

global.chalk = require("chalk");
global.OpenMainMenu = require("./Components/Menus/MainMenu");
global.clear = require("clear");
global.CliLogo = fs.readFileSync(Root + "/colLogo.txt", "utf8");

global.inquirerMenager = require("./Components/Utils/inquirerMenager");

//
// Keyboard Listener
//

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name == "c") process.exit(1);
  else if (key.ctrl && key.name == "b") {
    inquirerMenager.OpenMainMenu("");
  }
});

//
// Dir Check
//

try {
  fs.mkdirSync(Root + "/Anime");
} catch (e) {}

try {
  fs.mkdirSync(DownloadPath + "/Downloads");
} catch (e) {}

//
// Init
//

inquirerMenager.OpenMainMenu("Ctrl + B -> Back To Main Menu");
