const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5
};

let player1 = {
    x: 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 8,
    score: 0
};

let player2 = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    speed: 5,
    score: 0
};

let player1Up = false;
let player1Down = false;

const winningScore = 10;
let gameActive = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') player1Up = true;
    if (event.key === 's') player1Down = true;
    if (event.code === 'Space' && !gameActive) {
        gameActive = true;
        document.getElementById('startPrompt').style.display = 'none';
        gameLoop();
    }
    if (event.key === 'q') {
        quitGame();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') player1Up = false;
    if (event.key === 's') player1Down = false;
});

// Game loop
function gameLoop() {
    if (gameActive) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    // Update Player 1 position
    if (player1Up && player1.y > 0) player1.y -= player1.speed;
    if (player1Down && player1.y < canvas.height - player1.height) player1.y += player1.speed;

    // AI logic for Player 2 (Bot)
    if (ball.y < player2.y + player2.height / 2 && player2.y > 0) {
        player2.y -= player2.speed;
    } else if (ball.y > player2.y + player2.height / 2 && player2.y < canvas.height - player2.height) {
        player2.y += player2.speed;
    }

    // Update ball position
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.speedX *= -1;
    }

    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.speedX *= -1;
    }

    // Check for scoring
    if (ball.x - ball.radius < 0) {
        player2.score++;
        checkWinCondition();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        checkWinCondition();
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
}

function checkWinCondition() {
    if (player1.score >= winningScore || player2.score >= winningScore) {
        gameActive = false;
        const winner = player1.score >= winningScore ? "Player 1 Wins!" : "AI Wins!";
        document.getElementById('gameOver').innerText = winner;
        document.getElementById('gameOver').style.display = 'block';
    }
}


function quitGame() {
    gameActive = false;
    document.getElementById('gameOver').innerText = "AI Wins!";
    document.getElementById('gameOver').style.display = 'block';

    // Redirect to another page after 2 seconds
    setTimeout(() => {
        window.location.href = 'yourHomePage.html'; // Replace with the URL you want to redirect to
    }, 2000);
}

// Draw elements on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw score
    document.getElementById('score').innerText = `Player 1: ${player1.score} | AI: ${player2.score}`;
}

