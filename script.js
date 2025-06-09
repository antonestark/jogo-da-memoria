document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.querySelector('.restart-button'); // Use class selector
    const scoreValue = document.querySelector('.score-value'); // Select score value span
    const pairsFound = document.querySelector('.pairs-found'); // Select pairs found paragraph

    // List of all available video names
    const allVideoNames = [
        "AMARELO",
        "AVERMELHADO",
        "AZUL 1",
        "AZUL 2",
        "BEGE",
        "BRANCO 1",
        "BRANCO 2",
        "BRANCO 3",
        "BRONZE",
        "COLORIR",
        "COR",
        "DOURADO",
        "ESCURIDÃO",
        "ESCURO",
        "LARANJA",
        "lilás",
        "marrom"
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false; // To prevent flipping more than two cards at once
    const totalPairs = 6; // Libras Match uses 6 pairs (12 cards)

    // Function to select 6 random video names
    function selectRandomVideoNames(count) {
        const shuffledNames = [...allVideoNames].sort(() => 0.5 - Math.random());
        return shuffledNames.slice(0, count);
    }

    // Function to create the game board
    function createBoard() {
        // Select 6 random names for the game
        const selectedVideoNames = selectRandomVideoNames(totalPairs);

        // Create card objects (6 pairs = 12 cards)
        cards = [];
        selectedVideoNames.forEach((name, index) => {
            // Create a pair: one text card and one video card
            cards.push({
                id: index,
                type: 'text',
                content: name
            });
            cards.push({
                id: index,
                type: 'video',
                content: `./videos/${name}.mp4` // Assuming videos are in a 'videos' subfolder
            });
        });

        // Shuffle cards
        cards.sort(() => 0.5 - Math.random());

        // Clear previous board
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        scoreValue.textContent = '0'; // Reset score display
        pairsFound.textContent = `Pares encontrados: 0 de ${totalPairs}`; // Reset pairs found display


        // Create HTML elements for each card
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card'); // Use the new class name
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;

            // Create front and back of the card
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.textContent = '?'; // Back of the card

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');

            if (card.type === 'text') {
                cardBack.textContent = card.content;
            } else { // type === 'video'
                const videoElement = document.createElement('video');
                videoElement.src = card.content;
                videoElement.loop = true; // Loop video
                videoElement.muted = true; // Mute video by default
                videoElement.playsinline = true; // Add playsinline for mobile autoplay
                cardBack.appendChild(videoElement);
            }

            // Append front and back to the card element
            cardElement.appendChild(cardFront);
            cardElement.appendChild(cardBack);


            cardElement.addEventListener('click', flipCard);

            gameBoard.appendChild(cardElement);
        });
    }

    // Function to flip a card
    function flipCard() {
        if (lockBoard) return;
        // Check if the card is already flipped or matched
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        // If it's a video card, play the video when flipped
        if (this.dataset.type === 'video') {
            const video = this.querySelector('video');
            if (video) {
                video.play().catch(error => {
                    console.error("Error playing video:", error);
                    // Handle potential autoplay restrictions
                });
            }
        }


        // If it's the second card flipped
        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    // Function to check if flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.id === card2.dataset.id && card1.dataset.type !== card2.dataset.type;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    // Function to disable matched cards
    function disableCards() {
        flippedCards.forEach(card => {
            card.removeEventListener('click', flipCard);
            card.classList.add('matched'); // Add matched class
        });

        matchedPairs++;
        scoreValue.textContent = matchedPairs * 10; // Example score: 10 points per pair
        pairsFound.textContent = `Pares encontrados: ${matchedPairs} de ${totalPairs}`; // Update pairs found display


        resetBoard();

        // Check for game end
        if (matchedPairs === totalPairs) {
            setTimeout(endGame, 500); // Small delay before showing end message
        }
    }

    // Function to unflip non-matching cards
    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                // Pause and reset video if it was playing
                if (card.dataset.type === 'video') {
                    const video = card.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0; // Reset video to start
                    }
                }
            });
            resetBoard();
        }, 1000); // Keep cards visible for 1 second
    }

    // Function to reset flipped cards and lock state
    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    // Function to handle game end
    function endGame() {
        alert(`Parabéns! Você encontrou todos os ${totalPairs} pares! Sua pontuação: ${matchedPairs * 10}`);
        // Optional: Display stats, show restart button prominently
    }

    // Restart button functionality
    restartButton.addEventListener('click', createBoard);

    // Initial board creation
    createBoard();
});
