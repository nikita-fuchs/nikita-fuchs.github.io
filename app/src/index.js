import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/MetaCoin.json";
import contract from 'truffle-contract';



const App = {
  web3: null,
  account: null,
  meta: null,
  accounts: [],
  paymentContract: null,
  instance: null,

  start: async function() {
    //const { web3 } = this;


    if (typeof window.web3 === 'undefined' || (typeof window.ethereum !== 'undefined')) {
      try {
        await ethereum.enable();
      } catch(error) {
        console.log("Metamask Permission denied: ", error)
      }

      this.web3Provider = window.ethereum || window.web3;
      console.log(this.web3Provider);
      window.web3 = new Web3(this.web3Provider);
    } else {
      this.web3Provider = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
      // if you are using linix or ganche cli maybe the port is  http://localhost:8545
      //   Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      //   this.web3Provider = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/Private_key'));
      // Change with your credentials as the test network and private key in infura.io
       }

    // fetch accounts and balance
    await App.refreshAccounts();
    
    // fetch network ID 
    await App.fetchNetworkId();
    
    // create a contract instance
    this.paymentContract = contract(metaCoinArtifact);
    
    // set a connection provider for the contract
    this.paymentContract.setProvider(this.web3Provider);
    
    // create a reference for use when calling contract functions
    this.instance = await this.paymentContract.deployed();

    /* // set a default "from"
    this.paymentContract.defaults({from: this.accounts[0]}); */
    
    await App.refreshTokenBalance();
  },

  refreshAccounts: async function() {

    try{
      var fetchedAccounts = await window.web3.eth.getAccounts();
    } catch (error) {
      console.warn('There was an error fetching your accounts -  is metamask installed ? ');
      console.log(error);
      return;
    }

    // Get the initial account balance so it can be displayed.
    if (fetchedAccounts.length === 0) {
      console.warn('Couldn\'t get any accounts! Is metamask active?');
      return;
    }

    if (!this.accounts || this.accounts.length !== fetchedAccounts.length || this.accounts[0] !== fetchedAccounts[0]) {
      console.log('Observed new accounts');
      console.log("found account: ", fetchedAccounts)
      this.accounts= fetchedAccounts;
      this.account = fetchedAccounts[0];
      const accountElement = document.getElementsByClassName("account")[0];
      accountElement.innerHTML = this.account;

    }
  },

  fetchNetworkId: async function() {

    try{
      var fetchedID = await web3.eth.net.getId();
    } catch (error) {
      console.warn('There was an error fetching your accounts -  is metamask installed ? ');
      console.log(error);
      return;
    }
    console.log("Network ID? ", fetchedID);
  },

  // refreshing token balance
  refreshTokenBalance: async function() {

    let result;
    try{ 
      // call the token contract function
      result = await this.instance.getBalance(this.account, {from: this.account});
      console.log("Token balance is: ", result)
    } catch(error){
      console.log("Oh no, there was an error fetching balance: ", error)
    }
    
    // update HTML
    let METAbalance = document.getElementsByClassName("balance")[0];
    METAbalance.innerHTML = result;


    /* const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance; */
  },



  

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    // do token transfer transaction here
    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;





window.addEventListener("load", function() {

 /*  if (typeof window.web3 === 'undefined' || (typeof window.ethereum !== 'undefined')) {
    this.web3Provider = window.ethereum || window.web3;
    console.log(this.web3Provider);
    window.web3 = new Web3(this.web3Provider);
  } else {
    this.web3Provider = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
    // if you are using linix or ganche cli maybe the port is  http://localhost:8545
    //   Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    //   this.web3Provider = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/Private_key'));
    // Change with your credentials as the test network and private key in infura.io
     } */

    /* this.paymentContract = contract(metaCoinArtifact.abi);
    this.console.log("Contract hier? ", paymentContract);
    this.paymentContract.setProvider(this.web3Provider);
    this.console.log("Contract hier? ", paymentContract);
    
    await App.refreshTokenBalance(); */

  App.start();
});
