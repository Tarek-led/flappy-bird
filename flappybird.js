//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdwidth = 34;
let birdheight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/4;

let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdwidth,
    height: birdheight,
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2; // pipe movement
let velocityY = -6; // bird jump 
let gravity = 0.1;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    // game over modal
    gameOverDisplay = document.getElementById('gameOverModal');

    // draw bird
    context.fillStyle = 'green';
    birdImg = new Image();
    birdImg.src = './flappybird.png';
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);    
    setInterval(placePipes, 1200);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('click', moveBird);

    // reset game
    let resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function(){
        restartGame();
    });

    // high score
    highestScoreElement = document.getElementById('highestScore');

}

function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height)

    //bird
    velocityY += gravity;
    velocityY = Math.min(velocityY + gravity, 10);
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y >= board.height){
        gameOver = true;
    }

    //pipes
    for (let i =0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            pipe.passed = true;
            score +=0.5;
        }
        if(checkCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //remove pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //score
    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 5, 45);

    //game over
    if (gameOver){
        gameOverDisplay.style.display = 'block';
        highestScoreElement.innerHTML = Math.max(score, highestScoreElement.innerHTML);
    }
}

function placePipes(){
    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * pipeHeight/2;
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(event){
    if (event.code == 'Space' || event.code == 'ArrowUp' || event.type == 'click'){
        velocityY = -6;
    }
}

// game reset
function restartGame(){
        pipeArray = [];
        bird.y = birdY;
        score = 0;
        gameOver = false;
        gameOverDisplay.style.display = 'none';
}

// collision detection
function checkCollision(a, b){
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}