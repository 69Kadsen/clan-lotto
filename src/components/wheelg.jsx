import React, { useState, useEffect, useRef } from 'react';
import userList from '../user-list.json';
import zero from '../images/zero.jpg';

const Wheel = () => {
    const [users] = useState(userList);
    const [divs, setDivs] = useState([]);
    const [speed, setSpeed] = useState(1);
    const [isSpeedingUp, setIsSpeedingUp] = useState(false);
    const [winner, setWinner] = useState(null);

    const parentRef = useRef(null);
    const divsRef = useRef([]);
    const animationFrameId = useRef(null);

    const divSize = 150; // Fixed width for each div

    const getRandomUserImageCombo = () => {
        const randomIndex = Math.floor(Math.random() * users.length);
        const user = users[randomIndex];
        const image = zero; // Adjust path as needed
        return { user, image };
    };

    useEffect(() => {
        const fillContainer = () => {
            if (parentRef.current) {
                const parentWidth = parentRef.current.offsetWidth;
                const numberOfDivs = Math.ceil(parentWidth / divSize) + 1;
                const initialDivs = [];

                for (let i = 0; i < numberOfDivs; i++) {
                    const { user, image } = getRandomUserImageCombo();
                    initialDivs.push({
                        id: Date.now() + i,
                        left: i * divSize,
                        user,
                        image,
                    });
                }
                setDivs(initialDivs);
                divsRef.current = initialDivs;
            }
        };
        fillContainer();
    }, [users]);


    useEffect(() => {
        const moveDivs = () => {
            setDivs((prevDivs) => {
                const updatedDivs = prevDivs.map((div) => ({
                    ...div,
                    left: div.left + Math.round(speed),
                })).filter((div) => div.left < parentRef.current.offsetWidth + divSize); // Keep divs within view

                // Check if any div went beyond the container width and recycle it by adding a new div at the start
                if (updatedDivs.length < divsRef.current.length) {
                    const { user, image } = getRandomUserImageCombo();
                    const newDiv = {
                        id: Date.now(),
                        left: -divSize, // Place new div at the start
                        user,
                        image,
                    };
                    updatedDivs.push(newDiv);
                    divsRef.current = updatedDivs;
                }

                return updatedDivs;
            });
        };

        const animate = () => {
            moveDivs();
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [speed]);

    const handleSpeed = () => {
        if (isSpeedingUp) return;

        setIsSpeedingUp(true);

        let currentSpeed = 20;
        setSpeed(currentSpeed);

        const slowDownInterval = setInterval(() => {
            if (currentSpeed <= 0.25) {
                clearInterval(slowDownInterval);
                setSpeed(0);
                setIsSpeedingUp(false);
                findWinner();
            } else {
                const reductionPercentage = 0.01;
                currentSpeed = currentSpeed * (1 - reductionPercentage);
                setSpeed(currentSpeed);
            }
        }, 50);
    };

    const findWinner = () => {
        const centerPosition = parentRef.current.offsetWidth / 2;
        let closestDiv = null;
        let closestDistance = Infinity;

        divsRef.current.forEach((div) => {
            const distance = Math.abs(div.left + divSize / 2 - centerPosition);
            console.log(`${div.user.discord}`, distance)
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDiv = div;
            }
        });

        if (closestDiv) {
            setWinner(closestDiv.user.discord);
        }
    };

    return (
        <>
            <div style={{ width: '750px', margin: 'auto', position: 'relative' }}>
                <div ref={parentRef} style={{ width: '100%', marginBottom: '50px', position: 'relative', height: '200px', border: '1px solid black', overflow: 'hidden' }}>
                    <div style={{ position: "absolute", left: "50%", top: "0px", width: "2px", height: "250px", background: "yellow", zIndex: "999" }}></div>
                    {divs.map((div) => (
                        <div
                            key={div.id}
                            style={{
                                position: "absolute",
                                top: "0px",
                                left: `${div.left}px`,
                                width: `${divSize}px`,
                                height: '200px',
                                backgroundColor: "blue",
                                border: "1px solid red",
                                backgroundImage: `url(${div.image})`,
                                backgroundSize: '150px',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                            }}
                        >
                            <span style={{ color: "white" }}>{div.user.discord}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleSpeed} disabled={isSpeedingUp}>
                Roll
            </button>
            {winner && (
                <h2 style={{ marginTop: "20px", color: "green" }}>The winner is: {winner}</h2>
            )}
        </>
    );
};

export default Wheel;
