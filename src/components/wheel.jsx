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
import { faBorderNone } from '@fortawesome/free-solid-svg-icons';



import bronze1 from '../images/ranks/bronze1.png';
import bronze2 from '../images/ranks/bronze2.png';
import bronze3 from '../images/ranks/bronze3.png';
import bronze4 from '../images/ranks/bronze4.png';
import bronze5 from '../images/ranks/bronze5.png';
import silver1 from '../images/ranks/silver1.png';
import silver2 from '../images/ranks/silver2.png';
import silver3 from '../images/ranks/silver3.png';
import silver4 from '../images/ranks/silver4.png';
import silver5 from '../images/ranks/silver5.png';
import gold1 from '../images/ranks/gold1.png';
import gold2 from '../images/ranks/gold2.png';
import gold3 from '../images/ranks/gold3.png';
import gold4 from '../images/ranks/gold4.png';
import gold5 from '../images/ranks/gold5.png';
import platinum1 from '../images/ranks/platinum1.png';
import platinum2 from '../images/ranks/platinum2.png';
import platinum3 from '../images/ranks/platinum3.png';
import platinum4 from '../images/ranks/platinum4.png';
import platinum5 from '../images/ranks/platinum5.png';
import diamond1 from '../images/ranks/diamond1.png';
import diamond2 from '../images/ranks/diamond2.png';
import diamond3 from '../images/ranks/diamond3.png';
import diamond4 from '../images/ranks/diamond4.png';
import diamond5 from '../images/ranks/diamond5.png';
import blooddiamant from '../images/ranks/blooddiamant.png';
import vibranium from '../images/ranks/vibranium.png';



const Wheel = ({ winners, jackpotWinner }) => {
  const images = [
    image1, image2, image3, image4, image5, image6, image7,image8, image9, image10, image11, image12, image13, image14, image15, image16,
    image17, image18, image19, image20, image21, image22, image23, image24, image25,
   ];

   const rankImages = {
    dead: dead,
    bronze1: bronze1,
    bronze2: bronze2,
    bronze3: bronze3,
    bronze4: bronze4,
    bronze5: bronze5,
    silver1: silver1,
    silver2: silver2,
    silver3: silver3,
    silver4: silver4,
    silver5: silver5,
    gold1: gold1,
    gold2: gold2,
    gold3: gold3,
    gold4: gold4,
    gold5: gold5,
    platinum1: platinum1,
    platinum2: platinum2,
    platinum3: platinum3,
    platinum4: platinum4,
    platinum5: platinum5,
    diamond1: diamond1,
    diamond2: diamond2,
    diamond3: diamond3,
    diamond4: diamond4,
    diamond5: diamond5,
    blooddiamant: blooddiamant,
    vibranium: vibranium,
  };
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
    acc[user.discord] = {
      image: images[index % images.length],
      rankImage: rankImages[user.rank],
      rank: user.rank,
    };
    return acc;
  }, {});

  const generateRandomSquares = () => {
    return Array.from({ length: numSquares }, (_, index) => {
        const userKeys = Object.keys(userImageMap);
        const randomUser = userKeys[Math.floor(Math.random() * userKeys.length)];
        const userInfo = userImageMap[randomUser];
        return {
            isWinner: index === numSquares - 4, // Mark the last square as winner
            image: userInfo.image,
            rankImage: userInfo.rankImage,
            rank: userInfo.rank,
            name: randomUser,
          };
      });
  };

  const [squares, setSquares] = useState(generateRandomSquares());


  const generateJackPotSquares = () => {
    return Array.from({ length: numSquares}, (_, index) => {
      return {
        image: dead,
        rank: dead,
        rankImage: dead,
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
            rank: currentWinner.rank,
            rankImage: rankImages[currentWinner.rank],
            image: userImageMap[currentWinner.discord].image,
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
          rank: currentWinner.rank,
          rankImage: rankImages[currentWinner.rank],
          image: userImageMap[currentWinner.discord].image,
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
          rank: dead,
          rankImage: dead,
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
            <img className='pop-image' src={userImageMap[currentWinner.discord]?.rankImage || dead} style={userImageMap[currentWinner.discord] ? {} : {height: '' }} alt={currentWinner.discord}></img>
        </div>
        <div className='winner-text pop'>#{currentWinner.numWinner}</div>
        <div className='winner-text pop'>{currentWinner.discord} </div> 
        <div className='winner-text pop'>{currentWinner.rank}</div>
        <div className='winner-text pop'>{currentWinner.tickets} Tickets</div>
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
                      {/* <img src={square.rankImage}
                              alt={square.name}
                              className="square-image"
                        >
                        </img> */}
                      <img src={square.rankImage}
                              alt={square.name}
                              className="square-image-rank"
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
                    <img className='winner-image' alt={winner.discord} src={userImageMap[winner.discord]?.rankImage || dead} style={userImageMap[winner.discord] ? {} : {height: '80px' }}></img>
                  </div>
                  <div className='winner-text number'><span>#{winner.numWinner}</span></div>
                  <div className='winner-text winner-name'><span>{winner.discord} </span></div>
                  <div className='winner-text winner-name'><span>{winner.tickets} Tickets</span></div>
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
