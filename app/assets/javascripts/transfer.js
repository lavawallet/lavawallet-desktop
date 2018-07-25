import Vue from 'vue';

var transferComponent;


import TXHelper from './util/tx_helper.js';

export default class Transfer {
  constructor( ){

  }

  init(socketClient,txSidebar, web3,   contractConfig){
    var self = this;
    self.socketClient = socketClient;

    this.txSidebar=txSidebar;

    this.web3 = web3;
    this.contractConfig=contractConfig;


    var existingActiveAddress = window.sessionStorage.getItem("activeAddress");


     transferComponent = new Vue({
        el: '#transfer',
        data: {
          selectedAccount:null,
          accountPassword:null,
          unlockError: null,

          selectedAddress: existingActiveAddress,
          errorMessage: null,
          menuMode: 'standard',

          tokenLoaded:false,
          ethBalance: null,
          tokenBalance: null,
          lavaBalance: null,


          transferTo: null,
          transferAmount: 0,

          flashMessage: null
        },
        created: async function () {
            var accountsList = await self.getAccountsList();
            console.log(accountsList)


            if(existingActiveAddress)
            {
              self.renderAccountData(existingActiveAddress)
            }


            document.dispatchEvent(new Event('SidenavContentLoaded'));
        },
        updated: function () {
           this.$nextTick(function () {
             self.txSidebar.updateAccountData(self.getAccountData());
           })
         },
        methods: {
           clickButton: async function (buttonName) {
             // `this` inside methods points to the Vue instance
             console.log('clicked ' + buttonName + '!')

             switch(buttonName) {
                case 'addaccount':
                    window.location.href = '/account_add.html'
                    break;
                case 'unlock':
                    this.account = await self.unlockEthAccount(this.accountPassword)

                    console.log( this.account  )
                    break;

                case 'standardTransfer':
                    console.log('standardTransfer', this.standardTransferAmount )
                    var env = self.contractConfig.networkEnvironment;
                     var addressTo = this.transferTo;
                    var tokenAddress = self.contractConfig.tokenAddress;
                    var ethAccount = this.selectedAccount;

                    var tokenDecimals = parseInt(self.contractConfig.tokenDecimals);

                    var transferAmount = parseFloat(this.transferAmount) ;
                    var transferAmountRaw = parseFloat(this.transferAmount) * Math.pow(10,tokenDecimals);

                    var txCommand = {
                      from: this.selectedAddress,
                      contract: 'erc20token',
                      to: tokenAddress,
                      functionName: 'transfer',
                      params: [addressTo,transferAmountRaw] };

                    console.log('sidebar', self.txSidebar)

                    var txOverview = await TXHelper.getOverviewForStandardTransaction( self.web3, env, txCommand , ethAccount );

                    self.txSidebar.openSidebar(txOverview);

                    break;

                default:
                    break;
            }

          },
          setMode: function(modeName)
          {
            this.menuMode = modeName;
          }

         }
      })


  }





    async getAccountsList()
    {
      var self = this;

      console.log('get acct list', self.socketClient)
      var data =  await self.socketClient.emitToSocket('listStoredAccounts',null);

      console.log('get acct list',  data)


      var list;

      if(data.success)
      {
        list = data.list;
      }



        return list;
    }



  async renderAccountData(address)
  {

    Vue.set(transferComponent, 'tokenLoaded', false )

    console.log('grab acct data ')

    var self=this;
    var accountInfo;

    var data = await self.socketClient.emitToSocket('getAccountInfo',address);

    if(data.success)
    {
      accountInfo = data.accountInfo;
    }



      console.log('account info',accountInfo)


        Vue.set(transferComponent, 'tokenLoaded', true )

      if(address.toString() == accountInfo.userAddress.toString())
      {
      //    Vue.set(transferComponent, 'tokenLoaded', true )

        Vue.set(transferComponent, 'ethBalance', accountInfo.ethBalance )
        Vue.set(transferComponent, 'tokenBalance', accountInfo.tokenBalance )



        Vue.set(transferComponent, 'lavaBalance', accountInfo.lavaBalance )
    }



  }

  getAccountData(){
    return {
      ethBalance: transferComponent.ethBalance,
      selectedAddress: transferComponent.selectedAddress

    }
  }



  //this is on the front end , we need to access the backend
  async unlockEthAccount(password)
  {
    var address = transferComponent.selectedAddress;


    var data = await this.socketClient.emitToSocket('unlockAccount',{address:address,password:password});

    var error = null;

    var account;
    if(data.success)
    {
      account = data.account;


      Vue.set(transferComponent, 'selectedAccount',  account )

    }else{
      error = data.message;
    }


    Vue.set(transferComponent, 'unlockError',  error )


    return account;   // address and pkey
  }


};
