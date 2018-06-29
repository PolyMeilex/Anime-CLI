const rp = require("request-promise-native")
const cheerio = require("cheerio");

var options = { method: 'GET',
  url: 'http://kissanime.ru/M',
  headers: 
   {'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.183 Mobile Safari/537.36' } };


(async ()=>{
  let body;
  try{
  body = await rp(options);
  }catch(e){
    body = e.response.body;
  }

  const $ = cheerio.load(body)

  let Chalange = $("script").html();
  let jschl_vc = $("[name=jschl_vc]").attr('value');
  let pass = $("[name=pass]").attr('value');
  let jschl_answer = null;
  
  let obj = {jschl_vc,pass,jschl_answer}

  let lines = Chalange.split('\n');

    let code = [
    "(()=>{",
    lines[8],
    "t = 'kissanime.ru'",
    "a = {}",
    lines[15],
    "return a",
    "})()"
  ]
  code = code.join("\n");

  obj.jschl_answer = eval(code).value;


  console.log(`http://kissanime.ru/cdn-cgi/l/chk_jschl?jschl_vc=${obj.jschl_vc}&pass=${obj.pass}&jschl_answer=${obj.jschl_answer}`);

})()
