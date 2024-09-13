import React, { useState, useRef, useEffect } from 'react';
import './wheel.css';

import userList from '../user-list.json';

import dead from '../images/dead.jpg';
import image1 from '../images/aztec.jpg';
import image2 from '../images/baby.jpg';
import image3 from '../images/bitcoinbills.jpg';
import image4 from '../images/breaker.jpg';
import image5 from '../images/dealer.jpg';
import image6 from '../images/dracula.jpg';
import image7 from '../images/goldencaesar.jpg';
import image8 from '../images/grizzly.jpg';
import image9 from '../images/hypno.jpg';
import image10 from '../images/icepunk.jpg';
import image11 from '../images/king.jpg';
import image12 from '../images/lovingmeatmonster.jpg';
import image13 from '../images/metallicvision.jpg';
import image14 from '../images/patrio.jpg';
import image15 from '../images/pimp.jpg';
import image16 from '../images/queen.jpg';
import image17 from '../images/rich.jpg';
import image18 from '../images/rock.jpg';
import image19 from '../images/roman.jpg';
import image20 from '../images/soph.jpg';
import image21 from '../images/spec.jpg';
import image22 from '../images/swag.jpg';
import image23 from '../images/sweet.jpg';
import image24 from '../images/venom.jpg';
import image25 from '../images/zero.jpg';


const Wheel = ({ winners, jackpotWinner }) => {
  const images = [
    image1, image2, image3, image4, image5, image6, image7,image8, image9, image10, image11, image12, image13, image14, image15, image16,
    image17, image18, image19, image20, image21, image22, image23, image24, image25,
   ];
  const [users] = useState(userList);

  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);

  const [currentWinner, setCurrentWinner] = useState({});

  const [winnerList, setWinnerList] = useState([]);

  const [isMoving, setIsMoving] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const [displayRollWinner, setDisplayRollWinner ] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);

  const [lotteryEnded, setLotteryEnded] = useState(false);
  const [jackpot, setJackpot] = useState(false);

  const numSquares = 25;
  const squareSize = 160;

  // Map users to images
  const userImageMap = users.reduce((acc, user, index) => {
    acc[user.discord] = images[index % images.length];
    return acc;
  }, {});

  const generateRandomSquares = () => {
    return Array.from({ length: numSquares }, (_, index) => {
        const userKeys = Object.keys(userImageMap);
        const randomUser = userKeys[Math.floor(Math.random() * userKeys.length)];
        return {
            isWinner: index === numSquares - 4, // Mark the last square as winner
            image: userImageMap[randomUser],
            name: randomUser
          };
      });
  };

  const [squares, setSquares] = useState(generateRandomSquares());


  const generateJackPotSquares = () => {
    return Array.from({ length: numSquares}, (_, index) => {
      return {
        image: dead,
        name: "dead"
      };
    });
  };

  const startAnimation = () => {
    setNoTransition(false);
    setIsMoving(true);
  };

  const resetAnimation = () => {
    setNoTransition(true);
    setIsMoving(false);
  };

  const handleTransitionEnd = () => {
    setTimeout(() => {
      setDisplayRollWinner([currentWinner, ...displayRollWinner])
    }, 200);
    console.log("animation ended")
    console.log("current winner index", currentWinnerIndex)
    const nextWinnerIndex = currentWinnerIndex + 1;
    console.log("next winner index",nextWinnerIndex)
    if (nextWinnerIndex <= winners.length && nextWinnerIndex < winners.length + 2) {
      // last winner is not being displayed. Update logic
      setCurrentWinnerIndex(nextWinnerIndex);

      setTimeout(() => {
        setShowPopUp(true);
      }, 50);

      setTimeout(() => {
        setShowPopUp(false);
        setSquares(generateRandomSquares());
        resetAnimation();
        resetAndAnimateNextWinner();
      }, 5000);
    } else if (nextWinnerIndex == winners.length + 1 && jackpotWinner.length > 0) {
      console.log("jackpot time")
      // jackpot
      setTimeout(() => {
        setShowPopUp(true);
      }, 50);
      setTimeout(() => {
        setShowPopUp(false);
        setSquares(generateJackPotSquares());
        resetAnimation();
        resetAndAnimateJackpotWinner();
        setJackpot(true);
      }, 5000);
      // call lottery ended something
      setCurrentWinnerIndex(nextWinnerIndex); // so it is over the jackpot index and goes to "else"
    } else if (nextWinnerIndex == winners.length + 1 && jackpotWinner.length == 0) {
      console.log("fake time")
      // jackpot
      setTimeout(() => {
        setShowPopUp(true);
      }, 50);
      setTimeout(() => {
        setShowPopUp(false);
        setSquares(generateJackPotSquares());
        resetAnimation();
        resetAndAnimateFakeJackpot();
        setJackpot(true);
      }, 5000);
      // call lottery ended something
      setCurrentWinnerIndex(nextWinnerIndex); // so it is over the jackpot index and goes to "else"
    } else {
      setTimeout(() => {
        setShowPopUp(true);
      }, 50);
      setTimeout(() => {
        setShowPopUp(false);
        setNoTransition(true);
        setIsMoving(false);
      }, 5000);
      // call lottery ended something
      setCurrentWinnerIndex(nextWinnerIndex);
      removeLotteryEnded();
    }
  };

  const removeLotteryEnded = () => {
    setTimeout(() => {
      setLotteryEnded(true);
      setJackpot(false);
    }, 5000)
  };

  const resetAndAnimateNextWinner = () => {
    console.log("resetting animation")
    const currentWinner = winners[currentWinnerIndex];
    setCurrentWinner(currentWinner)
    setSquares((prevSquares) => 
      prevSquares.map((square, index) => 
        index === numSquares - 4
          ? {
            ...square,
            name: currentWinner.discord,
            image: userImageMap[currentWinner.discord],
            isWinner: true,
          }
        : square
      )
    );

    setTimeout(() => {
      startAnimation();
    }, 500);
  };

  const resetAndAnimateJackpotWinner = () => {
    const currentWinner = jackpotWinner[0];
    setCurrentWinner(currentWinner);
    let newSquares = generateJackPotSquares();
    setSquares((newSquares) => 
      newSquares.map((square, index) => 
        index === numSquares - 4
        ? {
          ...square,
          name: currentWinner.discord,
          image: userImageMap[currentWinner.discord],
          isWinner: true,
        }
        : square
      )
    );

    setTimeout(() => {
      startAnimation();
    }, 50);
  };

  const resetAndAnimateFakeJackpot = () => {
    const currentWinner = {"discord": "dead", "numWinner": "jackpot", "price": "jackpot"}
    setCurrentWinner(currentWinner)
    let newSquares = generateJackPotSquares();
    setSquares((newSquares) => 
      newSquares.map((square, index) => 
        index === numSquares - 4
        ? {
          ...square,
          name: currentWinner.discord,
          image: dead,
          isWinner: true,
        }
        : square
      )
    );

    setTimeout(() => {
      startAnimation();
    }, 50);
  };

  useEffect(() => {
    if (winners.length > 0) {
      //setSquares(generateRandomSquares());
      resetAndAnimateNextWinner();
      setCurrentWinnerIndex(1); // fixes the double draw issue
    }
  }, [winners]);

  return (
    <>
      {/* <div className={`jackpot-deco ${jackpot ? 'jackpot-round': 'dont-show'}`}>Jackpot</div> */}
      { !jackpot && (<div className='round-price'>#{winners?.[currentWinnerIndex - 1]?.numWinner || 0} &nbsp; &nbsp; ${winners?.[currentWinnerIndex - 1]?.price || 0}</div>)}
      { jackpot && (<div className='round-price'>#Jackpot &nbsp; &nbsp; $Jackpot</div>)}
      <div className={`winner-popup ${showPopUp ? 'show': ''}`}>
        <div className='pop-image-container'>
          <img className='pop-image' src={userImageMap[currentWinner.discord] || dead} style={userImageMap[currentWinner.discord] ? {} : {height: '' }} alt={currentWinner.discord}></img>
        </div>
        <div className='winner-text pop'>#{currentWinner.numWinner}</div>
        <div className='winner-text pop'>{currentWinner.discord} </div> 
        <div className='winner-text pop pop-last'>${currentWinner.price}</div>
      </div>
        <div className={`final ${lotteryEnded ? '' : 'final-show'}`}>Winner winner chicken dinner...</div>
        <div className={`container ${lotteryEnded ? 'container-hide' : '' } ${jackpot ? 'jackpot-round dark': ''}`}>
        <div style={{ position: "absolute", left: "50%", top: "0px", width: "2px", height: "160px", background: "yellow", zIndex: "900" }}></div>
            <div onTransitionEnd={handleTransitionEnd} style={{transform: `${isMoving ? `translateX(-75%)` : '' } `}} className={`large-div ${noTransition ? 'no-transition' : ''}`}>
                {squares.map((square, index) => (
                  <div className='user-div'
                  key={index}                         
                  style={{
                    width: `${squareSize}px`,
                    height: `${squareSize}px`,
                    left: `${index * squareSize}px`,
                }}>
                    <div className='image-container'> 
                      <img src={square.image}
                              alt={square.name}
                              className="square-image"
                        >
                        </img>
                    </div>
                    <div className={`square ${square.isWinner ? 'winner' : ''}`}>
                        {square.isWinner ? <span className="name">{square.name}</span> : <span className="name">{square.name}</span>}
                    </div>
                  </div>
                ))}
            </div>
        </div>
        <div>
          {displayRollWinner.length > 0 && (
            <div className='winner-container'>
              {displayRollWinner.map((winner, index ) => (
                <div className='winner-card' key={index}>
                  <div className='winner-image-container'>
                    <img className='winner-image' alt={winner.discord} src={userImageMap[winner.discord] || dead} style={userImageMap[winner.discord] ? {} : {height: '80px' }}></img>
                  </div>
                  <div className='winner-text number'><span>#{winner.numWinner}</span></div>
                  <div className='winner-text winner-name'><span>{winner.discord} </span></div>
                  <div className='winner-text last'><span>${winner.price}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
};

export default Wheel;
