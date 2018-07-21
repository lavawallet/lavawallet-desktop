//const $ = require('jquery')
 const M = require('./materialize/bin/materialize.js')



 export default class TXSidebar {

   init(){


     console.log('init', M )

     var options = {};

      document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, options);
      });

      // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
      // var collapsibleElem = document.querySelector('.collapsible');
      // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

      // Or with jQuery

      /*window.addEventListener('load', function(){

      }, false )*/


    }


    open()
    {
      console.log('meep')
      var sb = document.getElementById('tx-sidebar');

      var instance = M.Sidenav.getInstance( sb );
      instance.open();


    }


}
