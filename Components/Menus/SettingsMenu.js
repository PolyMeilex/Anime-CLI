let CLI = require("clui"),
  clc = require("cli-color");

let Line = CLI.Line,
  LineBuffer = CLI.LineBuffer;

const Conf = require("../Settings/Settings");

module.exports = async () => {
  clear();
  new Line().column("Settings", 20, [clc.green]).output();

  new Line().output();

  new Line()
    .column("Name", 20, [clc.cyan])
    .column("Default", 20, [clc.cyan])
    .column("Current Value", 20, [clc.cyan])
    .output();

  new Line()
    .column("Link-Timeout", 20, [clc.white])
    .column("50", 20, [clc.white])
    .column(`${Conf.Read("Link-Timeout")}`, 20, [clc.white])
    .output();
  new Line()
    .column("Max-Downloads", 20, [clc.white])
    .column("1", 20, [clc.white])
    .column(`${Conf.Read("Max-Downloads")}`, 20, [clc.white])
    .output();

  new Line().output();

  let command = await inquirerMenager.prompt([
    {
      type: "input",
      name: "c",
      message: ">",
      default: "Example-Setting = Example-Value",
      validate: input => {
        if (!input) return "No Input )-: ";

        input = input.replace(/\s+/g, "");
        let split = input.split("=");

        if (split.length == 2) {
          let setting = split[0];
          let value = parseInt(split[1]);

          if (setting.length < 1) return "Wrong Setting Argument";
          if (isNaN(value)) return "Wrong Value Argument";

          return true;
        }

        return "Got " + split.length + " arguments";
      }
    }
  ]);

  command = command.c;
  command = command.replace(/\s+/g, "");
  let split = command.split("=");

  let setting = split[0];
  let value = parseInt(split[1]);

  let testRead = Conf.Read(setting);

  console.log(setting);
  console.log(value);

  if (!testRead) {
    let q = await inquirerMenager.prompt([
      {
        type: "confirm",
        name: "q",
        message: "This Setting Do Not Exsist! Do you realy want to add it ?",
        default: false
      }
    ]);
    if (q) Conf.Write(setting, value);
  } else Conf.Write(setting, value);
};
