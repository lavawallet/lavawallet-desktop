
const Tx = require('ethereumjs-tx')

const walletContractJSON = require('../../../../lib/contracts/LavaWallet.json');
const approveCallTokenContractJSON = require('../../../../lib/contracts/_0xBitcoinToken.json');

const tokenContractJSON = require('../../../../lib/contracts/ERC20Interface.json');
 //const deployedContractInfo = require('../../../../lib/contracts/DeployedContractInfo.json');


module.exports = class ContractInterface  {


  //getWalletContract(web3,env).methods.signatureBurned('lalala').call()

  static getContract(web3,env,contractName,contractAddress)
  {
    if(contractName == 'erc20token')
    {
      return new web3.eth.Contract(tokenContractJSON.abi,contractAddress)
    }

    if(contractName == 'erc20token_approveAndCall')
    {
      return new web3.eth.Contract(approveCallTokenContractJSON.abi,contractAddress)
    }

    if(contractName == 'lavawallet')
    {
      return new web3.eth.Contract(walletContractJSON.abi,contractAddress)
    }
  }

  static getTokenContract(web3,env,address)
  {
    if(!address)
    {
      address = ContractInterface.getTokenContractAddress(env);
    }

    return new web3.eth.Contract(tokenContractJSON.abi,address)
  }

  static getWalletContract(web3,env,address)
  {
    if(!address)
    {
      address = ContractInterface.getWalletContractAddress(env);
    }

    return new web3.eth.Contract(walletContractJSON.abi,address)
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
