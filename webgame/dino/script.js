'use strict';

const play_button = document.querySelector("#play_button");

// Set up the canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas_width = canvas.width;
const canvas_height = canvas.height;

// Build the paddle + variables
const paddle_width= 120;
const paddle_height = 20;
let paddleX;
let leftPressed = false;
let rightPressed = false;

// Build the ball + variables
const ball_size = 20;
let x;
let y;
let dx;
let dy;

let score;
let level;

function drawBall() {
    ctx.beginPath();
    ctx.rect(x, y, ball_size, ball_size);
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas_height - 20, paddle_width, paddle_height);
    ctx.fillStyle = "rgb(52, 140, 252)";
    ctx.fill()
    ctx.closePath();
}

function drawScore() {
    ctx.font = "1px poppins";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(`score: ${score}`, 8, 20)
}

function drawLevel() {
    ctx.font = "1px Monospace";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(`level: ${level}`, 8, 40);
}

function drawGameOver () {
    ctx.font = "60px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText("GAME OVER", (canvas_width - 100)/2, canvas_height/2, 100);
}

// Keep track of which key is pressed
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
        leftPressed = false;
    }

    if (e.key === "Left" || e.key === "ArrowLeft") {
        rightPressed = false;
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }

    if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddle_width/2;
    }
}

function touchHandler(e) {
    console.log("touch");
    if (e.touches) {
        const relativeX = e.touches[0].pageX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddle_width/2;
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);


function draw() {
    ctx.clearRect(0,0,canvas_width, canvas_height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLevel();

   
    if (x+dx < 0 || x+dx > canvas_width - ball_size) {
        dx = -dx;
    }

    if (y+dy < 0) {
        dy = -dy;
    }
    
 
    else if (y+dy > canvas_height-3*ball_size ) {
        if (x > paddleX-ball_size && x < paddleX + paddle_width + ball_size) {
            dy = -dy;
            score++;
            if (score%5 === 0) {
                level += 1;
                dy += 0.5*Math.sign(dy);
                dx += 0.5*Math.sign(dx);
            }
        }

        else {
            drawGameOver();
            play_button.disabled = false;
            return;
        }
    }
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas_width - paddle_width);
    }
    if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function play() {
    play_button.innerText = "Restart";
    play_button.disabled = true;
    x = Math.random()*canvas_width;
    y = Math.random()*canvas_height/3;
    dx = 3;
    dy = 3;
    paddleX = (canvas_width - paddle_width) / 2;
    score = 0;
    level = 1;

    draw();
}