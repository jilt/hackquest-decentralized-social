


export const init = async () => {

    const providerUrl = process.env.INFURA_RPC;

    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {

        // metamask is installed

        provider.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                selectedAccount = accounts[0];
                console.log(`Selected account is: ${selectedAccount}`);
            })
            .catch(error => { console.log(error); });

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0];
            console.log(`Selected account is: ${selectedAccount}`);
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

        const contractAddress ="0xEa081e46f5e3B9f240B1EB71E6b76622DB38a7B6";

        contract = new web3.eth.Contract(ABI.abi, contractAddress);

        };   

    };

