





const INFURA_MAINNET = "https://infura.io/kZjd4ib8d7TnDMhYzjy4"

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
        tokenName: "LAVA",
        tokenAddress: "0xd89c37fd7c0fa3b107b7e4a8731dd3aaec488954",
        tokenDecimals: 8,
        lavaContractAddress: "0xd89c37fd7c0fa3b107b7e4a8731dd3aaec488954",
        lavaRelayURL: "http://relay.0xbtc.io"
      }

      var defaultSettingsRopsten = {
        web3Provider: INFURA_ROPSTEN,
        networkEnvironment: 'ropsten', //  ropsten, mainnet
        tokenName: "LAVA",
        tokenAddress: "0x5b545603eea150f92f7c764272adfbedbfea8cdf",
        tokenDecimals: 8,
        lavaContractAddress: "0x5b545603eea150f92f7c764272adfbedbfea8cdf",
        lavaRelayURL: "http://relay.0xbtc.io"
      }

      var settingsExists = await StorageHelper.hasFile('settings');


      if(!settingsExists)
      {
        StorageHelper.storeFile('settings',defaultSettingsMainnet);
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
