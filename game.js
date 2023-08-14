// Get the game canvas and its 2D rendering context
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
// Initialize arrays for obstacles and coins
const obstacles = [];
const coins = [];
let keys = {}; 

// Event listener for keydown (when arrow keys are pressed)
window.addEventListener('keydown', (event) => {
    keys[event.key] = true; // Set the corresponding arrow key to true
    event.preventDefault(); // Prevent the default behavior (page scrolling)
});

// Event listener for keyup (when arrow keys are released)
window.addEventListener('keyup', (event) => {
    keys[event.key] = false; // Set the corresponding arrow key to false
    event.preventDefault(); // Prevent the default behavior (page scrolling)
});

// Function to update Quacky's position based on the arrow key state
function updateQuackyPosition() {
    if (keys['ArrowLeft'] && quacky.x > 0) {
        quacky.x -= quacky.speed;
    }

    if (keys['ArrowRight'] && quacky.x + quacky.width < gameCanvas.width) {
        quacky.x += quacky.speed;
    }

    if (keys['ArrowUp'] && quacky.y > 0) {
        quacky.y -= quacky.speed;
    }

    if (keys['ArrowDown'] && quacky.y + quacky.height < gameCanvas.height) {
        quacky.y += quacky.speed;
    }
}

// Function to create a random number between min and max
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to create obstacles and coins
function createObstaclesAndCoins() {
    if (Math.random() < 0.01) {
        const obstacle = {
            x: gameCanvas.width,
            y: getRandomNumber(0, gameCanvas.height - 40), // Random y position
            width: 40,
            height: 40,
            speed: 3,
        };
        obstacles.push(obstacle);
    }

    if (Math.random() < 0.01) {
        const coin = {
            x: gameCanvas.width,
            y: getRandomNumber(0, gameCanvas.height - 40), // Random y position
            width: 30,
            height: 30,
            speed: 2,
        };
        coins.push(coin);
    }
}

// Function to move and draw obstacles
function moveAndDrawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

// Function to move and draw coins
function moveAndDrawCoins() {
    for (let i = 0; i < coins.length; i++) {
        coins[i].x -= coins[i].speed;
        ctx.fillStyle = 'gold';
        ctx.fillRect(coins[i].x, coins[i].y, coins[i].width, coins[i].height);
    }
}

// Function to check for collisions with obstacles and coins
function checkCollisions() {
    // Check for collisions with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        if (
            quacky.x < obstacles[i].x + obstacles[i].width &&
            quacky.x + quacky.width > obstacles[i].x &&
            quacky.y < obstacles[i].y + obstacles[i].height &&
            quacky.y + quacky.height > obstacles[i].y
        ) {
            // Quacky collided with an obstacle, so it's game over
            gameOver();
            return;
        }
    }

    // Check for collisions with coins
    for (let i = 0; i < coins.length; i++) {
        if (
            quacky.x < coins[i].x + coins[i].width &&
            quacky.x + quacky.width > coins[i].x &&
            quacky.y < coins[i].y + coins[i].height &&
            quacky.y + quacky.height > coins[i].y
        ) {
            // Quacky collided with a coin, increase the score and remove the coin
            quacky.score++;
            coins.splice(i, 1);
        }
    }
}

// Quacky properties
const quacky = {
    x: 180,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    score: 0,
};

// Arrow key event listeners to control Quacky
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && quacky.x > 0) {
        quacky.x -= quacky.speed;
    } else if (event.key === 'ArrowRight' && quacky.x + quacky.width < gameCanvas.width) {
        quacky.x += quacky.speed;
    } else if (event.key === 'ArrowUp' && quacky.y > 0) {
        quacky.y -= quacky.speed;
    } else if (event.key === 'ArrowDown' && quacky.y + quacky.height < gameCanvas.height) {
        quacky.y += quacky.speed;
    }
});

// Function to draw Quacky on the canvas
function drawQuacky() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(quacky.x, quacky.y, quacky.width, quacky.height);
}

// Function to update the game state
function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Create obstacles and coins
    createObstaclesAndCoins();

    // Move and draw obstacles
    moveAndDrawObstacles();

    // Move and draw coins
    moveAndDrawCoins();

    // Move and draw Quacky
    updateQuackyPosition();
    drawQuacky();

    // Check for collisions with obstacles and coins
    checkCollisions();

    // Update score and check for game over conditions
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + quacky.score, 20, 40);

    if (quacky.score >= 10) {
        // Player wins the game
        gameOver(true);
        return;
    }

    // Request the next animation frame
    requestAnimationFrame(updateGame);
}

function gameOver(isWin) {
    // Clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Show the game over message
    const gameOverMessage = isWin ? 'Congratulations! You won!' : 'Game Over!';
    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.fillText(gameOverMessage, gameCanvas.width / 2 - 150, gameCanvas.height / 2);

    // Stop the game loop
    cancelAnimationFrame(updateGame);

    // Restart the game after a short delay
    setTimeout(startGame, 2000);
}

// Function to start the game
function startGame() {
    // Reset Quacky's position and score
    quacky.x = 180;
    quacky.y = 300;
    quacky.score = 0;

    // Hide the game over message
    document.getElementById('gameOver').style.display = 'none';

    // Start the game loop
    updateGame();
}

// Function to restart the game
function restartGame() {
    // Show the game over message
    document.getElementById('gameOver').style.display = 'block';

    // Call startGame after a short delay to give the player a chance to see the score
    setTimeout(startGame, 1500);
}

// Function to open the game modal
function openGameModal() {
    const gameModal = document.getElementById('gameModal');
    gameModal.style.display = 'block';
    startGame();
}

// Function to close the game modal
function closeGameModal() {
    const gameModal = document.getElementById('gameModal');
    gameModal.style.display = 'none';

    // Add an event listener to the close button
document.querySelector('.close-button').addEventListener('click', closeGameModal);


}
