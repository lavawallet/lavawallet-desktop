
export default class LavaPacketHelper {

  static serializePacketData (obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }



 static  async getRelayStats( lavaNodeURL )
  {

    if(!lavaNodeURL.startsWith("http://"))
    {
      lavaNodeURL = "http://"+lavaNodeURL;
    }

    if(!lavaNodeURL.endsWith("/stats"))
    {
      lavaNodeURL = lavaNodeURL+"/stats";
    }


    var options = {
      method: 'GET',
      body: {} ,
      url: lavaNodeURL,
      json: true ,
      headers: {
       //  'Content-Type': 'application/x-www-form-urlencoded'
       // "Content-Type": "application/json",
      }
     }

     var response = await new Promise(async resolve => {

       var xhr = new XMLHttpRequest();

       xhr.open('GET', lavaNodeURL);
       xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


       xhr.onreadystatechange = function() {
         if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
             if (xhr.status === 200  ) {
                console.log('successful');
                resolve({success:true, relayResponse: response})
             } else {
                console.log('failed');
                resolve({success:false, message: 'Request failed.  Returned status of ' + xhr.status});

             }
         }
       }

       xhr.send( {} );

       /*
         request(options, function (err, res, body) {
          if (err) {
            console.log('Error :', err)
            resolve(err)
          }
          console.log(' Body :', body)
          resolve(body)
         });*/

       });

       console.log('relay stats ',response)

       return response ;
  }




  static async sendLavaPacket(lavaNodeURL, lavaPacketData)
  {


      if(!lavaNodeURL.startsWith("http://"))
      {
        lavaNodeURL = "http://"+lavaNodeURL;
      }

      if(!lavaNodeURL.endsWith("/lavapacket"))
      {
        lavaNodeURL = lavaNodeURL+"/lavapacket";
      }

      return new Promise(async resolve => {

        var xhr = new XMLHttpRequest();

        xhr.open('POST', lavaNodeURL);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            //var response = JSON.parse(xhr.responseText);
              if (xhr.status === 200  ) {
                 console.log('successful');
                 resolve({success:true, packet: lavaPacketData, relayResponse: null })
              } else {
                 console.log('failed');
                 resolve({success:false, message: 'Request failed.  Returned status of ' + xhr.status});

              }
          }
        }

        xhr.send(LavaPacketHelper.serializePacketData( lavaPacketData ));

      })


  }




}
