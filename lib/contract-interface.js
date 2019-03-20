
const Tx = require('ethereumjs-tx')

const lavaContractJSON = require('./contracts/LavaToken.json');
//const approveCallTokenContractJSON = require('../../../../lib/contracts/_0xBitcoinToken.json');

const tokenContractJSON = require('./contracts/ERC20Interface.json');
 //const deployedContractInfo = require('../../../../lib/contracts/DeployedContractInfo.json');
 var Ethers =require('ethers')

module.exports = class ContractInterface  {


  //getWalletContract(web3,env).methods.signatureBurned('lalala').call()

  static getContract(web3Provider,env,contractName,contractAddress)
  {
    if(contractName == 'erc20token')
    {
        return new Ethers.Contract(address, tokenContractJSON.abi, web3Provider);
    }

    if(contractName == 'erc20token_approveAndCall')
    {
        return new Ethers.Contract(address, approveCallTokenContractJSON.abi, web3Provider);  
    }

    if(contractName == 'lava')
    {
      return new Ethers.Contract(address, lavaContractJSON.abi, web3Provider);
    }
  }

  static getTokenContract(web3Provider,address)
  {
    return new Ethers.Contract(address, tokenContractJSON.abi, web3Provider);
  }

  static getLavaContract(web3Provider, address)
  {
    return new Ethers.Contract(address, lavaContractJSON.abi, web3Provider);
  }


/*  static getTokenContractAddress(env)
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

  }*/

}
