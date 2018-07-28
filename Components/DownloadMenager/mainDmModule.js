const request = require("request");
const progress = require("request-progress");
const fs = require("fs");


class DownloadMenager {
  constructor(Dobjects,webMode) {
    if(!webMode) webMode = false;

    this.webMode = webMode;
    this.Dobjects = Dobjects;
    this.LastDownloading = 0;
  }

  draw() {
    if(!this.webMode){
        var drawMod = require("./CliRenderer");
    }
    else{
        var drawMod = require("./WebWrapper");
    }
    
    let binded = drawMod.bind(this);
    binded();
  }

  InitDownload(i = 0) {
    const d = this.Dobjects[i];
    
    if (!d) return;
    if (d.PlaceHolder) return;
    d.StartDownload();
    d.progress.on("progress", state => {
      d.state = state;
      this.draw();
    });
    d.progress.on("error", err => {});
    d.progress.on("end", () => {
      if (d.state) d.state.percent = 1;
      else {
        d.state = {};
        d.state.percent = 0;
      }
      d.done = true;

      // this.Dobjects.splice(i, 1);
      this.Dobjects.push({
        PlaceHolder: true,
        name: d.name,
        state: d.state
      });

      this.InitDownload(this.LastDownloading + 1);
    });

    d.progress.pipe(
      fs.createWriteStream(
        DownloadPath + "/Downloads/" + AnimeName + "/" + d.name + ".mp4"
      )
    );
    this.LastDownloading = i;
  }
}

class Dobject {
  constructor(ep) {
    this.name = ep.name;
    this.rawLink = ep.rawLink;
    this.progress = null;
    this.state = null;
    this.done = false;
    this.moved = false;
  }
  StartDownload() {
    this.progress = progress(request(this.rawLink));
  }
}


exports.DownloadMenager = DownloadMenager;
exports.Dobject = Dobject;