const fs = require("fs");

let SettingsOBJ = null;

class Settings {
  constructor() {
    if (!fs.existsSync(cfgPath + "/Settings.json")) {
      let def = fs.readFileSync(__dirname + "/Def-Settings.json", "utf8");
      fs.writeFileSync(cfgPath + "/Settings.json", def);
    }
    this.fileData = fs.readFileSync(cfgPath + "/Settings.json", "utf8");
    this.fileData = JSON.parse(this.fileData);
  }

  Write(k, v) {
    this.fileData[k] = v;
    fs.writeFileSync(
      cfgPath + "/Settings.json",
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
