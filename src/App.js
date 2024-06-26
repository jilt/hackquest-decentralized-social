import logo from './logo400.png';
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from 'contracts/StatusContract.json';
import { set, setStatus } from './Web3Set';
import EventCard from './EventCard';
import './App.css';

function App() {
    const [status, foundStatus] = useState('');
    const [feed, setFeed] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState({});

    // let timeline;

    let selectedAccount;

    let provider;

    const init = async () => {

        // const providerUrl = process.env.INFURA_RPC;

        let provider = window.ethereum;

        if (typeof provider !== 'undefined') {

            // metamask is installed

            provider.request({ method: 'eth_requestAccounts' })
                .then(accounts => {
                    selectedAccount = accounts[0];
                    setAccount(selectedAccount);
                    console.log(`Selected account is: ${selectedAccount}`);
                })
                .catch(error => { console.log(error); });

            provider.on('accountsChanged', function (accounts) {
                selectedAccount = accounts[0];
                setAccount(selectedAccount);
                // console.log(`Selected account is: ${selectedAccount}`);
            });

            const web3 = new Web3(provider);

            const lineaChain = "0xe705";

            // get current metamask network

            const getCurrentChainId = async () => {
                const currentChainId = await web3.eth.getChainId();
                // console.log("current chainId:", currentChainId);
                return currentChainId;
            }

            getCurrentChainId();

            // add Linea Sepholia network to metamask

            const addNetwork = async () => {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        "params": [
                            {
                                "chainId": "0xe705",
                                "chainName": "Linea Sepolia",
                                "rpcUrls": [
                                    "https://rpc.sepolia.linea.build"
                                ],
                                "nativeCurrency": {
                                    "name": "ETH",
                                    "symbol": "ETH",
                                    "decimals": 18
                                },
                                "blockExplorerUrls": [
                                    "https://sepolia.lineascan.build/"
                                ]
                            }
                        ]
                    });
                } catch (err) {
                    console.log(`error occured while adding new chain, err: ${err.message}`)
                }
            }

            // switch to Linea Sepolia on metamask

            const switchNetwork = async (chainId) => {
                const currentChainId = await web3.eth.getChainId();
                if (currentChainId !== chainId) {
                    try {
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: Web3.utils.toHex(chainId) }]
                        });
                        console.log(`switched to chainid : ${chainId} succesfully`);
                    } catch (err) {
                        console.log(`error occured while switching chain to chainId ${chainId}, err: ${err.message} code: ${err.code}`);
                        if (err.code === 4902) {
                            addNetwork();
                        }
                    }
                }
            }

            await switchNetwork(lineaChain);

            const contractAddress = "0xEa081e46f5e3B9f240B1EB71E6b76622DB38a7B6";

            let contract = new web3.eth.Contract(ABI.abi, contractAddress);

            setContract(contract);

        };

    };

    const isValidAddress = (adr) => {
        try {
            const web3 = new Web3()
            web3.utils.toChecksumAddress(adr)
            return true
        } catch (e) {
            return false
        }
    }

    const getStatus = async (contract, account) => {

        let isValid = await isValidAddress(account);
        if (isValid) {
            try {
                let timeline = await contract.methods.getStatus(account).call();
                setFeed(timeline);
                let previous = await contract.methods.statuses(account).call();
                foundStatus(previous);
            } catch (error) {
                console.log(error);
                return error;
            }
        }
    };

    useEffect(() => {
        set(provider);
    }, []);

  return (
      <div className="App">
          { account.length > 1 ? <>
      <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <br /><br />
                  <button onClick={() => getStatus(contract, account)}>Get Status</button>
       </header>
          <textarea
              className="App-status"
              value={newStatus}
              onChange={(e) => {
                  setNewStatus(e.target.value)
              }}
              placeholder="Enter your status (less than 140 characters)"
          />
          <br /><br />
              {!newStatus ? <button onClick={() => setStatus(newStatus, account)} disabled>Set Status</button> : <button onClick={() => setStatus(newStatus, account)}>Set Status</button>}

              {!feed ? <div className="alert">Click "Get Status"</div> : <div className="timeline"><EventCard feed={feed} address={account} /></div>}
          </> : <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br /><br />
        <button onClick={() => init()}>Connect</button>
    </header>}
    </div>
  );
};

export default App;