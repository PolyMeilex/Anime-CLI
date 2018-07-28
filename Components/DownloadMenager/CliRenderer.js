const CLI = require("clui"),
clc = require("cli-color");

let Line = CLI.Line;
let LineBuffer = CLI.LineBuffer;

let Progress = CLI.Progress;


function drawMod() {
  let outputBuffer = new LineBuffer({
    x: 0,
    y: 0,
    width: "console",
    height: "console"
  });

  new Line(outputBuffer).fill().store();

//   new Line(outputBuffer)
//     .column(obj.name, 50, [clc.green])
//     .fill()
//     .store();

  new Line(outputBuffer).fill().store();

  new Line(outputBuffer)
    .column("Name", 20, [clc.cyan])
    .column("Speed", 20, [clc.cyan])
    .column("Progress", 50, [clc.cyan])
    .fill()
    .store();

  this.Dobjects.forEach(d => {
    if (d.done) return;
    let thisProgressBar = new Progress(20);

    let state;
    if (d.state) state = d.state;
    else state = { percent: 0 };

    new Line(outputBuffer)
      .column(d.name, 20)
      .column(`${Math.round(state.speed * 0.000001 * 100) / 100} Mbps`, 20)
      .column(thisProgressBar.update(state.percent * 100, 100), 50)
      .fill()
      .store();
  });
  outputBuffer.output();
}

module.exports = drawMod;