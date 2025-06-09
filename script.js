document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');

    // NOTE: In a real application, you would need a server-side component
    // or a different environment (like Electron) to dynamically read local files.
    // For this example, we'll use a hardcoded list of video names based on the prompt.
    // The actual video files should be placed in a directory accessible by the web page,
    // for example, inside the 'sign-memory-game' folder or a subfolder like 'videos'.
    // For simplicity, we assume videos are in a 'videos' subfolder relative to index.html.
    const videoNames = [
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

    // Function to create the game board
    function createBoard() {
        // Create card objects
        cards = [];
        videoNames.forEach((name, index) => {
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

        // Create HTML elements for each card
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

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
                // Optional: Add a play button overlay if needed, but prompt suggests auto-play
                cardBack.appendChild(videoElement);
            }

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener('click', flipCard);

            gameBoard.appendChild(cardElement);
        });

        // Adjust grid columns based on number of cards (optional, basic example)
        const numCards = cards.length;
        const columns = Math.ceil(Math.sqrt(numCards)); // Simple heuristic
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    }

    // Function to flip a card
    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return; // Prevent clicking the same card twice

        this.classList.add('flipped');
        flippedCards.push(this);

        // If it's the second card flipped
        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }

        // If it's a video card, play the video
        if (this.dataset.type === 'video') {
            const video = this.querySelector('video');
            if (video) {
                video.play().catch(error => {
                    console.error("Error playing video:", error);
                    // Handle potential autoplay restrictions
                });
            }
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
            // Optional: Add a class to visually indicate matched cards
            card.classList.add('matched');
        });

        matchedPairs++;
        resetBoard();

        // Check for game end
        if (matchedPairs === videoNames.length) {
            setTimeout(endGame, 500); // Small delay before showing end message
        }
    }

    // Function to unflip non-matching cards
    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                // Pause video if it was playing
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
        alert('Parabéns! Você encontrou todos os pares!');
        // Optional: Display stats, show restart button prominently
    }

    // Restart button functionality
    restartButton.addEventListener('click', createBoard);

    // Initial board creation
    createBoard();
    displayGifs(); // Call function to display GIFs
});

// Function to display GIFs and names
function displayGifs() {
    const gifSection = document.getElementById('gif-section');
    const gifsToShow = videoNames.slice(0, 5); // Take the first 5 videos

    gifsToShow.forEach(name => {
        const gifItem = document.createElement('div');
        gifItem.classList.add('gif-item');

        const videoElement = document.createElement('video');
        videoElement.src = `./videos/${name}.mp4`;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsinline = true; // Add playsinline for mobile autoplay

        const nameElement = document.createElement('p');
        nameElement.textContent = name;

        gifItem.appendChild(videoElement);
        gifItem.appendChild(nameElement);
        gifSection.appendChild(gifItem);
    });
}
