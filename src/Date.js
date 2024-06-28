import React, { useEffect, useState } from "react";

const EventDate = ({ timestamp }) => {
    const [day, setDay] = useState('');

    useEffect(() => {

    const convertDate = async (date) => {
        try {
            let converted = new Date(Number(date) * 1000);
            let year = (converted.getUTCFullYear() + 54);
            let month = (converted.getMonth() + 5);
            let day = converted.getDate();
            let hour = converted.getUTCHours();
            let minute = converted.getMinutes();
            console.log(year);
            let newDate = `Created at ${hour}:${minute} on ${day}-${month}-${year}`;
            setDay(newDate);
        } catch (error) { console.log(error); }
        }
        convertDate(timestamp);
    }, []);


    return (
        <>
            <span className="date">{day}</span>
        </>
        )
}
export default EventDate;