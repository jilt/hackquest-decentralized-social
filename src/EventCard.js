import Web3 from "web3";
import ABI from 'contracts/StatusContract.json';
import React, { useEffect, useState } from "react";


const EventCard = ({ feed }) => {
    const [events, setEvents] = useState([]);
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

    useEffect(() => {
        const getEvents = async (contract, selectedAccount) => {
            try {
                let events = await contract.getPastEvents(eventName, {
                    filter: {},
                    fromBlock: 1747337,
                    toBlock: "latest"
                });
                let display = events.reverse();
                setEvents(display);
                console.log(display);
            } catch (error) {
                console.log(error);
            }
            // setList(events);
        }
        getEvents(contract, selectedAccount);
    }, []);

    return (
        <>
            <p className="last">{feed}</p>
            <ul className="list">
                {events.map(function (data, index) {
                    return (
                        <li key={index}>
                            {data.returnValues[1]}<span className="date">{ data.blockNumber.toString() }</span>
                        </li>
                    )
                })}
            </ul>
        </>
        )
}
export default EventCard;