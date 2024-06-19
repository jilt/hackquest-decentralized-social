import Web3 from "web3";
import ABI from 'contracts/StatusContract.json';

let selectedAccount;

let contract;

export const init1 = async () => {

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

        const contractAddress ="0xEa081e46f5e3B9f240B1EB71E6b76622DB38a7B6";

        contract = new web3.eth.Contract(ABI.abi, contractAddress);

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

export const setStatus = async (newStatus) => {
    let isValid = await isValidAddress(selectedAccount);
    if (isValid) {
        try {
            await contract.methods.setStatus(newStatus).send({ from: selectedAccount });
            console.log(newStatus)
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};
