import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import WRHeader from 'wrcomponents/dist/WRHeader';
import WRFooter from 'wrcomponents/dist/WRFooter';
import WRInfo from 'wrcomponents/dist/WRInfo';
import WRContent from 'wrcomponents/dist/WRContent';
import WRTools from 'wrcomponents/dist/WRTools';
import { ethers } from "ethers";
import './App.css';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {


  const [popCornBalance, setPopCornBalance] = useState('');
  const [owner, setOwner] = useState('');
  const [price, setPrice] = useState('');
  const [balanceWei, setBalanceWei] = useState('');
  const [qtd, setQtd] = useState('');
  const [topUp, setTopUp] = useState('');


  
  const addressContract = '0x5576E589370fC616A197994F2997D1DDBb43c0Ea';

  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialBalance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "popCornBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "popCornsEachUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "price",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "topUp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "buyPopCorn",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "givePopCorn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAmountPopCorn",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getBalanceWei",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "machineBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

  let contractDeployed = null;
  let contractDeployedSigner = null;
  
  useEffect(() => {

    getData()
    
  }, [])
  

  function getProvider(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (contractDeployed == null){
      contractDeployed = new ethers.Contract(addressContract, abi, provider)
    }
    if (contractDeployedSigner == null){
      contractDeployedSigner = new ethers.Contract(addressContract, abi, provider.getSigner());
    }
  }

  function toastMessage(text) {
    toast.info(text)  ;
  }

  async function getData() {
    getProvider();
    setBalanceWei(await contractDeployed.getBalanceWei());
    setPrice(await contractDeployed.price());
    setPopCornBalance(await contractDeployed.popCornBalance());
    setOwner(await contractDeployed.owner());

  }
 
  async function handleTopUp(amountPopCorn){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.topUp(amountPopCorn);  
      toastMessage("Top upped.")
    } catch (error) {
      toastMessage(error.data.message);
    }
  }

  async function handleBuy(amount){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.buyPopCorn(amount , {value: amount * price});  
      toastMessage("Pop corn bought. Congrats")
    } catch (error) {
      toastMessage(error.data.message);
    }
  }

  async function handleGetBalance(userAddress){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.getAmountPopCorn();  
      toastMessage(`Your balance is ${resp}`);
    } catch (error) {

    }
  }

  async function handleGivePopCorn(){
    getProvider();
    try {
      const resp  = await contractDeployedSigner.givePopCorn();  
      toastMessage(`You get your popcorn. Congrats!`);
    } catch (error) {
    }
  }


  return (
    <div className="App">
           <ToastContainer position="top-center" autoClose={5000}/>
      <WRHeader title="Pop Corn Machine" image={true} />
      <WRInfo chain="Goerli testnet" />
      <WRContent>
 
        {owner == '' ?
          <>
            <button onClick={getData}>Load data from blockchain</button>
          </>
          : 
          <>
          <h2>PopCorn Contract Info</h2>
          <h5>Owner: {(owner).toString()}</h5>
          <h5>Contract balance (wei): {(balanceWei).toString()}</h5>
          <h5>Pop corn balance: {(popCornBalance).toString()}</h5>
          <h5>Unit. Price: {(price).toString()}</h5>
          <hr/>

          <h2>TopUp (only owner)</h2>
          <input type="text" placeholder="Qtd to top up" onChange={(e) => setTopUp(e.target.value)} value={topUp}/>
          <button onClick={() => handleTopUp(topUp)}>Top Up</button>

          <hr/>
          <h2>Buy Pop Corn</h2>
          <input type="text" placeholder="Pop Corn Quantity" onChange={(e) => setQtd(e.target.value)} value={qtd}/>
          <button onClick={() => handleBuy(qtd)}>Buy</button>
          
          <hr/>
          <h2>Get your popcorn balance</h2>
          <button onClick={handleGetBalance} >Get Balance</button>
          <hr/>

          <h2>Get popcorn to eat</h2>
          <button onClick={handleGivePopCorn} >Get</button>
          </>

          
        }
        
      </WRContent>
      <WRTools react={true} truffle={true} bootstrap={true} solidity={true} css={true} javascript={true} ganache={true} ethersjs={true} />
      <WRFooter />    
    </div>
  );
}

export default App;
