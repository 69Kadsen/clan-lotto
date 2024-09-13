// src/components/DrawWinners.js
export function draw(participants, numWinners = 25, winAmount, jackpot) {

    console.log("Jackpot", jackpot)

    console.log(numWinners)

    let priceDistribution;

    priceDistribution = {
        1: 25, 
        2: 20, 
        3: 15, 
        4: 8, 
        5: 6, 
        6: 4, 
        7: 2.725, 
        8: 2.325, 
        9: 2.175, 
        10: 2.025,
        11: 1.2,
        12: 1.15,
        13: 1.1,
        14: 1.05,
        15: 1,
        16: 0.95,
        17: 0.9,
        18: 0.85,
        19: 0.8,
        20: 0.75,
        21: 0.7,
        22: 0.65,
        23: 0.6,
        24: 0.55,
        25: 0.5,
    }

    // Create a pool of participants based on their tickets
    let ticketPool = [];

    participants.forEach(participant => {
        for (let i = 0; i < participant.tickets; i++) {
            ticketPool.push(participant); // Add the participant for each ticket
        }
    });


    let jpWinner = [];


    if (jackpot) {
        // Select a random index from the ticket pool as Jackpot winner
        const randomIndex = Math.floor(Math.random() * ticketPool.length);
        const jackpotWinner = ticketPool[randomIndex];

        const percentage = ( jackpotWinner.tickets / ticketPool.length ) * 100


        jackpotWinner["price"] = "50% of ALL";
        jackpotWinner["numWinner"] = "jackpot";
        jackpotWinner["chance"] = percentage;
        jpWinner.push(jackpotWinner);

        // Remove the winner and all their tickets from the pool
        ticketPool = ticketPool.filter(entry => entry.discord !== jackpotWinner.discord);

    };

    let winners = [];

    // Randomly pick winners, remove the winner and their tickets
    for (let i = 0; i < numWinners; i++) {
        if (ticketPool.length === 0) break; // If pool is empty, stop

        let totalTickets = ticketPool.length

        // Select a random index from the ticket pool
        const randomIndex = Math.floor(Math.random() * ticketPool.length);
        const winner = ticketPool[randomIndex];

        const percentage = ( winner.tickets / totalTickets ) * 100

        // Add winner to the winners list (if not already selected)
        if (!winners.includes(winner)) {
            winner["price"] = (priceDistribution[i + 1] * winAmount / 100).toFixed(2);
            winner["numWinner"] = i + 1;
            winner["chance"] = percentage;
            winners.push(winner);

            // Remove the winner and all their tickets from the pool
            ticketPool = ticketPool.filter(entry => entry.discord !== winner.discord);
        }
    }

    return [winners, jpWinner];

}
