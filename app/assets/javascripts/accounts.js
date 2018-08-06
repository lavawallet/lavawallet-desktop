import Vue from 'vue';

var accountsComponent;

import TXHelper from './util/tx_helper.js';

export default class Accounts {
  constructor( ){

  }

  init(socketClient,txSidebar, web3,   contractConfig){
    var self = this;
    self.socketClient = socketClient;

    this.txSidebar=txSidebar;

    this.web3 = web3;
    this.contractConfig=contractConfig;

    var existingActiveAddress = window.sessionStorage.getItem("activeAddress");



     accountsComponent = new Vue({
        el: '#accounts',
        data: {
          accounts: [],

          selectedAccount: null,
          accountPassword: null,
          unlockError: null,

          selectedAddress: existingActiveAddress,

          tokenLoaded:false,
          ethBalance: null,
          tokenBalance: null,
          lavaBalance: null,

          menuMode: 'overview',

          depositAmount: 0,
          withdrawAmount:0,


          flashMessage: null
        },
        created: async function () {
            var accountsList = await self.getAccountsList();
            console.log(accountsList)

            self.renderAccountsList(accountsList)

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
                case 'deposit':

                    var env = self.contractConfig.networkEnvironment;
                    var address = self.contractConfig.tokenAddress;
                    var spender = self.contractConfig.lavaContractAddress;
                    var ethAccount = this.selectedAccount;

                    var accountStatus = {
                      ethBalance: this.ethBalance
                    }

                    var tokenDecimals = parseInt(self.contractConfig.tokenDecimals);

                      console.log('pwr', Math.pow(10,tokenDecimals) )

                    var depositAmount = parseFloat(this.depositAmount);
                    var depositAmountRaw = parseFloat(this.depositAmount) * Math.pow(10,tokenDecimals);

                    console.log('deposit', depositAmount )
                    console.log('deposit amt ', depositAmountRaw)


                    var txCommand = {
                      from: this.selectedAddress,
                      contract: 'erc20token_approveAndCall',
                      to: address,
                      functionName: 'approveAndCall',
                      params: [spender,depositAmountRaw,"0x00"] };

                    self.txSidebar.openSidebar(   );

                    var txOverview = await TXHelper.getOverviewForStandardTransaction( self.web3, env, txCommand , ethAccount, accountStatus );

                    self.txSidebar.openSidebar( txOverview );

                    break;

                case 'withdraw':
                    console.log('withdraw', this.withdrawAmount )
                    var env = self.contractConfig.networkEnvironment;
                    var address = self.contractConfig.lavaContractAddress;
                    var tokenAddress = self.contractConfig.tokenAddress;
                    var ethAccount = this.selectedAccount;

                    var tokenDecimals = parseInt(self.contractConfig.tokenDecimals);

                    var withdrawAmount = parseFloat(this.withdrawAmount) ;
                    var withdrawAmountRaw = parseFloat(this.withdrawAmount) * Math.pow(10,tokenDecimals);

                    var txCommand = {
                      from: this.selectedAddress,
                      contract: 'lavawallet',
                      to: address,
                      functionName: 'withdrawTokens',
                      params: [tokenAddress,withdrawAmountRaw] };

                    console.log('sidebar', self.txSidebar)

                    var txOverview = await TXHelper.getOverviewForStandardTransaction( self.web3, env, txCommand , ethAccount );

                    self.txSidebar.openSidebar(txOverview);

                    break;
                case 'showTxList':

                    self.txSidebar.openSidebar();

                    break;
                default:
                    break;
            }

          },
          setMode: function (modeName) {
            console.log('set mode:', modeName);
            this.menuMode = modeName;

          },
          selectAccount: function (e) {
            // `this` inside methods points to the Vue instance
            console.log('clicked ' +    '!', e.target)

            var target = e.target;
            var address = target.getAttribute('data-address');

            console.log(address)

            this.selectedAccount = null;
            this.accountPassword = null;
            this.selectedAddress = address;
            this.tokenBalance = null;
            this.lavaBalance = null;
            this.ethBalance = null;

            self.renderAccountData(address)

            window.sessionStorage.setItem("activeAddress",address)
            var addr = window.sessionStorage.getItem("activeAddress");
              console.log('adddr',addr);
          },
          async copySelectedAddress()
          {
            var data = await self.socketClient.emitToSocket('copyToClipboard',this.selectedAddress)


            self.flashMessage('Copied to clipboard!')

            console.log('copied to clipboard',data)
          }
         }
      })


  }

  //get balances and QR codes
  async renderAccountData(address)
  {

    Vue.set(accountsComponent, 'tokenLoaded', false )

    console.log('grab acct data ')

    var self=this;
    var accountInfo;

    var data = await self.socketClient.emitToSocket('getAccountInfo',address);

    if(data.success)
    {
      accountInfo = data.accountInfo;
    }



      console.log('account info',accountInfo)



      if(address == accountInfo.userAddress)
      {
        Vue.set(accountsComponent, 'tokenLoaded', true )

        Vue.set(accountsComponent, 'ethBalance', accountInfo.ethBalance )
        Vue.set(accountsComponent, 'tokenBalance', accountInfo.tokenBalance )



        Vue.set(accountsComponent, 'lavaBalance', accountInfo.lavaBalance )
    }



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



  async renderAccountsList(list)
  {
      var accounts = [];

      for(var address of list)
      {
        var acct = {
          address: address
        }

        accounts.push(acct)
      }


      Vue.set(accountsComponent, 'accounts', accounts )
  }


  //this is on the front end , we need to access the backend
  async unlockEthAccount(password)
  {
    var address = accountsComponent.selectedAddress;


    var data = await this.socketClient.emitToSocket('unlockAccount',{address:address,password:password});

    var error = null;

    var account;
    if(data.success)
    {
      account = data.account;


      Vue.set(accountsComponent, 'selectedAccount',  account )

    }else{
      error = data.message;
    }


    Vue.set(accountsComponent, 'unlockError',  error )


    return account;   // address and pkey
  }

  getAccountData(){
    return {
      ethBalance: accountsComponent.ethBalance,
      selectedAddress: accountsComponent.selectedAddress

    }
  }


  async flashMessage(msg)
  {
    Vue.set(accountsComponent, 'flashMessage', 'Copied to clipboard!' )

    await this.sleep(1000)

    Vue.set(accountsComponent, 'flashMessage', null )
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


};
