

var fs = require('fs');

const WalletHelper = require('./wallet-helper')
const AccountHelper = require('./account-helper')
const StorageHelper = require('./storage-helper')

const ContractInterface = require('./contract-interface')

//const Web3 = require('web3')

var Ethers = require('ethers')


module.exports =  class NetworkHelper {


    constructor( ){

    }





    static async getNetworkInfo( )
    {
      console.log('get network info')

       var settings = await WalletHelper.getStoredSettings();

      let web3Provider = new Ethers.providers.JsonRpcProvider(settings.web3Provider);


      var bNumber = await web3Provider.getBlockNumber()


      var networkInfo = {
         currentEthBlock: bNumber
      }



      return networkInfo;

    }


    static async getAccountInfo(address)
    {
      console.log('get account info')

      var settings = await WalletHelper.getStoredSettings();
    //  var web3 = new Web3()

    //  web3.setProvider(settings.web3Provider)
    //  console.log('using web3',settings)

     let web3Provider = new Ethers.providers.JsonRpcProvider(settings.web3Provider);


      var tokenAddress = settings.tokenAddress;
      var tokenDecimals = settings.tokenDecimals;

      //var ethBalance = await web3.eth.getBalance(address);
      var ethBalance = 0;

      var tokenContract = ContractInterface.getTokenContract(web3Provider,tokenAddress);

      console.log('tokenContract',tokenContract)

      var tokenBalance = await tokenContract.functions.balanceOf(address)

    //  var lavaContractAddress = settings.lavaContractAddress;
    //   var lavaContract = ContractInterface.getLavaContract(web3, lavaContractAddress )

    //  var lavaBalance = await lavaContract.methods.balanceOf(address).call()

    //  ethBalance = (parseFloat(ethBalance)/ Math.pow(10,18))
      tokenBalance = (parseFloat(tokenBalance ) / Math.pow(10,tokenDecimals))
    //  lavaBalance = (parseFloat(lavaBalance ) / Math.pow(10,tokenDecimals))





      var accountInfo = {
         ethBalance:ethBalance,
        tokenBalance: tokenBalance,
        userAddress:address
      //  lavaBalance:lavaBalance
      }

      console.log('acct info', accountInfo)

      return accountInfo;
      //use web3 and hit the provider :D
    }




}
