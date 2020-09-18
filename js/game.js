import { elementType, direction } from './constants.js';

let snake = [];
let snakeHead;
let snakeTail;
let myObstacles = [];
let myScore;
let currentDirection = direction.RIGHT;
const snakeSize = 30;

export function startGame() {
    window.addEventListener('keydown', changeDirection);
    snakeHead = new component(snakeSize, snakeSize, "red", 60, 120, elementType.SNAKE_HEAD, currentDirection);
    snakeTail = new component(snakeSize, snakeSize, "red", 30, 120, elementType.SNAKE_TAIL, currentDirection);
    snakeHead.speed = 0.85;
    snakeTail.speed = 0.85;
    snake.push(snakeHead);
    snake.push(snakeTail);
    myScore = new component("30px", "Consolas", "black", 280, 40, elementType.TEXT);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function changeDirection(e) {
    let key = e.key.toLowerCase();
    if (key === direction.DOWN || key === direction.LEFT || key === direction.RIGHT || key === direction.UP) {
        let acceptChange = false;
        switch (currentDirection) {
            case direction.DOWN:
                acceptChange = (key !== direction.UP);
                break;
            case direction.LEFT:
                acceptChange = (key !== direction.RIGHT);
                break;
            case direction.RIGHT:
                acceptChange = (key !== direction.LEFT);
                break;
            case direction.UP:
                acceptChange = (key !== direction.DOWN);
                break;
        }

        if (acceptChange) {
            currentDirection = key;
            snakeHead.dir = currentDirection;  
        } 
    }
}

function component(width, height, color, x, y, type, _direction) {
    this.type = type;
    this.dir = _direction;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0.05;
    this.speedY = 0.05;    
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.gravitySpeed = 0;

    this.update = () => {
        let ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = () => {
        switch (this.dir) {
            case direction.DOWN:
                this.y += this.speed;
                break;
            case direction.LEFT:
                this.x -= this.speed;
                break;
            case direction.RIGHT:
                this.x += this.speed;
                break;
            case direction.UP:
                this.y -= this.speed;
                break;
        }

        this.checkBoundaries();
    }

    this.checkBoundaries = () => {
        let rockbottom = myGameArea.canvas.height - this.height;
        let rightmost = myGameArea.canvas.width - this.width;
        if (this.y > rockbottom) {
            this.y = 0;
        }

        if (this.y < 0) {
            this.y = rockbottom;
        }

        if (this.x > rightmost) {
            this.x = 0;
        }

        if (this.x < 0) {
            this.x = rightmost;
        }
    }

    this.crashWith = (otherobj) => {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        return (mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright);
    }
}

function updateGameArea() {
    let collisionObject = collides(snakeHead);
    if (collisionObject !== undefined) {
        if (collisionObject.type !== elementType.FRUIT) return;

        eat();
    } 
        
    
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myGameArea.clear();
    myGameArea.frameNo += 1;
    // Adds more obstacles every 150 frames
    // if (myGameArea.frameNo == 1 || everyinterval(150)) {
    //     x = myGameArea.canvas.width;
    //     minHeight = 20;
    //     maxHeight = 200;
    //     height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    //     minGap = 50;
    //     maxGap = 200;
    //     gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    //     myObstacles.push(new component(10, height, "green", x, 0));
    //     myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    // }
    // Updates obstacles position
    // for (let i = 0; i < myObstacles.length; i += 1) {
    //     myObstacles[i].x += -1;
    //     myObstacles[i].update();
    // }
    updateScore(myGameArea.frameNo);
    moveSnake();
}

function updateScore(score) {
    myScore.text = `SCORE: ${score}`;
    myScore.update;
}

// function moveSnake() {
//     for (let i = 0; i < snake.length; i++) {
//         snake[i].newPos();
//         snake[i].update();
//     }
// }

function moveSnake() {
    let prev =  { ...snake[0] };
    snake[0].newPos();
    snake[0].update();
    for (let i = 1; i < snake.length; i++) {
        let aux = { ...snake[i] };
        snake[i].dir = prev.dir;
        snake[i].newPos();
        snake[i].update();
        prev = { ...aux };
    }
}

function eat() {
    const aux = snake[0];
    let x = aux.x;
    let y = aux.y;
    switch(currentDirection) {
        case direction.DOWN:
            y = aux.y + snakeSize;
            break;
        case direction.LEFT:
            x = aux.x - snakeSize;
            break;
        case direction.RIGHT:
            x = aux.x + snakeSize;
            break;
        case direction.UP:
            y = aux.y - snakeSize;
            break;
    }

    let newHead = new component(snakeSize, snakeSize, "red", x, y, elementType.SNAKE_HEAD, currentDirection);
    newHead.speed = aux.speed;
    aux.type = elementType.SNAKE;
    snake[0] = newHead;
    snake.push(aux);
}

function collides(element) {
    for (let i = 0; i < myObstacles.length; i++) {
        if (element.crashWith(myObstacles[i])) {
            return myObstacles[i];
        } 
    }
    return undefined;
}