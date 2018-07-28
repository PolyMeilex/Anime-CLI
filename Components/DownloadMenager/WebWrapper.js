const Conf = require("../Settings/Settings");

const wrapp = async obj => {
  const DownloadMenager = require("./mainDmModule").DownloadMenager;
  const Dobject = require("./mainDmModule").Dobject;

  if (obj.host == null) {
    const GetRawLinks = require("../Hostings/KA/LinkParsers/GetRawLinks");
    console.log(obj);
    obj.eps = await GetRawLinks(obj.eps);
  } else {
    const GetRawLinks = require("../Hostings/" +
      obj.host +
      "/LinkParsers/GetRawLinks");
    obj.eps = await GetRawLinks(obj.eps);
  }

  let list = obj.eps.map(ep => new Dobject(ep));

  let dm = new DownloadMenager(obj.name,list);
  dm.draw();

  for (let i = 0; i < Conf.Read("Max-Downloads"); i++) dm.InitDownload(i);

  return dm;
};

module.exports = wrapp;
