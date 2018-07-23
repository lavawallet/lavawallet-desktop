var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


var Web3 = require('web3')

var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))

var env = 'mainnet';

import TXHelper from '../app/assets/javascripts/util/tx_helper.js';



var assert = require('assert');


  describe('Lava Wallet', function() {



    it('uses tx helper ', async function() {




      var txCommand = {contract: 'lavawallet', address:'0x69a02e511e027e5c26d2fbe4192e45b41db32819', method: 'depositTokens', params: [11]};

      var overview = TXHelper.getOverviewForLavaTransaction(web3, env, txCommand)

      assert.ok(overview)




      var amount = 11;

      var txCommand = {contract: 'erc20token_approveAndCall', address: '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',  method: 'approveAndCall', params: ['0x69a02e511e027e5c26d2fbe4192e45b41db32819',amount,0 ]};

      var overview = TXHelper.getOverviewForLavaTransaction(web3, env, txCommand)

      assert.ok(overview)

    });





  });
