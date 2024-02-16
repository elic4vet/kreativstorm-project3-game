let board;
let boardwidth = 750;
let boardheight = 250;
let context;
let margin = 10;

//Dino

let dinowidth = 88;
let dinoheight = 94;
let dinoX = 50;
let dinoY = boardheight - dinoheight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinowidth,
    height: dinoheight
};

//Cactus
let cactusArray = [];
let cactuswidth = 34;
let cactusheight = 69;
let cactusX = 700;
let cactusY = boardheight - cactusheight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let cactusInterval = 1000; // Initial interval for placing cacti
let cactusTimer = 0; // Timer to keep track of cactus placement


//Par. 1

let velocity = -8; // update the value of the existing variable
let velocityX = -4; // left speed
let gravity = .4; // down speed

let gameover = false;
let score = 0;
let gameStarted = false;

// Define your game's start function
function startGame() {
    // If the game has already started, return
    if (gameStarted) {
        return;
    }

    // Set the game as started
    gameStarted = true;
    gameover = false;
    score = 0;
    velocity = -8;
    cactusArray = [];
    cactusTimer = 0;
    dino.y = dinoY;
    requestAnimationFrame(update);
}

// Add an event listener for the 'keydown' event
window.addEventListener('keydown', function(event) {
    // Check if the key pressed was the spacebar
    if (event.code === 'Space') {
        // If the game hasn't started yet, start the game
        startGame();
    }
});

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext('2d');

    dinoImg = new Image();
    dinoImg.src = './assets/images/dino.png';
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    dinodDeadImg = new Image();
    dinodDeadImg.src = './assets/images/dino-lose.png';
    dinodDeadImg.onload = function () {
        context.drawImage(dinodDeadImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = './assets/images/cactus_1.png';
    cactus1Img.onload = function () {
        context.drawImage(cactus1Img, cactusX, cactusY, cactuswidth, cactusheight);
    }
    cactus2Img = new Image();
    cactus2Img.src = './assets/images/cactus_2.png';
    cactus2Img.onload = function () {
        context.drawImage(cactus2Img, cactusX, cactusY, cactuswidth, cactusheight);
    }
    cactus3Img = new Image();
    cactus3Img.src = './assets/images/cactus_3.png';
    cactus3Img.onload = function () {
        context.drawImage(cactus3Img, cactusX, cactusY, cactuswidth, cactusheight);
    }

    setInterval(placeCactus, 1000);  
    document.addEventListener('keydown', moveDino);
}


function update() {
    requestAnimationFrame(update);
    if (gameover) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocity += gravity;
    dino.y += Math.min(dino.y, velocity, dinoY); // Math.min is used to prevent the dino from going below the ground
    if (dino.y >= dinoY) {
        dino.y = dinoY;
    }
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactusArray[i].img, cactusArray[i].x, cactusArray[i].y, cactusArray[i].width, cactusArray[i].height);
    
        // Check if the dino has passed the cactus
    if (dino.x > cactus.x + cactus.width) {
        cactus.passed = true;
    }

    if (detectCollision(dino, cactus)) {
            gameover = true;
            context.drawImage(dinodDeadImg, dino.x, dino.y, dino.width, dino.height);
        }

    }

    //score
    context.fillStyle = 'black';
    context.font = '24px Arial';
    context.fillText('Score: ' + score, 5, 20);
    score++;
}

function moveDino(event) {
    if (gameover) {
        return;
    }
    if (event.code === 'Space' || event.code === 'ArrowUp' && dino.y === dinoY) {
        velocity = -10; // jump speed
    }
}

function placeCactus() {
    if (gameover) {
        return;
    }
    let cactusImg = [cactus1Img, cactus2Img, cactus3Img];
    let randomCactus = Math.floor(Math.random() * cactusImg.length);
    let cactus = {
        x: cactusX,
        y: cactusY,
        width: cactuswidth,
        height: cactusheight,
        img: cactusImg[randomCactus],
        passed: false
    };
    cactusArray.push(cactus);
}

function detectCollision(dino, cactus) {
    let marginX = 10; // Horizontal margin
    let marginY = 20; // Vertical margin

    // Check for collision with margins along both axes
    return dino.x + dino.width - marginX > cactus.x &&
           dino.x + marginX < cactus.x + cactus.width &&
           dino.y + dino.height - marginY > cactus.y &&
           dino.y + marginY < cactus.y + cactus.height;
}

