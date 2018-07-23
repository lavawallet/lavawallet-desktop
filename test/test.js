var INFURA_MAINNET_URL = 'https://mainnet.infura.io/gmXEVo5luMPUGPqg6mhy';


var Web3 = require('web3')

var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(INFURA_MAINNET_URL))

var env = 'mainnet';

import TXHelper from '../app/assets/javascripts/util/tx_helper.js';



var assert = require('assert');


  describe('Lava Wallet', function() {



    it('uses tx helper ', async function() {




      var txCommand = {contract: 'lavawallet', method: 'deposit', value: 11};

      var overview = TXHelper.getOverviewForLavaTransaction(web3, env, txCommand)

      assert.ok(overview)

    });





  });
