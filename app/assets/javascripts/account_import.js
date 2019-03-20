import Vue from 'vue';

var blockies = require('./util/blockies')
// require('./util/keythereum')
 var Ethers =require('ethers')

var importComponent;

export default class AccountImport {
  constructor( ){

  }

  init(socketClient){
    var self = this;
    self.socketClient = socketClient;

    importComponent = new Vue({
        el: '#import-account',
        data: {
          importType: null,

          privateKeyRaw: null,
          addingPrivateKey: false,
          password: null,

          importedAccount: null,
          keystoreFile: null,
          address: null,
          errorMessage: null

        },
        methods: {
           setImportType: function (type) {
             this.errorMessage = null;
              console.log('import type',type)
              this.importType = type;

              this.importedAccount = false;
              this.keystoreFile = null;
              this.privateKeyRaw = null;
              this.address = null;
              this.addingPrivateKey=false;
              this.password=null;

              self.renderAccount(this.address);
           },
           importRawPrivateKey: async function ( ) {
             this.errorMessage = null;
            //  console.log('import raw key', this.privateKeyRaw );

              if(!this.addingPrivateKey)
              {

                if(this.privateKeyRaw.startsWith('0x')   )
                {
                  this.privateKeyRaw = this.privateKeyRaw.substring(2,this.privateKeyRaw.length)
                }

                if( this.privateKeyRaw.length != 64  )
                {
                  console.log('invalid length')
                  this.errorMessage = 'Invalid key length.'
                  return;
                }

                console.log('valid')
                this.addingPrivateKey = true;
                return;
              }

              if(this.password.length < 6)
              {
                this.errorMessage = 'Minimum password length: 6'
                return
              }

              var options = {};

              //console.log(this.privateKeyRaw)


              var pKey = this.privateKeyRaw;
              var web3Provider = null;
              var passwd = this.password;

              let wallet = new Ethers.Wallet(pKey, web3Provider);

              let encryptedWalletJSON = await wallet.encrypt(passwd);
              let encryptedWallet = JSON.parse(encryptedWalletJSON)


              //fix me

            //  var dk = keythereum.create( );

            //  var keyObject = keythereum.dump(this.password, this.privateKeyRaw, new Buffer(dk.salt), new Buffer(dk.iv), {options});



                 self.renderAccount(encryptedWallet.address);

                 console.log('created acct', encryptedWallet )

                 this.importedAccount = encryptedWalletJSON;


           },


           importKeystoreFile: async function ( ) {
             this.errorMessage = null;
              this.keystoreFile = this.$refs.keystoreFile.files[0]


              var fileContents = await self.readInputFile(this.keystoreFile)





              if(!fileContents.success)
              {
                console.log( 'error!!!!! ')
                this.errorMessage = fileContents.message
                return
              }

              var keyFile = fileContents.file

              this.address = keyFile.address;


              if(!this.address.startsWith('0x')){
                this.address = '0x' + this.address;
              }



                this.importedAccount = JSON.stringify(keyFile);

                self.renderAccount(this.address);


              //var privateKey = keythereum.recover(password, keyObject);
            },
            saveAccount: async function ( ) {
              this.errorMessage = null;
               console.log('save', importComponent.importedAccount )


               var keyObject = importComponent.importedAccount ;


                 //address:importComponent.address,
                // dk:importComponent.dk,
                // password:importComponent.password

                var data = await  self.socketClient.emitToSocket('saveAccount',keyObject);

                 if(data.success)
                 {
                   window.location.href = '/accounts.html'
                 }

            },


         }
      })


  }


  renderAccount(address)
  {
    if(!address)
    {
      return
    }

    if(!address.startsWith('0x')){
      address = '0x' + address;
    }

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

    if(address)
    {
      blockieContainer.appendChild(icon); // icon is a canvas element
    }


  }


  async readInputFile(file)
  {
    var self = this ;

    var response = await new Promise(async (resolve, reject) => {
        if (file.name.endsWith('.json')) {

            var reader = new FileReader();
              // Closure to capture the file information.
              reader.onload = (function(theFile) {
                return function(e) {
                 var parsedFileJson = JSON.parse(e.target.result);

                 resolve(  { success:true, file: parsedFileJson }  );

                // self.initiateLavaPackTransaction( JSON.parse( parsedFileJson) )

                };




              })(file);



            reader.readAsText(file); // start reading the file data.
        }else{
          resolve({success:false, message: 'Wrong filetype (.json)' })
        }

      });

    //  console.log(response)
      return response;

  }


};
