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
          downloadedBackup: false,

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

               Vue.set(accountComponent, 'backingUp', true )
               Vue.set(accountComponent, 'backedUp', false )




           },
           saveAccount: async function () {

              var walletData = accountComponent.wallet;
               var pKey = walletData.signingKey.privateKey;
               var web3Provider = null;

                var passwd = accountComponent.password;

               let wallet = new Ethers.Wallet(pKey, web3Provider);
               let encryptedWalletJSON = await wallet.encrypt(passwd);
               let encryptedWallet = JSON.parse(encryptedWalletJSON)

                var data = await  self.socketClient.emitToSocket('saveAccount',JSON.stringify(encryptedWallet) );



                  window.location.href = '/accounts.html'

           },
           startBackup: function () {
              Vue.set(accountComponent, 'backingUp', true )


           },
           saveBackup: async function () {

             var passwd = accountComponent.password;
             var walletData = accountComponent.wallet;

             if(passwd.length < 6)
             {
               this.errorMessage = 'Minimum password length: 6'
              return
             }


             var options = {};

             var pKey = walletData.signingKey.privateKey;

             var web3Provider = null;

             let wallet = new Ethers.Wallet(pKey, web3Provider);


             //let wallet = new ethers.Wallet(privateKey);
             let encryptedWalletJSON = await wallet.encrypt(passwd);
             let encryptedWallet = JSON.parse(encryptedWalletJSON)

            // var keyObject = keythereum.dump(password, (dk.privateKey), (dk.salt), (dk.iv), {options});
            console.log('meeep',encryptedWallet, encryptedWallet.address )
            var newAddress = '0x' + encryptedWallet.address
            var existingAddress = accountComponent.address.toLowerCase()

             if( !existingAddress.endsWith(newAddress))
             {
               console.log('does not match', newAddress, existingAddress)

               accountComponent.errorMessage = "Address doesn't match?"
               return;
             }



              Vue.set(accountComponent, 'backingUp', false )
              Vue.set(accountComponent, 'backedUp', true )


              Vue.nextTick(function () {
                var btn = document.getElementById('downloadBackupButton')

                var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify( encryptedWallet ));
                var fileName = "eth_" + newAddress.toString() + ".json"

                btn.setAttribute("href", "data:"+data);
                btn.setAttribute("download", fileName);
              })

           },
           downloadBackup: async function (el) {


               Vue.set(accountComponent, 'downloadedBackup', true )


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
