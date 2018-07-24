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


           title: 'Transaction Information'
         },
         methods: {
         }
      })

    }


    openSidebar(txData)
    {

      this.setTxData(txData)

      var sb = document.getElementById('tx-sidebar');


      var instance = M.Sidenav.getInstance( sb );
     
      instance.open();


    }

    setTxData(txData)
    {
      console.log('setting txData',txData)

    }


}
