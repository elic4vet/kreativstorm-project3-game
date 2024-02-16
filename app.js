const boardWidth = 750;
const boardHeight = 250;
const dinoWidth = 88;
const dinoHeight = 94;
const cactusWidth = 34;
const cactusHeight = 69;
const cactusSpawnInterval = 1000;
const initialVelocity = -8;
const horizontalVelocity = -4;
const gravity = 0.4;
const scoreIncrementInterval = 20;

let frameCounter = 0;
let board, context;
let dino, dinoImg, dinoDeadImg;
let cactusImages = [];
let cacti = [];
let gameover = false;
let score = 0;
let gameStarted = false;

window.onload = function () {
    initializeGame();
    setupEventListeners();
};

function initializeGame() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    dinoImg = loadImage('./assets/images/dino.png');
    dinoDeadImg = loadImage('./assets/images/dino-lose.png');
    cactusImages.push(loadImage('./assets/images/cactus_1.png'));
    cactusImages.push(loadImage('./assets/images/cactus_2.png'));
    cactusImages.push(loadImage('./assets/images/cactus_3.png'));

    dino = {
        x: 50,
        y: boardHeight - dinoHeight,
        width: dinoWidth,
        height: dinoHeight,
        velocity: 0
    };

    drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function setupEventListeners() {
    window.addEventListener('keydown', moveDino);


    document.getElementById('resetButton').addEventListener('click', function () {
        location.reload();
    });
}

function startGame() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    gameover = false;
    score = 0;
    dino.velocity = initialVelocity;
    cacti = [];
    requestAnimationFrame(update);
    setInterval(placeCactus, cactusSpawnInterval);
}

function update() {
    if (gameover) {
        return;
    }

    clearCanvas();
    updateDino();
    updateCacti();
    drawScore();

    frameCounter++;
    if (frameCounter >= scoreIncrementInterval) {
        score++;
        frameCounter = 0; // Reset frame counter
    }

    requestAnimationFrame(update);
}

function clearCanvas() {
    context.clearRect(0, 0, board.width, board.height);
}

function moveDino(event) {
    if (gameover) {
        return;
    }
    if ((event.code === 'Space' || event.code === 'ArrowUp') && dino.y === boardHeight - dinoHeight) {
        if (!gameStarted) {
            startGame();
        } else {
            dino.velocity = -10;
        }
    }
}


function updateDino() {
    dino.velocity += gravity;
    dino.y += dino.velocity;

    if (dino.y > boardHeight - dinoHeight) {
        dino.y = boardHeight - dinoHeight;
        dino.velocity = 0;
    }

    drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}


function updateCacti() {
    if (!gameStarted) {
        return;
    }

    for (let i = 0; i < cacti.length; i++) {
        let cactus = cacti[i];
        cactus.x += horizontalVelocity;
        drawImage(cactus.image, cactus.x, cactus.y, cactus.width, cactus.height);

        if (dino.x > cactus.x + cactus.width) {
            cactus.passed = true;
        }

        if (detectCollision(dino, cactus)) {
            gameover = true;
            drawImage(dinoDeadImg, dino.x, dino.y, dino.width, dino.height);
        }
    }
}

function placeCactus() {
    if (!gameStarted) {
        return;
    }

    let randomCactusImg = cactusImages[Math.floor(Math.random() * cactusImages.length)];
    let cactus = {
        x: boardWidth,
        y: boardHeight - cactusHeight,
        width: cactusWidth,
        height: cactusHeight,
        image: randomCactusImg,
        passed: false
    };
    cacti.push(cactus);
}

function drawScore() {
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('Score: ' + score, 5, 20);
}

function detectCollision(dino, cactus) {
    let marginX = 10;
    let marginY = 20;
    return dino.x + dino.width - marginX > cactus.x &&
        dino.x + marginX < cactus.x + cactus.width &&
        dino.y + dino.height - marginY > cactus.y &&
        dino.y + marginY < cactus.y + cactus.height;
}

function loadImage(src) {
    let img = new Image();
    img.src = src;
    return img;
}

function drawImage(img, x, y, width, height) {
    context.drawImage(img, x, y, width, height);
}
