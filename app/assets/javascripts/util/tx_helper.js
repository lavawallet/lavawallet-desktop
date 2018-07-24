
 const LavaPacketUtils = require('./lava-packet-utils')
//const LavaNetworkUtils = require('./lava-network-utils')
//const LavaBalanceUtils = require('./lava-balance-utils')





const Tx = require('ethereumjs-tx')
const ContractInterface = require('./contract_interface')

var web3utils =  require('web3-utils');



export default class TXHelper {


  /**
  Should return everything that we want to render on the sidepanel

  **/


  static async getOverviewForStandardTransaction( web3, env, txCommand  )
  {


  console.log('get data for tx ')

    var txMethod = await TXHelper.getTXMethod( web3, env, txCommand  )

    var txCount = await web3.eth.getTransactionCount(txCommand.from);

    var txError = '';
    var max_gas_cost = 17046240;

    try{
      var estimatedGasCost = await txMethod.estimateGas({
        gas: max_gas_cost, from:txCommand.from, to: txCommand.to });
    }catch(e)
    {
      estimatedGasCost = max_gas_cost;
      txError = e.message ;
    }

    return {
      from: txCommand.from,
      to: txCommand.to,
      txCommand: txCommand,
      txMethod:txMethod,
      txCount:txCount,
      gasCost: estimatedGasCost,
      txError:txError,
      overviewStyle: 'standard'

    }
  }

  //{contract: 'lavawallet', method: 'deposit', value: this.depositAmount}
  static async getTXMethod( web3, env,  txCommand  )
  {

    var contract = ContractInterface.getContract ( web3, env, txCommand.contract, txCommand.to)

    //break out the params with ellipses
    var method = contract.methods[txCommand.functionName]( ...txCommand.params);

    return method;

  }

  static async getTxDataForLavaTransaction( web3, env, txCommand  )
  {


  }

  //account should be {address: aaa, privateKey: bbb}
  //submit a lava packet
  static async submitTransaction( web3, env , account )
  {

    var walletContract = ContractInterface.getWalletContract( web3, env);

    var addressFrom = account.address;
    var addressTo = walletContract.options.address;


    var lavaTransferMethod = lavaPacketUtils.getContractLavaMethod(walletContract,packetData)

    var txData = lavaPacketUtils.getFunctionCall(web3,packetData)

    var relayData = await this.lavaPeer.getRelayData();


     var relayingGasPrice = relayData.ethGasNormal; //this.relayConfig.solutionGasPriceWei

     if(broadcastingSpeed == 'fast')
     {
       relayingGasPrice = relayData.ethGasFast;
     }

     var txOptions = this.getTXOptions(addressTo,addressFrom,txData, lavaTransferMethod , relayingGasPrice  )

     var privateKey =  account.privateKey;

     return new Promise(function (result,error) {

          this.sendSignedRawTransaction(web3,txOptions,addressFrom,privateKey, function(err, res) {
           if (err) error(err)
             result(res)
         })

       }.bind(this));



  }

  static async  getTXOptions(addressTo,addressFrom, txData, txMethod , gasPrice)
  {
      var txCount = 0;

      try{
         txCount = await this.web3.eth.getTransactionCount(addressFrom);
        console.log('txCount',txCount)
       } catch(error) {  //here goes if someAsyncPromise() rejected}
        console.log('error',error);
         return error;    //this will result in a resolved promise.
       }


       console.log('estimating gas ')


       var max_gas_cost = 7046240;
       var estimatedGasCost = await txMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });

       if( estimatedGasCost > max_gas_cost){
         console.log("Gas estimate too high!  Something went wrong ")
         return;
       }

       console.log('estimated gas ', estimatedGasCost)



    var txOptions = {
      nonce: web3utils.toHex(txCount),
      gas: web3utils.toHex(estimatedGasCost),
      gasPrice: web3utils.toHex(web3utils.toWei(gasPrice.toString(), 'gwei') ),
      value: 0,
      to: addressTo,
      from: addressFrom,
      data: txData
    }
    return txOptions;
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
