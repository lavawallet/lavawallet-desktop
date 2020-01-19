
const Tx = require('ethereumjs-tx')

const lavaContractJSON = require('./contracts/LavaWallet.json');
const nametagContractJSON = require('./contracts/NametagToken.json');

//const approveCallTokenContractJSON = require('../../../../lib/contracts/_0xBitcoinToken.json');

const tokenContractJSON = require('./contracts/ERC20Interface.json');
 //const deployedContractInfo = require('../../../../lib/contracts/DeployedContractInfo.json');
 const deployedContractInfo = require('./contracts/DeployedContractInfo.json');
var Ethers =require('ethers')



module.exports = class ContractInterface  {


  //getWalletContract(web3,env).methods.signatureBurned('lalala').call()

  static getContract(web3Provider,env,contractName,contractAddress)
  {
    if(contractName == 'erc20token')
    {
        return new Ethers.Contract(contractAddress, tokenContractJSON.abi, web3Provider);
    }

    if(contractName == 'erc20token_approveAndCall')
    {
        return new Ethers.Contract(contractAddress, approveCallTokenContractJSON.abi, web3Provider);
    }

    if(contractName == 'lava')
    {
      return new Ethers.Contract(contractAddress, lavaContractJSON.abi, web3Provider);
    }
  }

  static getSimpleTokenContract(web3Provider,address)
  {


    return new Ethers.Contract(address, tokenContractJSON.abi, web3Provider);
  }



//below is broken
/*  static getTokenContract(web3Provider,env)
  {
    var address = ContractInterface.getTokenContractAddress(env)


    return new Ethers.Contract(address, tokenContractJSON.abi, web3Provider);
  }*/


  static getLavaContract(web3Provider, env)
  {
    var address = ContractInterface.getLavaContractAddress(env)

    console.log('address ', address)

    return new Ethers.Contract(address, lavaContractJSON.abi, web3Provider);
  }


  static getNametagContract(web3Provider, env)
  {
    var address = ContractInterface.getNametagContractAddress(env)


    return new Ethers.Contract(address, nametagContractJSON.abi, web3Provider);
  }

/*
  static getTokenContractAddress(env)
  {
    if(env == 'development')
    {
      return deployedContractInfo.networks.testnet.contracts.lavatoken.blockchain_address;
    }else if(env == 'staging'){
      return deployedContractInfo.networks.staging.contracts.lavatoken.blockchain_address;
    }else{
      return deployedContractInfo.networks.mainnet.contracts.lavatoken.blockchain_address;
    }

  }*/


  static getLavaContractAddress(env)
  {
    if(env == 'development')
    {
      return deployedContractInfo.networks.testnet.contracts.lavawallet.blockchain_address;
    }else if(env == 'staging'){
      return deployedContractInfo.networks.staging.contracts.lavawallet.blockchain_address;
    }else{
      return deployedContractInfo.networks.mainnet.contracts.lavawallet.blockchain_address;
    }

  }


static getNametagContractAddress(env)
{
  if(env == 'development')
  {
    return deployedContractInfo.networks.testnet.contracts.nametagtoken.blockchain_address;
  }else if(env == 'staging'){
    return deployedContractInfo.networks.staging.contracts.nametagtoken.blockchain_address;
  }else{
    return deployedContractInfo.networks.mainnet.contracts.nametagtoken.blockchain_address;
  }

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
