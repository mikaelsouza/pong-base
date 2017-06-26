var canvas;
var canvasContext;
var framesPerSecond = 60;
var player;
var computer;
var ball;
var defaultBallSpeed = 5;

class Ball {
    constructor(ballX, ballY){
        this.x = ballX;
        this.y = ballY;
        this.radius = 10;

        this.speedX = defaultBallSpeed;
        this.speedY = defaultBallSpeed;
    }

    resetBall(){
        this.y = canvas.height/2;
        this.x = canvas.width/2;
        this.speedX = -this.speedX;
        this.speedY = -this.speedY;
    }

    updateSpeed(){
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            gameOver();
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0){
            this.invertSY();
        }
    }

    invertSX(){
        this.speedX = -this.speedX;
    }

    invertSY(){
        this.speedY = -this.speedY;
    }
}

class Paddle{
    constructor(paddleX, paddleY){
        this.x = paddleX;
        this.y = paddleY;
        this.width = 10;
        this.height = 100;
    }

    checkBoundaries(){
        if(this.y + this.height >= canvas.height){
            this.y = canvas.height - this.height - 1;
        }
        if(this.y <= 1){
            this.y = 1;
        }
    }

}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    player = new Paddle(1, canvas.height/2 - 50);
    computer = new Paddle(canvas.width - 11, canvas.height/2 - 50);
    ball = new Ball(canvas.width/2, canvas.height/2);

    setInterval(function(){
        update();
        draw();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', function(evt){
        var mousePos = getMousePosition(evt);
        player.y = mousePos.y - player.height/2;
    });

};

function gameOver(){
    ball.resetBall();
    ball.speedX = defaultBallSpeed;
    ball.speedY = defaultBallSpeed;
    computer.y = canvas.height/2 - computer.height/2;
}

function getMousePosition(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function bounceOnPaddle(){
    if(ball.y > player.y && ball.y < player.y + player.height){
        if(ball.x - ball.radius < player.x + player.width){
            ball.invertSX();
        }
    }
    if(ball.y > computer.y && ball.y < computer.y + computer.height){
        if(ball.x + ball.radius > computer.x){
            ball.invertSX();
        }
    }
}

function computerMoviment(){
    computer.y = ball.y - computer.height/2;
}

function update(){
    computerMoviment();
    computer.checkBoundaries();
    player.checkBoundaries();
    //TODO: CONSERTAR BUG DE PERDER MESMO DEFENDENDO.
    bounceOnPaddle();
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    ball.updateSpeed();

    ball.speedY = ball.speedY + ball.speedY * 0.0002;
    ball.speedX = ball.speedX + ball.speedX * 0.0002;
}

function draw(){

    // Pinta o fundo de preto.

    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a bola na tela.

    drawCircle(ball, 'white');

    // Desenha o player na tela.

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(player.x, player.y, player.width, player.height);

    // Desenha a máquina na tela.

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(computer.x, computer.y, computer.width, computer.height);
}

function drawCircle(ball, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
