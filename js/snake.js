import { direction } from './constants.js';

export function snake(observer) {
    let observers = observer ? [observer] : [];    
    let head = {};
    let tail = {};
    let size = 0;
    let speed = 0;
    let currentDirection = direction.RIGHT;
    let moveHandle = undefined;
    let boundaryWidth = 0;
    let boundaryHeight = 0;

    let init = (x, y, _boundaryWidth, _boundaryHeight) => {
        head = { x, y };
        tail = { x: head.x - 1, y: head.y };
        size = 2;
        speed = 1000;
        boundaryWidth = _boundaryWidth;
        boundaryHeight = _boundaryHeight;
        notify({head, tail});
        moveHandle = setInterval(moveBody, speed);
    }

    let subscribe = (f) => {
        observers.push(f);
    }

    let unsubscribe = (f) => {
        observers = observers.filter(subscriber => subscriber !== f);
    }

    let notify = (data) => {
        observers.forEach(o => o(data));
    }

    let move = (dir) => {
        if (dir !== currentDirection) {
            clearInterval(moveHandle);
            currentDirection = dir;
            moveHandle = setInterval(moveBody, speed);
        }
    }

    let moveBody = () => {   
        let aux = head;
        tail = head;            
        determineHeadPosition(currentDirection, aux);
        notify({ head, tail });
    }

    let currentPosition = () => {
        return { head, tail };
    }

    let incSize = () => {
        determineHeadPosition(currentDirection, head);
        size++;
        notify({ head, tail });
    }

    let incSpeed = () => {
        if (speed > 100) {
            speed -= 100;
            clearInterval(moveHandle);
            moveHandle = setInterval(moveBody, speed);
        }
    }

    let stop = () => {
        clearInterval(moveHandle);
    }

    let determineHeadPosition = (dir, node) => {
        switch (dir)
        {
            case direction.UP:
                head = { x: node.x, y: node.y === 0 ? boundaryHeight - 1 : node.y - 1 };
                break;
            case direction.DOWN:
                head = { x: node.x, y: node.y === boundaryHeight - 1 ? 0 : node.y + 1 };
                break;
            case direction.LEFT:
                head = { x: node.x === 0 ? boundaryWidth - 1 : node.x - 1, y: node.y };
                break;
            case direction.RIGHT:
                head = { x: node.x === boundaryWidth - 1 ? 0 : node.x + 1, y: node.y };
                break;
        }
    }

    return {
        init,
        move,
        currentPosition,
        incSize,
        incSpeed,
        subscribe,
        unsubscribe,
        stop
    }
}