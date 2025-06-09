document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreBoard = document.querySelector('.score-board'); // Select the score board section

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

    const displayCount = 6; // Number of videos/texts to display

    // Function to select random video names
    function selectRandomVideoNames(count) {
        const shuffledNames = [...allVideoNames].sort(() => 0.5 - Math.random());
        return shuffledNames.slice(0, count);
    }

    // Function to create the display board
    function createDisplay() {
        // Select random names for the display
        const selectedVideoNames = selectRandomVideoNames(displayCount);

        // Clear previous board
        gameBoard.innerHTML = '';

        // Hide the score board as it's no longer a memory game
        if (scoreBoard) {
            scoreBoard.style.display = 'none';
        }


        // Create HTML elements for video cards
        selectedVideoNames.forEach(name => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card'); // Use the memory-card class for styling
            cardElement.classList.add('video-card'); // Add a class to distinguish video cards

            const videoElement = document.createElement('video');
            videoElement.src = `./videos/${name}.mp4`; // Assuming videos are in a 'videos' subfolder
            videoElement.loop = true; // Loop video
            videoElement.muted = true; // Mute video by default
            videoElement.playsinline = true; // Add playsinline for mobile autoplay
            videoElement.autoplay = true; // Autoplay video

            cardElement.appendChild(videoElement);
            gameBoard.appendChild(cardElement);
        });

        // Create HTML elements for text cards
        selectedVideoNames.forEach(name => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card'); // Use the memory-card class for styling
            cardElement.classList.add('text-card'); // Add a class to distinguish text cards

            const nameElement = document.createElement('p');
            nameElement.textContent = name;

            cardElement.appendChild(nameElement);
            gameBoard.appendChild(cardElement);
        });
    }

    // Initial display creation
    createDisplay();
});
