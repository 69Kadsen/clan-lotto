import './App.css';
import Wheel from './components/wheel';
import Stakers from './components/stakers';
import { useState } from 'react';
import { draw } from './components/draw'; // Import the draw function

import userList from './user-list.json';

function App() {

  const [winners, setWinners] = useState([]);
  const [jpWinner, setJpWinner] = useState([]);

  const [activeTab, setActiveTab] = useState('home');

  const TotalPricePool = 950;
  const amountOfWinner = 25;
  const jackpotChance = 0.1;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const handleDrawWinners = () => {
    const jackpot = Math.random() < jackpotChance;
    const [drawnWinners, jackpotWinner] = draw(userList, amountOfWinner, TotalPricePool, jackpot); // Call the draw function
    console.log("drawn Winners",drawnWinners)
    console.log("jackpot winner", jackpotWinner)
    let reversedWinners = [...drawnWinners]
    reversedWinners.reverse();
    setWinners(reversedWinners);
    setJpWinner(jackpotWinner)
  };


  const lottery = () => {
    
    handleDrawWinners()
    console.log("winner drawn!")

    // call the animation

  };

  return (
    <div className="App">
      <header>
        <div className='header'><h1>Rollbit Clan Event Lottery Edition</h1></div>
      </header>
      <div className='wrapper' id='wrapper'>
        <div className='button-container'>
          <button className='myButton' onClick={() => handleTabChange('home')}>Home</button>
          <button className='myButton' onClick={() => handleTabChange('stakers')}>Stakers</button>
          <button className='myButton start' onClick={() => lottery()}>Start</button>
        </div>
      <h1 className='pool-text' >Lottery Prize Pool: ${TotalPricePool}</h1>
        <div className='wheel-container'>
          {activeTab === 'home' && <Wheel winners={winners} jackpotWinner={jpWinner}></Wheel>}
          {activeTab === 'stakers' && <Stakers userList={userList}></Stakers>}
        </div>
      </div>
    </div>
  );
}

export default App;
