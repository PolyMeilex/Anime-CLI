const fs = require("fs");

let SettingsOBJ = null;

class Settings {
  constructor() {
    this.fileData = fs.readFileSync(__dirname + "/Settings.json", "utf8");
    this.fileData = JSON.parse(this.fileData);
  }

  Write(k, v) {
    this.fileData[k] = v;
    fs.writeFileSync(
      __dirname + "/Settings.json",
      JSON.stringify(this.fileData, null, "\t")
    );
  }
  Read(k) {
    return this.fileData[k];
  }
}

exports.Int = () => (SettingsOBJ = new Settings());

exports.Write = (k, v) => SettingsOBJ.Write(k, v);

exports.Read = k => SettingsOBJ.Read(k);
