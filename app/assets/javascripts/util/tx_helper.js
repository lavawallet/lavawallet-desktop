
 const LavaPacketUtils = require('./lava-packet-utils')
//const LavaNetworkUtils = require('./lava-network-utils')
//const LavaBalanceUtils = require('./lava-balance-utils')

import EthGasOracle from '../eth-gas-oracle.js';


const Tx = require('ethereumjs-tx')
const ContractInterface = require('./contract_interface')

var web3utils =  require('web3-utils');



export default class TXHelper {


  /**
  Should return everything that we want to render on the sidepanel

  **/


  static async getOverviewForStandardTransaction( web3, env, txCommand , ethAccount , accountStatus)
  {



    console.log('get data for tx ')

    var txMethod = await TXHelper.getTXMethod( web3, env, txCommand  )

    var txCount = await web3.eth.getTransactionCount(txCommand.from);

    var txError = null;
    var max_gas_cost = 17046240;

    try{
      var estimatedGasCost = await txMethod.estimateGas({
        gas: max_gas_cost, from:txCommand.from, to: txCommand.to });
    }catch(e)
    {
      estimatedGasCost = max_gas_cost;
      txError = e.message ;
    }



    var gasPriceData = await  EthGasOracle.getGasData();


    return {
      ethAccount: ethAccount,
      accountStatus: accountStatus   ,

      from: txCommand.from,
      to: txCommand.to,
      ethAmount: 0,
      txCommand: txCommand,
      txMethod:txMethod,
      txCount:txCount,
      gasCost: estimatedGasCost,
      gasPriceNormal: gasPriceData.ethGasNormal,
      gasPriceFast: gasPriceData.ethGasFast,
      txError:txError,

      overviewType: 'standard_tx' 

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






  static async executeTransaction(web3, txOverviewData)
  {
    console.log('execute tx ', txOverviewData)

    var account = txOverviewData.ethAccount;
    var txMethod = txOverviewData.txMethod;
    var addressTo = txOverviewData.to;
    var gasPriceGwei = txOverviewData.gasPrice;
    var gasCost = txOverviewData.gasCost;
    var methodName = txOverviewData.txCommand.functionName;

    return await TXHelper.submitTransaction(web3, account, txMethod, methodName, addressTo, gasCost, gasPriceGwei    );
  }

  //account should be {address: aaa, privateKey: bbb}
  //submit a lava packet
  static async submitTransaction( web3,  account,  txMethod,  methodName, addressTo, gasCost, gasPriceGwei )
  {

    var addressFrom = account.address;


    var txData = TXHelper.getABIDataFromFunctionName(web3,methodName,txMethod.arguments) //ABI


    if(!txData)
    {
      console.error('missing txData', txData)
      return {success:false,message: 'missing txData'}
    }

    //raw tx
     var txOptions = await this.getTXOptions(web3, addressTo,addressFrom,txData, txMethod , gasCost, gasPriceGwei   )



    /* const estimatedTransaction = new Tx(txOptions);
     const estimatedTxHash = estimatedTransaction.hash(true).toString('hex')
     console.log('meep txhash', estimatedTxHash)  //why is this wrong !?
*/



     var privateKey =  account.privateKey;

     console.log('send tx: ')
     console.log(txData)
     console.log(txOptions)


     var sendResult = await TXHelper.sendSignedRawTransaction(web3,txOptions,privateKey);





    return sendResult;

  }


  static getABIDataFromFunctionName(web3, methodName,params)
  {

    console.log('get ABI from ', methodName, params  )
    var txData;


    switch(methodName)
    {
      case 'approveAndCall':    return  web3.eth.abi.encodeFunctionCall({
                                    name: 'approveAndCall',
                                    type: 'function',
                                    "inputs": [
                                      {
                                        "name": "spender",
                                        "type": "address"
                                      },
                                      {
                                        "name": "tokens",
                                        "type": "uint256"
                                      },
                                      {
                                        "name": "data",
                                        "type": "bytes"
                                      }
                                    ]
                                }, [...params]);

          case 'withdrawTokens':    return  web3.eth.abi.encodeFunctionCall({
                                        name: 'withdrawTokens',
                                        type: 'function',
                                        "inputs": [
                                          {
                                            "name": "token",
                                            "type": "address"
                                          },
                                          {
                                            "name": "tokens",
                                            "type": "uint256"
                                          }
                                        ]
                                    }, [...params]);

          case 'transfer':    return  web3.eth.abi.encodeFunctionCall({
                                        name: 'transfer',
                                        type: 'function',
                                        "inputs": [
                                          {
                                            "name": "to",
                                            "type": "address"
                                          },
                                          {
                                            "name": "tokens",
                                            "type": "uint256"
                                          }
                                        ]
                                    }, [...params]);


    }

        return;


  }

  static async  getTXOptions(web3, addressTo,addressFrom, txData, txMethod , gasCost, gasPriceGwei )
  {
      var txCount = 0;

      try{
         txCount = await web3.eth.getTransactionCount(addressFrom);
        console.log('txCount',txCount)
       } catch(error) {  //here goes if someAsyncPromise() rejected}
        console.log('error',error);
         return error;    //this will result in a resolved promise.
       }


       console.log('estimating gas ')


       var max_gas_cost = 7046240;

       if(gasCost == null)
       {
         gasCost = await txMethod.estimateGas({gas: max_gas_cost, from:addressFrom, to: addressTo });
       }


       if( gasCost > max_gas_cost){
         console.log("Gas estimate too high!  Something went wrong ")
         return;
       }

       console.log('estimated gas ', gasCost)



    var txOptions = {
      nonce: web3utils.toHex(txCount),
      gas: web3utils.toHex(gasCost),
       gasPrice: web3utils.toHex(web3utils.toWei(gasPriceGwei.toString(), 'gwei') ),
      value: 0,
      to: addressTo,
      from: addressFrom,
      data: txData
    }
    return txOptions;
  }


  static async sendSignedRawTransaction(web3,txOptions,private_key,callback) {

      var privKey = TXHelper.truncate0xFromString( private_key )

      const privateKey = new Buffer( privKey, 'hex')
      const transaction = new Tx(txOptions)


      transaction.sign(privateKey)


      const serializedTx = transaction.serialize().toString('hex')

      const hash = transaction.hash(true).toString('hex')
      console.log('hashy',hash)

        try
        {


        var txRes = await new Promise(function (result,error) {

                web3.eth.sendSignedTransaction('0x' + serializedTx, function(err, res) {
                if (err) error(err)
                  result(res)
              })

            }.bind(this));



        }catch(e)
        {
          return {success:false, message: e.message}
          console.log('error',e);
        }

        return {success:true, result: txRes, txhash: hash}
    }




     static truncate0xFromString(s)
    {
      if(s.startsWith('0x')){
        return s.substring(2);
      }
      return s;
    }


}
