import Web3 from "web3";
import ABI from 'contracts/StatusContract.json';
import React, { useEffect } from "react";


const EventCard = ({ feed }) => {

    let provider = window.ethereum;
    let selectedAccount;

    const eventName = "StatusUpdated";
    const web3 = new Web3(provider);

    const contractAddress = "0xEa081e46f5e3B9f240B1EB71E6b76622DB38a7B6";

    const contract = new web3.eth.Contract(ABI.abi, contractAddress);

    provider.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            selectedAccount = accounts[0];
            console.log(`Selected account for events: ${selectedAccount}`);
        })
        .catch(error => { console.log(error); });

    const getEvents = async () =>{ 

    const events = await contract.getPastEvents(eventName, {
        filter: {},
        fromBlock: 1747337,
        toBlock: "latest",
    });
        console.log(events);

    }

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <p>{ feed }</p>
        )
}
export default EventCard;