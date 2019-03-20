import Vue from 'vue';

var blockies = require('./util/blockies')
 //require('./util/keythereum')
 var Ethers =require('ethers')

var accountComponent;

export default class AccountNew {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    accountComponent = new Vue({
        el: '#new-account',
        data: {
          address: null,
          password: '',
          wallet: null,
          accountRendering: false,
          backingUp: false,
          backedUp: false,

          errorMessage: null
        },
        methods: {
           newAccount: async function () {

             var dataJSON = await self.socketClient.emitToSocket('createAccount',null);

                console.log('got ',  dataJSON)


               var data = JSON.parse(dataJSON);
               var wallet = data.wallet


               var address = wallet.signingKey.address;

              /* accountComponent.dk = acct.derivation;
               accountComponent.dk.privateKey = Buffer.from(accountComponent.dk.privateKey)
               accountComponent.dk.salt = Buffer.from(accountComponent.dk.salt)
               accountComponent.dk.iv = Buffer.from(accountComponent.dk.iv)
                  */

                accountComponent.wallet = wallet;

               accountComponent.address = address;
               accountComponent.accountRendering = true;

               self.renderAccount( address )

           },
           saveAccount: async function () {

             //address is changing !!??

             var passwd = accountComponent.password;
             var wallet = accountComponent.wallet;
             var options = {};

              let encryptedWallet = await wallet.encrypt(passwd);
            // var keyObject = keythereum.dump(password, (dk.privateKey), (dk.salt), (dk.iv), {options});

             if( !accountComponent.address.endsWith(encryptedWallet.address))
             {
               console.log(encryptedWallet.address)

               accountComponent.errorMessage = "Address doesn't match?"
               return;
             }

              var data = await self.socketClient.emitToSocket('saveAccount',encryptedWallet);


               if(data.success)
               {
                 window.location.href = '/accounts.html'
               }


           },
           startBackup: function () {
              Vue.set(accountComponent, 'backingUp', true )


           },
           downloadBackup: async function (el) {

             var passwd = accountComponent.password;
             var walletData = accountComponent.wallet;

             if(passwd.length < 6)
             {
               this.errorMessage = 'Minimum password length: 6'
              return
             }


             var options = {};

             var pKey = walletData.signingKey.privateKey;

             let wallet = new Ethers.Wallet(pKey, web3Provider);


             //let wallet = new ethers.Wallet(privateKey);
             let encryptedWallet = await wallet.encrypt(passwd);


            // var keyObject = keythereum.dump(password, (dk.privateKey), (dk.salt), (dk.iv), {options});



             if( !accountComponent.address.endsWith(encryptedWallet.address))
             {
               console.log('does not match', encryptedWallet.address, accountComponent.address)

               accountComponent.errorMessage = "Address doesn't match?"
               return;
             }

              var btn = document.getElementById('downloadBackupButton')

              var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify( encryptedWallet ));

              btn.setAttribute("href", "data:"+data);
              btn.setAttribute("download", "data.json");

              Vue.set(accountComponent, 'backingUp', false )
              Vue.set(accountComponent, 'backedUp', true )


              var data = await  self.socketClient.emitToSocket('saveAccount',encryptedWallet);

               if(data.success)
               {
                 window.location.href = '/accounts.html'
               }


           }
         }
      })


  }


  renderAccount(address)
  {
    console.log('render account ', address);


    //make a blocky
    var icon = blockies.create({ // All options are optional
      seed: address, // seed used to generate icon data, default: random

      size: 20, // width/height of the icon in blocks, default: 8
      scale: 6, // width/height of each block in pixels, default: 4

      });

    var blockieContainer = document.getElementById('blockie');
    while (blockieContainer.firstChild) {
      blockieContainer.removeChild(blockieContainer.firstChild);
    }
    blockieContainer.appendChild(icon); // icon is a canvas element


  }


};
