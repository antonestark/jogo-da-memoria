document.addEventListener('DOMContentLoaded', () => {
    const memoryGame = document.querySelector('.memory-game');
    const scoreDisplay = document.getElementById('score');
    const movesDisplay = document.getElementById('moves');
    const winModal = document.getElementById('win-modal');
    const playAgainButton = document.getElementById('play-again');

    const cardPairs = [
        { name: "AMARELO", video: "./videos/AMARELO.mp4", text: "Amarelo" },
        { name: "AVERMELHADO", video: "./videos/AVERMELHADO.mp4", text: "Avermelhado" },
        { name: "AZUL 1", video: "./videos/AZUL 1.mp4", text: "Azul 1" },
        { name: "AZUL 2", video: "./videos/AZUL 2.mp4", text: "Azul 2" },
        { name: "BEGE", video: "./videos/BEGE.mp4", text: "Bege" },
        { name: "BRANCO 1", video: "./videos/BRANCO 1.mp4", text: "Branco 1" },
        { name: "BRANCO 2", video: "./videos/BRANCO 2.mp4", text: "Branco 2" },
        { name: "BRANCO 3", video: "./videos/BRANCO 3.mp4", text: "Branco 3" }
    ];

    let boardLocked = false;
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let score = 0;
    let moves = 0;
    let matchedPairs = 0;
    const totalPairs = cardPairs.length;

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function generateCards() {
        let cardSet = [];
        cardPairs.forEach(pair => {
            cardSet.push({ name: pair.name, type: 'video', content: pair.video });
            cardSet.push({ name: pair.name, type: 'text', content: pair.text });
        });

        cardSet = shuffle(cardSet);

        memoryGame.innerHTML = ''; // Clear previous board
        score = 0;
        moves = 0;
        matchedPairs = 0;
        scoreDisplay.textContent = score;
        movesDisplay.textContent = moves;
        winModal.style.display = 'none'; // Hide modal

        cardSet.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.name = card.name;
            cardElement.dataset.type = card.type;

            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.textContent = '?';

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');

            if (card.type === 'video') {
                const videoElement = document.createElement('video');
                videoElement.src = card.content;
                videoElement.loop = true;
                videoElement.muted = true;
                videoElement.playsinline = true;
                backFace.appendChild(videoElement);
            } else {
                const textElement = document.createElement('p');
                textElement.textContent = card.content;
                backFace.appendChild(textElement);
            }

            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);

            cardElement.addEventListener('click', flipCard);
            memoryGame.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (boardLocked) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        // Play video if it's a video card
        if (this.dataset.type === 'video') {
            const video = this.querySelector('video');
            if (video) {
                video.play().catch(error => {
                    console.error("Error playing video:", error);
                });
            }
        }

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            secondCard = this;
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name &&
                      firstCard.dataset.type !== secondCard.dataset.type;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        // Pause videos of matched cards
        [firstCard, secondCard].forEach(card => {
            if (card.dataset.type === 'video') {
                const video = card.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });


        matchedPairs++;
        score += 10; // Example score
        scoreDisplay.textContent = score;

        resetBoard();

        if (matchedPairs === totalPairs) {
            setTimeout(endGame, 500);
        }
    }

    function unflipCards() {
        boardLocked = true;

        setTimeout(() => {
            // Pause and reset videos before flipping back
            [firstCard, secondCard].forEach(card => {
                if (card.dataset.type === 'video') {
                    const video = card.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            });

            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();
        }, 1500); // Wait 1.5 seconds
    }

    function resetBoard() {
        [hasFlippedCard, boardLocked] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function endGame() {
        winModal.style.display = 'flex';
        // You could update modal content here with final score/moves
    }

    function resetGame() {
        generateCards();
    }

    playAgainButton.addEventListener('click', resetGame);

    // Initial game setup
    generateCards();
});
