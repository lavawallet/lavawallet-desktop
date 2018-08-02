//const $ = require('jquery')
import Vue from 'vue';


 const M = require('./materialize/bin/materialize.js')

 import TXHelper from './util/tx_helper.js';


var sidebar;



/*
Needs different modes

1. Transaction List
2. SignData
3. SignTransaction



*/



 export default class TXSidebar {

   init(web3 ){
     var self = this;

     this.web3=web3;



     //load txHistory
     var existingTxHistory = JSON.parse(window.localStorage.getItem("txHistory"));
     if(!existingTxHistory)
     {
       existingTxHistory = [];
     }



     var options = {};


     /*
      Need to use
        document.dispatchEvent(new Event('SidenavContentLoaded'));
      after vue components are loaded

     */
      document.addEventListener('SidenavContentLoaded', function() {
        console.log('init sidenav')
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, options);
      });



      //init vue object

      sidebar = new Vue({
         el: '#tx-sidebar',
         data: {
           txOverview: {},
           txHistory: existingTxHistory,

           accountStatus: {},
           gasPrice: 0,
           maxFee: 0,
           maxTotal: 0,
           ethBalance: 0,
           title: 'Confirm Transaction',

           minorError: null
         },
         updated: function () {
            this.$nextTick(function () {
              console.log('sidebar updated')

              var gasPriceEthRaw = (parseFloat(this.gasPrice) / 1e8)

              var gasPriceEth = gasPriceEthRaw.toFixed(1);

              var gasCostFloat = parseFloat(this.txOverview.gasCost)

              var maxFeeFloat = gasCostFloat * gasPriceEthRaw;

              var ethAmountFloat = parseFloat(this.txOverview.ethAmount);

              var maxTotalFloat = ethAmountFloat + maxFeeFloat;

              this.maxFee = maxFeeFloat.toPrecision(4);
              this.maxTotal = maxTotalFloat.toPrecision(4) ;


              if( this.maxTotal > this.ethBalance )
              {
                this.minorError="Insufficient ETH for transaction."
              }
              // Code that will run only after the
              // entire view has been re-rendered
            })
          },
         methods: {
           clickButton: async function (buttonName) {

             switch(buttonName)
             {
                case 'accept':
                    var txParams =  Object.assign({}, this.txOverview);//clone
                    txParams.gasPrice = this.gasPrice;

                   self.executeTransaction(txParams);




                   self.setDisplay('view-transaction');
                   break;
                case 'reject':
                   self.closeSidebar();
                   break;

             }

           }

         }
      })

    }


    openSidebar(txOverview)
    {




      var sb = document.getElementById('tx-sidebar');

      var instance = M.Sidenav.getInstance( sb );

      instance.open();

      if(txOverview){
        this.setTxOverviewData(txOverview)
      }

    }

    closeSidebar()
    {
      var sb = document.getElementById('tx-sidebar');

      var instance = M.Sidenav.getInstance( sb );

      instance.close();
    }

    updateAccountData(accountData)
    {
      Vue.set(sidebar,'ethBalance',accountData.ethBalance)

    }

    addTxToHistory(txid)
    {
      var txHistory = JSON.parse( window.localStorage.getItem("txHistory") );

      if(!txHistory)
      {
        txHistory = [];
      }

      console.log('hist',txHistory)

      txHistory.push( {txid: txid} );

      this.updateTxHistory(txHistory);
    }

    updateTxHistory(list)
    {
      window.localStorage.setItem("txHistory",JSON.stringify(list));
      Vue.set(sidebar,'txHistory',list);
    }

    async executeTransaction(txOverviewData)
    {
      var txInfo = await TXHelper.executeTransaction(this.web3, txOverviewData);

      this.addTxToHistory(txInfo.txhash);
    }


    setDisplay(displayName)
    {
      console.log('set display  ', displayName)
      // if view-transaction  then show a page with all the tx listed out, like metamask
    }


    setTxOverviewData(txOverviewData)
    {
      Vue.set(sidebar,'txOverview',txOverviewData)
      Vue.set(sidebar,'accountStatus',txOverviewData.accountStatus)

      var gasPriceFormatted = parseFloat(txOverviewData.gasPriceNormal).toPrecision(1)
      Vue.set(sidebar,'gasPrice', gasPriceFormatted )




      console.log('setting txData',txOverviewData)

      this.attachBlockie(txOverviewData.from, 'blockie-from' );
      this.attachBlockie(txOverviewData.to, 'blockie-to' );


    }

    attachBlockie(seed,elementId)
    {
      //make a blocky
      var icon = blockies.create({ // All options are optional
        seed: seed, // seed used to generate icon data, default: random

        size: 20, // width/height of the icon in blocks, default: 8
        scale: 4, // width/height of each block in pixels, default: 4

        });

      var blockieContainer = document.getElementById(elementId);
      while (blockieContainer.firstChild) {
        blockieContainer.removeChild(blockieContainer.firstChild);
      }
      blockieContainer.appendChild(icon); // icon is a canvas element
    }


}
