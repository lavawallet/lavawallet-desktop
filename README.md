# LavaWallet (Desktop)


![image](https://user-images.githubusercontent.com/38132633/42248915-2f98be9c-7ef6-11e8-9a46-68c2c0f4ea35.png)
![image](https://user-images.githubusercontent.com/38132633/42248914-2d7dc512-7ef6-11e8-87dc-ab63b626f468.png)


LIB TO ADD : ?
var ethers = require('ethers');


## TODO
1. Finish sidebar for monitoring TX
2. Finish sidebar for signing EIP712 packets





## To Use

##### Linux:
 - Install nodejs 8
 - Run the following commands:
```bash
# Install dependencies
npm install
# Compile
npm run webpack
# Run the app
npm run app
```
##### Windows:
 - Install nodejs 8 from [here](https://nodejs.org/en/download/)
 - From administrative powershell window, run `npm install --global --production windows-build-tools`
 - Run `npm config set msvs_version 2015 --global`
 - Close and re-open your terminal window
 - Navigate to the project folder, run the following:
 - `npm install`
 - `npm run webpack` NOTE: if you receive "Error: ENOENT: no such file or directory, scandir", check TROUBLESHOOTING section.
 - `npm run app` NOTE: if you receive "Error: A dynamic link library (DLL) initialization routine failed.", check TROUBLESHOOTING section.


# Developer TODO
1. Finish the transfer tab

2. Integrate lava balance and lava transfers




### Menus

-Home
* Create New Account
* Import Existing Eth Account From PKey

* Watch an Account (addressbook) -- Addressbook is a part of 'home' ?
* Show contract address for active token

-Accounts
* There is a sidebar along the left with nice icons , like photon demo
* Right side shows the deposit address and helps you fill the acct, button for deposit to lava
* shows vanilla balance and lava balance

-Transfer
*

-Settings  (also accessible from home)
* Lets you edit the 'active token' address - the primary token the wallet uses




## TROUBLESHOOTING:
 - If during `npm run webpack` you get "Error: ENOENT: no such file or directory, scandir", then delete your `node\_modules` folder and re-run `npm install`
 - If during `npm run app` you get "Error: A dynamic link library (DLL) initialization routine failed", then you need to install the native electron modules (full info [here](https://electronjs.org/docs/tutorial/using-native-node-modules)). TLDR; first run `npm install --save-dev electron-rebuild`, then run `./node_modules/.bin/electron-rebuild`. Note that you may need to run `./node_modules/.bin/electron-rebuild` again after each time you run `npm install`.


## License

[CC0 1.0 (Public Domain)](LICENSE.md)
