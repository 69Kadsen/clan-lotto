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