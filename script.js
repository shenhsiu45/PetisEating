const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snakeSize = 25;
const snakeParts = [];
let tailLength = 2;
let speedX = snakeSize;
let speedY = 0;
let gameOver = false;
let score = 0;

const snakeHead = new Image();
const snakeBody = new Image();
const snakeTail = new Image();
const foodImage = new Image();
const snakeStyle = document.getElementById('snakeStyle');

function setSnakeImages() {
    const selectedStyle = snakeStyle.value;

    snakeHead.src = selectedStyle + 'head.png';
    snakeBody.src = selectedStyle + 'body.png';
    snakeTail.src = selectedStyle + 'tail.png';
    foodImage.src = selectedStyle + 'food.png';
}

setSnakeImages();

snakeStyle.addEventListener('change', setSnakeImages);

let headX = canvas.width / 2;
let headY = canvas.height / 2;
let foodX;
let foodY;

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", restartGame);

let gameLoop;

function drawGame() {
    clearScreen();
    if (!gameOver) {
        checkCollision();
        moveSnake();
        drawSnake();
        checkFoodCollision();
        drawScore();
        // 设置定时器并保存返回值
        gameLoop = setTimeout(drawGame, 10000 / 120);
    } else {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('遊戲結束，按空白鍵重新開始', canvas.width / 4.5, canvas.height / 2);
    }
}


// 在游戏循环开始前绘制开始提示
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.fillText('請點擊Start即可開始', canvas.width / 3.5, canvas.height / 2);


function clearScreen() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    // 绘制蛇头
    ctx.drawImage(snakeHead, headX, headY, snakeSize, snakeSize);

    // 绘制蛇身体
    for (let i = 0; i < snakeParts.length - 1; i++) {
        ctx.drawImage(snakeBody, snakeParts[i].x, snakeParts[i].y, snakeSize, snakeSize);
    }

    // 绘制蛇尾巴
    if (snakeParts.length > 0) {
        ctx.drawImage(snakeTail, snakeParts[snakeParts.length - 1].x, snakeParts[snakeParts.length - 1].y, snakeSize, snakeSize);
    }

    // 绘制食物
    ctx.drawImage(foodImage, foodX, foodY, snakeSize, snakeSize);

    // 添加新的身体部分到蛇的头部
    snakeParts.unshift({ x: headX, y: headY });

    // 控制蛇的长度，使其不超过尾部长度
    while (snakeParts.length > tailLength) {
        snakeParts.pop();
    }
}

function moveSnake() {
    headX += speedX;
    headY += speedY;
}

function generateFood() {
    foodX = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    foodY = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;

    for (let i = 0; i < snakeParts.length; i++) {
        const part = snakeParts[i];
        if (part.x === foodX && part.y === foodY) {
            generateFood();
            return;
        }
    }
}

function checkFoodCollision() {
    if (headX === foodX && headY === foodY) {
        tailLength++;
        score++;
        generateFood();
    }
}

function checkCollision() {
    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
        gameOver = true;
    }

    for (let i = 1; i < snakeParts.length; i++) {
        const part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
        }
    }

    if (gameOver) {
        alert('遊戲結束！你的分數是：' + score);
    }    
}

function keyDown(event) {
    if (!gameOver) {
        if (event.code === 'ArrowUp' && speedY === 0) {
            speedX = 0;
            speedY = -snakeSize;
        } else if (event.code === 'ArrowDown' && speedY === 0) {
            speedX = 0;
            speedY = snakeSize;
        } else if (event.code === 'ArrowLeft' && speedX === 0) {
            speedX = -snakeSize;
            speedY = 0;
        } else if (event.code === 'ArrowRight' && speedX === 0) {
            speedX = snakeSize;
            speedY = 0;
        }
    }
}

function restartGame(event) {
    console.log("Restart function called.");
    if ((gameOver && (event.code === "Space" || event.target === canvas || event.target.id === "startButton"))) {
        console.log("Restart conditions met.");
        headX = canvas.width / 2;
        headY = canvas.height / 2;
        snakeParts.length = 0;
        tailLength = 2;
        gameOver = false;
        score = 0;
        generateFood();
        // 清除之前的定时器
        clearTimeout(gameLoop);
        // 重新开始游戏
        drawGame();
    }
}


function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    generateFood();
    drawGame();
}

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平移动
        if (deltaX > 0 && speedX === 0) {
            // 向右滑动
            speedX = snakeSize;
            speedY = 0;
        } else if (deltaX < 0 && speedX === 0) {
            // 向左滑动
            speedX = -snakeSize;
            speedY = 0;
        }
    } else {
        // 垂直移动
        if (deltaY > 0 && speedY === 0) {
            // 向下滑动
            speedX = 0;
            speedY = snakeSize;
        } else if (deltaY < 0 && speedY === 0) {
            // 向上滑动
            speedX = 0;
            speedY = -snakeSize;
        }
    }
}