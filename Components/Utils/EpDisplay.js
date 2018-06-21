const CLI = require("clui"),
  clc = require("cli-color");

const Line = CLI.Line;

module.exports = obj => {
  new Line().column(obj.name, obj.name.length, [clc.green]).output();

  new Line()
    .column("Nr", 20, [clc.cyan])
    .column("Name", 20, [clc.cyan])
    .output();

  for (let l = 0; l < obj.eps.length; l++) {
    new Line()
      .column(`${l}`, 20, [clc.white])
      .column(obj.eps[l].name, 20, [clc.white])
      .output();
  }
};
