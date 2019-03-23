/*
 NAMETAG TOKEN UTILS
Version 0.10

*/

var web3Utils = require('web3-utils')
var BigNumber = require('bignumber.js')



const ContractInterface = require('../contract-interface')




module.exports =  {

  async queryTokenOwner(web3Provider,name)
  {
      console.log('queryTokenOwner', name      )

          var env = 'mainnet'

          var nametagContract = ContractInterface.getNametagContract(web3Provider,env)

            //console.log('nametagContract', nametagContract      )
              var name = 'toast'

            //name not found ?
           var tokenIdRaw = await nametagContract.nameToTokenId(name);



             console.log('tokenidraw',tokenIdRaw)

           var tokenIdNumber =  new BigNumber(tokenIdRaw).toFixed();


           var tokenOwnerAddress = await nametagContract.ownerOf(tokenIdNumber);
         


      return tokenOwnerAddress

  },

  async queryTokenId(web3,name)
  {




          var env = 'mainnet'

          var nametagContract = ContractInterface.getNametagContract(web3,env)


          var tokenIdRaw =  await new Promise(function (result,error) {
             nametagContract.nameToTokenId.call(name, function(err,res){
                if(err){ return error(err)}

                result(res);
             })
           });

           var tokenIdNumber =  new BigNumber(tokenIdRaw).toFixed();
           var tokenIdNumberHex = HomeRenderer.dec2hex( tokenIdNumber )

        return tokenIdNumber;

  },


      dec2hex(str){ // .toString(16) only works up to 2^53
      var dec = str.toString().split(''), sum = [], hex = [], i, s
      while(dec.length){
          s = 1 * dec.shift()
          for(i = 0; s || i < sum.length; i++){
              s += (sum[i] || 0) * 10
              sum[i] = s % 16
              s = (s - sum[i]) / 16
          }
      }
      while(sum.length){
          hex.push(sum.pop().toString(16))
      }
      return hex.join('')
    },


  async queryTokenName(web3,tokenId)
  {


          var env = 'mainnet'

          var nametagContract = ContractInterface.getNametagContract(web3,env)


          var tokenName =  await new Promise(function (result,error) {
             nametagContract.tokenURI.call(tokenId, function(err,res){
                if(err){ return error(err)}

                result(res);
             })
           });

        return tokenName;

  },


  async checkNameAvailability(name)
  {



    var web3 = ethereumHelper.getWeb3Instance();

     if(!web3) return;

    var env = 'mainnet'

    var nametagContract = ContractInterface.getNametagContract(web3,env)

    console.log(name)

    var tokenIdRaw =  await new Promise(function (result,error) {
       nametagContract.nameToTokenId.call(name, function(err,res){
          if(err){ return error(err)}

          result(res);
       })
     });

     var tokenIdNumber =  new BigNumber(tokenIdRaw).toFixed();

      console.log(  tokenIdNumber  )

      var tokenOwnerAddress =  await new Promise(function (result,error) {
         nametagContract.ownerOf.call(tokenIdNumber, function(err,res){
            if(err){ return error(err)}

            result(res);
         })
       });

       var hasOwner = tokenOwnerAddress && tokenOwnerAddress != '0x'
         console.log(  hasOwner  )

         Vue.set(nametagInput, 'nametagAvailable', !hasOwner)
         Vue.set(nametagInput, 'showAvailability', true)



  }



}
