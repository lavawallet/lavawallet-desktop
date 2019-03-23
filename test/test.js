var INFURA_MAINNET_URL = 'https://mainnet.infura.io/v3/0d5121b7e8e045a887086de55075994f';


//var Web3 = require('web3')

//var web3 = new Web3()
//web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))
var Ethers = require('ethers')

let web3Provider = new Ethers.providers.JsonRpcProvider(INFURA_MAINNET_URL);
//let web3Provider = new Ethers.providers.Web3Provider(currentProvider);


var env = 'mainnet';

import TXHelper from '../app/assets/javascripts/util/tx_helper.js';
import EthGasOracle from '../app/assets/javascripts/eth-gas-oracle.js';

//import AccountHelper from '../lib/account-helper'

import SocketClient from '../app/assets/javascripts/socketclient';


const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const { window } = new JSDOM(``, {
     url: "https://localhost:3142",
     referrer: "https://localhost:3142",
     contentType: "text/html",
     includeNodeLocations: true
   });

var assert = require('assert');


  describe('Lava Wallet', function() {



    /*it('uses tx helper ', async function() {


      var amount = 0;

      var accountStatus = {
        ethBalance: 0
      }

      var txCommand = {
        from:'0xB11ca87E32075817C82Cc471994943a4290f4a14',
        contract: 'erc20token_approveAndCall',
        to: '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
        functionName: 'approveAndCall',
        params: ['0x69a02e511e027e5c26d2fbe4192e45b41db32819',amount, '0x00'   ]};

       var overview = await TXHelper.getOverviewForStandardTransaction(web3, env, txCommand, accountStatus)

        console.log(overview)
      //  assert.ok(overview)

    });

    it('uses gas oracle ', async function() {

          var relayData = await  EthGasOracle.getGasData();
          assert.ok(relayData)

   });*/


 

   it('can unlock an account', async function() {



      console.log('window',window.location.hostname)






      var socketClient = new SocketClient();
      await socketClient.init(window);
        //   var account = await  AccountHelper.unlockAccount('0xd7f4e3980d5780c4c2b3096e95d9b01b16d55abb','password');
         var data = await socketClient.emitToSocket('unlockAccount',{
           address:'0xd7f4e3980d5780c4c2b3096e95d9b01b16d55abb',password:'password'});

         console.log(data)
         assert.ok(data)

  });


  });
