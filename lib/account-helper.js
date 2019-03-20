


var fs = require('fs');


const StorageHelper = require('./storage-helper')

var web3utils =  require('web3-utils');

//var keythereum = require("keythereum");
 var Ethers =require('ethers')


  var pjson = require('../package.json');

module.exports =  class AccountHelper {
  constructor( ){

  }

//https://docs.ethers.io/ethers.js/html/api-wallet.html#encrypted-json-wallets
  static async createAccount()
  {

    var params = {   };

  //  var dk = keythereum.create( params );
    let wallet = Ethers.Wallet.createRandom();

    //dk = JSON.stringify(dk)

    //dk = JSON.parse(dk)

  //  var options={};
  //  var password=""
  //  var keyObject = keythereum.dump(password, Buffer.from(dk.privateKey), Buffer.from(dk.salt), Buffer.from(dk.iv), {options});

  //  let encrypt = await wallet.encrypt(password);



    var address = wallet.address;


    console.log(' randomWallet ',  wallet, address )


    if(!address.startsWith('0x'))
    {
      address = '0x' + address;
    }

    return { success:true, wallet: wallet  };
  }

  static async  saveAccount(encryptedWalletJSON)
  {
  /*  var password = acct.password;
    var dk = acct.dk;
    var name = 'eth_acct_'+acct.address;
    var options = {};

    var keyObject = keythereum.dump(password, new Buffer(dk.privateKey), new Buffer(dk.salt), new Buffer(dk.iv), {options});
*/
  console.log('saving acct ', encryptedWalletJSON)

   var encryptedWallet = JSON.parse(encryptedWalletJSON);


    var address = encryptedWallet.address;

    if(!address.startsWith('0x')){
      address = '0x' + encryptedWallet.address;
    }

    var name = 'eth_acct_'+address;

    await StorageHelper.storeFile(name,encryptedWallet);


   return {success:true}
  }


  static async getStoredAccountList()
  {
      var accountAddresses = [];

      var keys = await StorageHelper.getAllKeys();


      for(var filename of keys)
      {

         var response = await StorageHelper.readFile(filename);


         if(response && response.address)
         {
           var address = response.address;

           if(!address.startsWith('0x')){
             address = '0x' + response.address;
           }

           accountAddresses.push(address)
         }

      }


    return accountAddresses;
  }

  static async unlockAccount(address, password)
  {
    console.log('meep',address, password)
    var list = await AccountHelper.getStoredAccountList();

      //make name customizeable somehow,lookup table?
      var name = 'eth_acct_'+address ;


      var ethAccountFile = await StorageHelper.readFile(name);

      let json = JSON.stringify( ethAccountFile );
    //  let newpasswd = "foo";


      try{
        var wallet = await Ethers.Wallet.fromEncryptedJson(json, password)


            console.log("Address: " + wallet.address);
            // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"



            //var pKeyBuffer = keythereum.recover(password, keyObject);
            //  var pKey = Buffer.from(pKeyBuffer)

      }catch(e)
      {
        console.error(e.message)
        return {success:false, message: e.message}
      }


      return {success:true, account: {
        address: address,
        privateKey: pKey,
        name: name
      }}


        // return address pkey
  }




}
