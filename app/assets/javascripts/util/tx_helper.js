


const Tx = require('ethereumjs-tx')
const ContractInterface = require('./contract_interface')

var web3utils =  require('web3-utils');



export default class TXHelper {






  static  getDataForTransaction( web3,   contractConfig, txCommand  )
  {
    console.log( web3 )
    console.log( contractConfig )

    var tokenContract = ContractInterface.getTokenContract( web3 , contractConfig);
    console.log( tokenContract )

    console.log('get data for tx ')
    return ;
  }





  static async submitTransaction( )
  {

    var walletContract = ContractInterface.getWalletContract(this.web3,this.relayConfig.environment);

    console.log(walletContract.options.address) //undefined


    var addressFrom = this.getRelayAccount().address;
    var addressTo = walletContract.options.address;


    console.log('addressFrom ! ',addressFrom)

    var lavaTransferMethod = lavaPacketUtils.getContractLavaMethod(walletContract,packetData)


    try{
      var txCount = await this.web3.eth.getTransactionCount(addressFrom);
      console.log('txCount',txCount)
     } catch(error) {  //here goes if someAsyncPromise() rejected}
      console.log('error',error);
       return error;    //this will result in a resolved promise.
     }

     var txData = lavaPacketUtils.getFunctionCall(this.web3,packetData)




       console.log('estimating gas ')


     var max_gas_cost = 7046240;
     var estimatedGasCost = await lavaTransferMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

     if( estimatedGasCost > max_gas_cost){
       console.log("Gas estimate too high!  Something went wrong ")
       return;
     }

     console.log('estimated gas ', estimatedGasCost)



      var relayData = await this.lavaPeer.getRelayData();


     var relayingGasPrice = relayData.ethGasNormal; //this.relayConfig.solutionGasPriceWei

     if(broadcastingSpeed == 'fast')
     {
       relayingGasPrice = relayData.ethGasFast;
     }

     //safelow ?
      console.log('relayingGasPrice ', relayingGasPrice)

     const txOptions = {
       nonce: web3utils.toHex(txCount),
       gas: web3utils.toHex(estimatedGasCost),
       gasPrice: web3utils.toHex(web3utils.toWei(relayingGasPrice.toString(), 'gwei') ),
       value: 0,
       to: addressTo,
       from: addressFrom,
       data: txData
     }

     var privateKey =  this.getRelayAccount().privateKey;

     return new Promise(function (result,error) {

          this.sendSignedRawTransaction(this.web3,txOptions,addressFrom,privateKey, function(err, res) {
           if (err) error(err)
             result(res)
         })

       }.bind(this));



  }


  async sendSignedRawTransaction(web3,txOptions,addressFrom,private_key,callback) {

      var privKey = this.truncate0xFromString( private_key )

      const privateKey = new Buffer( privKey, 'hex')
      const transaction = new Tx(txOptions)


      transaction.sign(privateKey)


      const serializedTx = transaction.serialize().toString('hex')

        try
        {
          var result =  web3.eth.sendSignedTransaction('0x' + serializedTx, callback)
        }catch(e)
        {
          console.log('error',e);
        }
    }




     truncate0xFromString(s)
    {
      if(s.startsWith('0x')){
        return s.substring(2);
      }
      return s;
    }


}
