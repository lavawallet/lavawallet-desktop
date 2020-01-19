

const INFURA_MAINNET = "https://mainnet.infura.io/v3/0d5121b7e8e045a887086de55075994f"

const INFURA_GOERLI = "https://goerli.infura.io/v3/0d5121b7e8e045a887086de55075994f"

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
        networkEnvironment: 'mainnet',
        tokenName: "0xBTC",
        tokenAddress: "0xb6ed7644c69416d67b522e20bc294a9a9b405b31",
        tokenDecimals: 8,
        lavaContractAddress: "0x5c5cA8c79bf69a5449F1F621215E9Cfc91189Cc5",
        lavaRelayURL: "http://relay.0xbtc.io",
        version:pjson.version
      }

      var defaultSettingsRopsten = {
        web3Provider: INFURA_GOERLI,
        networkEnvironment: 'testnet', 
        tokenName: "0xBTC",
        tokenAddress: "0x9d2cc383e677292ed87f63586086cff62a009010",
        tokenDecimals: 8,
        lavaContractAddress: "0xf9454ac1dd9d55f23ff97fb0b06b6b0874ffd606",
        lavaRelayURL: "http://relay.0xbtc.io",
        version:pjson.version
      }

      var settingsExists = await StorageHelper.hasFile('settings');


      if(!settingsExists)
      {
        StorageHelper.storeFile('settings',defaultSettingsMainnet);
      }else{
        console.log('found settings', await WalletHelper.getStoredSettings())
      }



      var existingSettings = await WalletHelper.getStoredSettings();

      if( existingSettings.version != pjson.version )
      {
        console.log('Version does not match!! Replacing settings.')
        StorageHelper.storeFile('settings',defaultSettingsMainnet);

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
