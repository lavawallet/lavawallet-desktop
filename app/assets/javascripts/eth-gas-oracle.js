
var request = require('request');

let ethGasStationAPIURL = "https://ethgasstation.info/json/ethgasAPI.json"

export default class EthGasOracle {

  static async getGasData( ){
    var response = await EthGasOracle.HTTPGet( ethGasStationAPIURL );
    return JSON.parse(response);
  }

  static async HTTPGet(url){

  var body = await new Promise(function(resolve, reject) {
    request(ethGasStationAPIURL, function (error, response, body) {
         resolve(body);
    });
  });

    return body;

  /*  var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;*/
  }

}
