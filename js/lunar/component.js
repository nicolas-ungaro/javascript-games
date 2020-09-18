import { direction } from '../constants.js';

export const COMPONENT_TYPE = {
    TEXT: "text",
    DRAW: "draw",
    IMAGE: "image"
}

export function component(width, height, aspects, x, y, type) {
    this.type = type;
    this.aspects = aspects;
    this.aspectIdx = 0;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.horizontalHeading = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.acceleration = 0;
    this.drag = 0;
    this.horizontalDirection = direction.CENTER;
    this.gravity = 0;
    this.gravitySpeed = 0;

    this.toggleAspect = function() {
        this.aspectIdx = this.aspectIdx + 1 === this.aspects.length ? 0 : this.aspectIdx + 1;
    }

    this.getAspect = function () {
        return this.aspects[this.aspectIdx];
    }

    this.newPos = function(contextWidth, contextHeight) {
        this.gravitySpeed += this.gravity;
        this.regulateHorizontalSpeed();
        this.x += this.horizontalHeading;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom(contextHeight);
    }

    this.regulateHorizontalSpeed = () => {
        if (this.acceleration === 0) {
            if (this.horizontalDirection === direction.LEFT) {
                this.horizontalHeading += this.horizontalHeading + this.drag < 0 ? this.drag : 0;
            }

            if (this.horizontalDirection === direction.RIGHT) {
                this.horizontalHeading -= this.horizontalHeading - this.drag > 0 ? this.drag : 0;
            }

            if (this.horizontalHeading === 0) {
                this.horizontalDirection = direction.CENTER;
            }
        }
        else {
            this.horizontalDirection = this.acceleration < 0 ? direction.LEFT : direction.RIGHT;
            this.horizontalHeading += this.acceleration;
        }
    }

    this.hitBottom = function(contextHeight) {
        var rockbottom = contextHeight - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}