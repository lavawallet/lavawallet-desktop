
var request = require('request');

let ethGasStationAPIURL = "https://ethgasstation.info/json/ethgasAPI.json"

export default class EthGasOracle {

  static async getGasData( ){
    var responseJSON = await EthGasOracle.HTTPGet( ethGasStationAPIURL );
    var response = JSON.parse(responseJSON)
    /*{"average": 21.5, "blockNum": 6023072, "fast": 50.0, "safeLow": 13.0, "safeLowWait": 9.5, "speed": 0.9024831340247162, "fastestWait": 0.5, "avgWait": 0.9, "fastest": 200.0, "block_time": 14.306122448979592, "fastWait": 0.6}*/
    var gasData = {
      normalWait: response.avgWait,
      ethGasNormal: response.fast / 10.0,
      fastWait: response.fastWait,
      ethGasFast:response.average / 10.0
    }

    return gasData;
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
