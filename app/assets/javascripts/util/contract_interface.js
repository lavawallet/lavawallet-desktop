
const Tx = require('ethereumjs-tx')

const walletContractJSON = require('../../../../lib/contracts/LavaWallet.json');
const approveCallTokenContractJSON = require('../../../../lib/contracts/_0xBitcoinToken.json');

const tokenContractJSON = require('../../../../lib/contracts/ERC20Interface.json');
//const deployedContractInfo = require('../../../../lib/contracts/DeployedContractInfo.json');


module.exports = class ContractInterface  {


  //getWalletContract(web3,env).methods.signatureBurned('lalala').call()



  static getTokenContract(web3,env)
  {
    return new web3.eth.Contract(tokenContractJSON.abi,ContractInterface.getTokenContractAddress(env))
  }

  static getWalletContract(web3,env)
  {
    return new web3.eth.Contract(walletContractJSON.abi,ContractInterface.getWalletContractAddress(env))
  }


  static getTokenContractAddress(env)
  {
    if(env == 'ropsten')
    {
      return deployedContractInfo.networks.testnet.contracts._0xbitcointoken.blockchain_address;
    }else if(env == 'mainnet'){
      return deployedContractInfo.networks.mainnet.contracts._0xbitcointoken.blockchain_address;
    }

  }
  static getWalletContractAddress(env)
  {
    if(env == 'ropsten')
    {
      return deployedContractInfo.networks.testnet.contracts.lavawallet.blockchain_address;
    }else if(env == 'mainnet'){
      return deployedContractInfo.networks.mainnet.contracts.lavawallet.blockchain_address;
    }

  }

}
