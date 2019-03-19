import Vue from 'vue';

var transferComponent;

var web3utils =  require('web3-utils');
//var lavaUtils = require("./util/lava-utils");

import TXHelper from './util/tx_helper.js';

var LavaPacketUtils =  require('lava-packet-utils');
import  LavaPacketHelper from './util/lava-packet-helper'
//import LavaPacketUtils from 'lava-packet-utils';

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
          menuMode: 'lava',

          tokenLoaded:false,
          ethBalance: null,
          tokenBalance: null,
          //lavaBalance: null,


          transferTo: null,
          transferTokenMethod: 'transfer',
          transferAmount: 0,
          relayerReward: 0,

          expirationBlock: 0,

          relayNodeURL: contractConfig.lavaRelayURL,
          relayResponse: null,
          packetData: null,
          completeLavaPacket:  null,

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

                    var env = self.contractConfig.networkEnvironment;
                    var addressTo = this.transferTo;
                    var tokenAddress = self.contractConfig.tokenAddress;
                    var ethAccount = this.selectedAccount;

                    var accountStatus = {
                      ethBalance: this.ethBalance
                    }

                    var tokenDecimals = parseInt(self.contractConfig.tokenDecimals);

                    var transferAmount = parseFloat(this.transferAmount) ;
                    var transferAmountRaw = parseFloat(this.transferAmount) * Math.pow(10,tokenDecimals);

                    var txCommand = {
                      from: this.selectedAddress,
                      contract: 'erc20token',
                      to: tokenAddress,
                      functionName: 'transfer',
                      params: [addressTo,transferAmountRaw] };

                  //  self.txSidebar.openSidebar(   );

                    var txOverview = await TXHelper.getOverviewForStandardTransaction( self.web3, env, txCommand , ethAccount, accountStatus );

                    self.txSidebar.openSidebar('transfer', txOverview );

                    break;


                case 'sign':

                  console.log('signing data!!')

                    var env = self.contractConfig.networkEnvironment;
                    var addressTo = this.transferTo;
                  //  var tokenAddress = self.contractConfig.tokenAddress;
                    var lavaContractAddress = self.contractConfig.lavaContractAddress;
                    var ethAccount = this.selectedAccount;




                    var accountStatus = {
                      ethBalance: this.ethBalance,
                      tokenBalance: this.tokenBalance
                    }

                    var tokenDecimals = parseInt(self.contractConfig.tokenDecimals);


                    var transferAmount = parseFloat(this.transferAmount) ;
                    var transferAmountRaw = parseFloat(this.transferAmount) * Math.pow(10,tokenDecimals);

                    var relayAuthority = "0x0000000000000000000000000000000000000000";
                    var method = this.transferTokenMethod;
                    var relayerReward = this.relayerReward;
                    var expires = this.expirationBlock;
                    var nonce = web3utils.randomHex(32);



                    var lavaPacket = LavaPacketUtils.getLavaPacket(
                        method,
                        relayAuthority,
                        this.selectedAddress,
                        addressTo,
                        lavaContractAddress,
                        transferAmountRaw,
                        relayerReward,
                        expires,
                        nonce);

                        console.log(lavaPacket)

                        Vue.set(transferComponent, 'completeLavaPacket', null )
                        Vue.set(transferComponent, 'relayResponse', null )



                    var signatureOverview = await TXHelper.getOverviewForLavaTransaction( self.web3, env, lavaPacket , ethAccount, accountStatus );

                    self.txSidebar.openSidebar( 'signature', signatureOverview, function(completeLavaPacket){


                        Vue.set(transferComponent, 'completeLavaPacket', completeLavaPacket )

                      });

                    break;
                case 'showTxList':

                    self.txSidebar.openSidebar();

                    break;
                case 'broadcast':

                     console.log('broadcasting tx !! ')
                     self.broadcastPacket( transferComponent.completeLavaPacket  )

                    break;
                default:
                    break;
            }

          },
          setMode: function(modeName)
          {
            this.menuMode = modeName;
          },
          async copySelectedAddress()
          {
            console.log('socket client')
            var data = await self.socketClient.emitToSocket('copyToClipboard',this.selectedAddress)


            self.flashMessage('Copied to clipboard!')

            console.log('copied to clipboard',data)
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

  async broadcastPacket(lavaPacketData)
  {
    var lavaNodeURL= transferComponent.relayNodeURL;
    var response = await LavaPacketHelper.sendLavaPacket(lavaNodeURL ,lavaPacketData )
    console.log('relay responded with ', response)

    if(response.success)
    {
      Vue.set(transferComponent, 'relayResponse',  'Success!' )
    }else {
      Vue.set(transferComponent, 'relayResponse',  response.message )
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


  async flashMessage(msg)
  {
    Vue.set(transferComponent, 'flashMessage', 'Copied to clipboard!' )

    await this.sleep(1000)

    Vue.set(transferComponent, 'flashMessage', null )
  }


    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

};
