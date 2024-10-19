import React, { useState, useEffect, useRef } from 'react';
import './wheelNEW.css';

import userList from '../user-list.json';

import image1 from '../images/bitcoinbills.jpg';
import image2 from '../images/goldencaesar.jpg';
import image3 from '../images/icepunk.jpg';
import image4 from '../images/lovingmeatmonster.jpg';
import image5 from '../images/metallicvision.jpg';
import image6 from '../images/zero.jpg';

const Wheel = () => {
  const images = [image1, image2, image3, image4, image5, image6];
  const [users] = useState(userList);

  const [positions, setPositions] = useState([]);
  const [speed, setSpeed] = useState(1); // Initial slow speed
  const [rolling, setRolling] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Map users to images
  const userImageMap = users.reduce((acc, user, index) => {
    acc[user.discord] = images[index % images.length];
    return acc;
  }, {});

  // Initialize the div positions
  useEffect(() => {
    const initialPositions = Array.from({ length: 11 }, (_, i) => ({
      id: i,
      name: userList[Math.floor(Math.random() * userList.length)].discord,
      image: userImageMap[name],
      x: i * 100 // Div size is 100px
    }));
    setPositions(initialPositions);

    // Start the divs moving slowly on load
    setRolling(true);
  }, []);

  // Start movement of divs
  useEffect(() => {
    if (rolling) {
      intervalRef.current = setInterval(() => {
        moveDivs();
      }, 16); // 60 FPS for smooth animation (~16ms per frame)
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [rolling, speed]);

  const moveDivs = () => {
    setPositions(prevPositions => {
      const containerWidth = 1000;
      const newPositions = prevPositions.map((div) => ({
        ...div,
        x: div.x - speed
      }));

      // Check if a div has moved out of view
      if (newPositions[0].x <= -100) {
        newPositions.shift(); // Remove the first div
        newPositions.push({
          id: newPositions[newPositions.length - 1].id + 1,
          name: userList[Math.floor(Math.random() * userList.length)].discord,
          x: newPositions[newPositions.length - 1].x + 100 // Add a new div at the right end
        });
      }
      return newPositions;
    });
  };

  // Rolling function: gradually speed up and slow down
  const roll = () => {
    setRolling(true);
    let tempSpeed = 20; // Initial fast speed
    const rollDuration = 3000; // Time before slowing down (3 seconds)

    // Gradually increase speed and then slow down
    setSpeed(tempSpeed);
    setTimeout(() => {
      const decelerate = setInterval(() => {
        if (tempSpeed > 1) {
          tempSpeed *= 0.97; // Slow down slightly (2% reduction per interval)
          setSpeed(tempSpeed);
        } else {
          clearInterval(decelerate);
          setRolling(false);
          setSpeed(1); // Reset speed to initial slow movement
        }
      }, 100); // Reduce speed every 100ms
    }, rollDuration);
  };

  // Find the div closest to the center of the container
  const findCenteredDiv = () => {
    const containerCenter = 1000 / 2; // Center point of container

    if (positions.length === 0) return ""; // Ensure positions exist

    let closestDiv = positions[0];
    let minDistance = Math.abs(closestDiv.x + 50 - containerCenter); // Distance to center of div

    positions.forEach(div => {
      const distance = Math.abs(div.x + 50 - containerCenter); // Center of div
      if (distance < minDistance) {
        minDistance = distance;
        closestDiv = div;
      }
    });
    return closestDiv ? closestDiv.name : ""; // Return name of centered div or empty string
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '1000px',
          height: '100px',
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid black',
          marginBottom: '20px'
        }}
      >
    <div style={{ position: "absolute", left: "50%", top: "0px", width: "2px", height: "150px", background: "yellow", zIndex: "999" }}></div>
        {positions.map(div => (
          <div
            key={div.id}
            style={{
              width: '100px',
              height: '100px',
              position: 'absolute',
              left: `${div.x}px`,
              backgroundColor: 'lightblue',
              border: '1px solid blue',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >            
          <img src={userImageMap[div.name]} alt={div.name} className='user-image'></img>
            {div.name}
          </div>
        ))}
      </div>

      <button onClick={roll}>
        Roll
      </button>

      {!rolling && (
        <div>
          <h3>Centered Div: {findCenteredDiv()}</h3>
        </div>
      )}
    </div>
  );
};

export default Wheel;



// left: calc(50% + 262560px);
// transform: translateX(-275286px) translateZ(0px);
// transition: transform 7500ms cubic-bezier(0.15, 0.8, 0.2, 0.95);

// .css-lt0ylk {
//   display: flex;
//   -webkit-box-align: stretch;
//   align-items: stretch;
//   position: relative;
//   height: 100%;
//   will-change: left, transform, transition;