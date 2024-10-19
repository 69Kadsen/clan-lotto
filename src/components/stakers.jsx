import React, { useState, useRef, useEffect } from 'react';
import './stakers.css';

const Stakers = ({userList}) => {

    let totalTickets = 0;

    for (let i = 0; i < userList.length; i++) {
        totalTickets += userList[i].tickets;
    }

    return(
        <>
        <script src="https://kit.fontawesome.com/07d009a8bf.js" crossorigin="anonymous"></script>
        <h1>Data</h1>
        <br></br>
        <p>The Chance of winning is simply calculated by your Tickets / All tickets. <br></br> The actualy chance to win a price is higher since the reamining tickets from each winner get taken out of the pool<br></br> and their are 25 rounds total.</p>
            <br></br>
            <h1><p>Total Tickets: {totalTickets}</p></h1>
            <div className='stakers-container'>
                {userList.map((item, index) => (
                <div className='stakers' key={index}>
                    <div className='tickets'>{item.tickets}</div>
                    <div className='name-text'><span>{item.discord}</span></div>
                    <div className='chance-text'><span>{(item.tickets / totalTickets * 100).toFixed(2)} Chance of Winning</span></div>
                </div>
                ))}
            </div>
        </>
    )
}


export default Stakers