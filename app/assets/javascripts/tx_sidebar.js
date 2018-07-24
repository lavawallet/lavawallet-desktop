//const $ = require('jquery')
import Vue from 'vue';


 const M = require('./materialize/bin/materialize.js')


var sidebar;

 export default class TXSidebar {

   init(){


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

           title: 'Transaction Information'
         },
         methods: {
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

    setTxOverviewData(txOverviewData)
    {
      Vue.set(sidebar,'txOverview',txOverviewData)
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
