





const INFURA_MAINNET = "https://mainnet.infura.io/kZjd4ib8d7TnDMhYzjy4"

const INFURA_ROPSTEN = "https://ropsten.infura.io/kZjd4ib8d7TnDMhYzjy4"

const AccountHelper = require('./account-helper')
const StorageHelper = require('./storage-helper')



  var pjson = require('../package.json');

module.exports =  class WalletHelper {


    constructor( ){

    }


    static async initSettings()
    {
      var defaultSettingsMainnet = {
        web3Provider: INFURA_MAINNET,
        networkEnvironment: 'mainnet', //  ropsten, mainnet
        tokenName: "0xBTC",
        tokenAddress: "0xb6ed7644c69416d67b522e20bc294a9a9b405b31",
        tokenDecimals: 8,
        lavaContractAddress: "0x69a02e511e027e5c26d2fbe4192e45b41db32819",
        lavaRelayURL: "http://relay.lavawallet.io:3000"
      }

      var defaultSettingsRopsten = {
        web3Provider: INFURA_ROPSTEN,
        networkEnvironment: 'ropsten', //  ropsten, mainnet
        tokenName: "0xBTC",
        tokenAddress: "0x9D2Cc383E677292ed87f63586086CfF62a009010",
        tokenDecimals: 8,
        lavaContractAddress: "0x0af4991829fc81cbb4789bee85d958b72d1f4436",
        lavaRelayURL: "http://relay.lavawallet.io:3000"
      }

      var settingsExists = await StorageHelper.hasFile('settings');


      if(!settingsExists)
      {
        StorageHelper.storeFile('settings',defaultSettingsRopsten);
      }else{
        console.log('found settings', await WalletHelper.getStoredSettings())
      }
    }

    static async   getWalletInfo()
    {

      var settings = await WalletHelper.getStoredSettings();

      return {
        storagePath: StorageHelper.getStoragePath(),
        version: pjson.version,
        tokenName: settings.tokenName,
        tokenDecimals: settings.tokenDecimals,
        tokenAddress: settings.tokenAddress,
        web3Provider: settings.web3Provider,
        lavaContractAddress: settings.lavaContractAddress,
        lavaRelayURL: settings.lavaRelayURL
      }

    }



    static async getStoredSettings()
    {
      var settings = await StorageHelper.readFile('settings');
      return settings;
    }




}
