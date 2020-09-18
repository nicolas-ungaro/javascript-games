import { component, COMPONENT_TYPE } from './component.js';
import { KEYS } from '../constants.js';

let lunarModule;
let obstacles = [];
let score;
let background;

export function startGame() {
    const width = 870;
    const height = 570;

    lunarModule = createLunarModule();
    window.addEventListener('keydown', throttleUpShip);
    window.addEventListener('keyup', throttleDownShip);    

    score = createScore();
    background = createBackground(width, height);

    myGameArea.start(width, height);
}

function createBackground(width, height) {
    let backgroundImage = new Image();
    backgroundImage.src = '../resources/lunar/galaxy.png';
    return new component(width, height, [backgroundImage], 0, 0, COMPONENT_TYPE.IMAGE);    
}

function createLunarModule() {
    const lunarModuleShield = new Image();
    const lunarModuleShieldFire = new Image();
    lunarModuleShield.src = '../resources/lunar/lunar-module.png';
    lunarModuleShieldFire.src = '../resources/lunar/lunar-module-fire.png';

    let lunarModule = new component(70, 70, [lunarModuleShield, lunarModuleShieldFire], 10, 120, COMPONENT_TYPE.IMAGE);
    lunarModule.gravity = 0.05;
    lunarModule.drag = 0.01;

    return lunarModule;
}

function createScore() {
    return new component("30px", "Consolas", ["white"], 280, 40, COMPONENT_TYPE.TEXT);    
}

function throttleUpShip(e) {
    switch (e.keyCode) {
        case KEYS.LEFT:
            bank(-0.2);
            lunarModule.toggleAspect();
            break;
        case KEYS.RIGHT:
            bank(0.2);
            lunarModule.toggleAspect();
            break;
        case KEYS.UP:
            accelerate(-0.07);
            lunarModule.toggleAspect();
            break;
    }
}

function throttleDownShip(e) {
    switch (e.keyCode) {
        case KEYS.LEFT:
            bank(0);
            lunarModule.toggleAspect();
            break;
        case KEYS.RIGHT:
            bank(0);
            lunarModule.toggleAspect();
            break;
        case KEYS.UP:
            accelerate(0.03);
            lunarModule.toggleAspect();
            break;
    }    
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    draw: function(component) {
        this.context = this.canvas.getContext("2d");
        drawComponent(component, this.context);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function drawComponent(component, context) {
    switch(component.type) {
        case COMPONENT_TYPE.TEXT:
            context.font = `${component.width} ${component.height}`;
            context.fillStyle = component.getAspect();
            context.fillText(component.text, component.x, component.y);                
            break;
        case COMPONENT_TYPE.DRAW:
            context.fillStyle = component.getAspect();
            context.fillRect(component.x, component.y, component.width, component.height);                
            break;
        case COMPONENT_TYPE.IMAGE:
            context.drawImage(component.getAspect(), component.x, component.y, component.width, component.height);
            break;
    }    
}

function updateGameArea() {
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (let i = 0; i < obstacles.length; i += 1) {
        if (lunarModule.crashWith(obstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myGameArea.draw(background);
    score.text="SCORE: " + myGameArea.frameNo;

    if (myGameArea.frameNo == 1 || everyinterval(randomInt(50, 150))) {
        addObstacle(myGameArea);
    }
    refreshObstacles(myGameArea);

    myGameArea.draw(score);
    lunarModule.newPos(myGameArea.canvas.width, myGameArea.canvas.height);
    myGameArea.draw(lunarModule);
}

function addObstacle(myGameArea) {
        let x = myGameArea.canvas.width;
        let y = randomInt(0, myGameArea.canvas.height - 70);
        let size = randomInt(20, 70);
        let asteroid = new Image();
        asteroid.src = `../resources/lunar/asteroid-${randomInt(0,2)}.png`;
        obstacles.push(new component(size, size, [asteroid], x, y, COMPONENT_TYPE.IMAGE));
}

function refreshObstacles(myGameArea) {
    for (let i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        myGameArea.draw(obstacles[i]);
    }
}

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    lunarModule.gravity = n;
}

function bank(n) {
    lunarModule.acceleration = n;
}
