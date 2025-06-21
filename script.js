const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 80, y: 150, width: 30, height: 30, gravity: 0.6, lift: -12, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let highScores = [0, 0, 0];
let gameOver = false;

const startScreen = document.getElementById('startScreen');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const highScoreList = document.getElementById('highScores');

let gameStarted = false;

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    gameOver = false;
    gameStarted = false;
    restartBtn.style.display = 'none';
    startScreen.style.display = 'flex';
    scoreDisplay.textContent = score;
}

function update() {
    if (!gameStarted) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        endGame();
    }

    if (frame % 90 === 0) {
        let gap = 150;
        let topPipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, y: 0, width: 50, height: topPipeHeight });
        pipes.push({ x: canvas.width, y: topPipeHeight + gap, width: 50, height: canvas.height });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 3;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            if (index % 2 === 0) score++;
        }

        if (isColliding(bird, pipe)) {
            endGame();
        }
    });

    scoreDisplay.textContent = score;

    draw();
    frame++;
    if (!gameOver) requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function isColliding(b, p) {
    return b.x < p.x + p.width &&
           b.x + b.width > p.x &&
           b.y < p.y + p.height &&
           b.y + b.height > p.y;
}

function endGame() {
    gameOver = true;
    updateHighScores();
    restartBtn.style.display = 'inline-block';
}

function updateHighScores() {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 3);

    highScoreList.innerHTML = '';
    highScores.forEach(s => {
        let li = document.createElement('li');
        li.textContent = s;
        highScoreList.appendChild(li);
    });
}

document.addEventListener('keydown', () => {
    if (gameOver) return;
    if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
        update();
    }
    bird.velocity = bird.lift;
});

canvas.addEventListener('click', () => {
    if (gameOver) return;
    if (!gameStarted) {
        gameStarted = true;
        startScreen.style.display = 'none';
        update();
    }
    bird.velocity = bird.lift;
});

restartBtn.addEventListener('click', () => {
    resetGame();
});

resetGame();
