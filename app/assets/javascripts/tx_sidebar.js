//const $ = require('jquery')
import Vue from 'vue';


 const M = require('./materialize/bin/materialize.js')


var sidebar;

 export default class TXSidebar {

   init(){
     var self = this;

     console.log('init', M )

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
           gasPrice: 0,
           maxFee: 0,
           maxTotal: 0,

           title: 'Confirm Transaction'
         },
         updated: function () {
            this.$nextTick(function () {
              console.log('sidebar updated')

              var gasPriceEth = (parseFloat(this.gasPrice) / 1e8);

              var gasCostFloat = parseFloat(this.txOverview.gasCost)

              var maxFeeFloat = gasCostFloat * gasPriceEth;

              var ethAmountFloat = parseFloat(this.txOverview.ethAmount);

              var maxTotalFloat = ethAmountFloat + maxFeeFloat;

              this.maxFee = maxFeeFloat.toPrecision(4);
              this.maxTotal = maxTotalFloat.toPrecision(4) ;
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
                   self.setDisplay('view-transaction')
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

      this.setTxOverviewData(txOverview)

      var sb = document.getElementById('tx-sidebar');

      var instance = M.Sidenav.getInstance( sb );

      instance.open();


    }

    closeSidebar()
    {
      var sb = document.getElementById('tx-sidebar');

      var instance = M.Sidenav.getInstance( sb );

      instance.close();
    }

    executeTransaction(txOverviewData)
    {
      console.log('execute tx  ', txOverviewData)

    }


    setDisplay(displayName)
    {
      console.log('set display  ', displayName)
      // if view-transaction  then show a page with all the tx listed out, like metamask
    }


    setTxOverviewData(txOverviewData)
    {
      Vue.set(sidebar,'txOverview',txOverviewData)
      Vue.set(sidebar,'gasPrice',txOverviewData.gasPriceNormal)




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
