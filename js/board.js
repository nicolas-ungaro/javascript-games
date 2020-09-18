import { elementType } from './constants.js';

export function board(_width, _height) {
    const width = _width;
    const height = _height;
    let elements = [];
    for (let i = 0; i < width; i++) {
        elements[i] = [];
        for (let j = 0; j < height; j++) {
            elements[i][j] = elementType.TERRAIN;
        }
    }

    let getSnakeTail = () => {
        const tailIdx = findElement(elementType.SNAKE_TAIL);
        if (tailIdx !== undefined) {
            return { x: tailIdx.x, y: tailIdx.y }
        }

        return undefined;
    }

    let changeHead = (position) => {
        let headIdx = findElement(elementType.SNAKE_HEAD);

        if (headIdx !== undefined) {
            elements[headIdx.y][headIdx.x] = elementType.SNAKE;
        }

        elements[position.y][position.x] = elementType.SNAKE_HEAD;
    }

    let changeTail = (position) => {
        let tailIdx = findElement(elementType.SNAKE_TAIL);
        if (tailIdx !== undefined) {
            elements[tailIdx.y][tailIdx.x] = elementType.TERRAIN;
        }
        
        elements[position.y][position.x] = elementType.SNAKE_TAIL;
    }

    let findElement = (type) => {
        for (let i = 0; i < elements.length; i++) {
            for (let j = 0; j < elements[i].length; j++) {
                if (elements[i][j] !== undefined && elements[i][j] === type) {
                    return {x: j, y: i};
                }
            }
        }

        return undefined;
    }

    let addElement = (elementType, position) => {
        position = checkBoundaries(position);
        elements[position.y][position.x] = elementType;
    }

    let getCenter = () => {
        const x = Math.ceil(width / 2);
        const y = Math.ceil(height / 2);

        return {x, y};
    }

    let checkCollision = (position) => {
        if (elements[position.y][position.x] !== elementType.TERRAIN) {
            return elements[position.y][position.x];
        }

        return undefined;
    }

    let checkBoundaries = (position) => {
        if (position.x > width) {
            position.x = 0;
        }

        if (position.y > height) {
            position.y = 0;
        }

        if (elements[position.y][position.x] !== elementType.TERRAIN) {
            throw "Position already occupied";
        }

        return position;
    }

    return {
        getSnakeTail,
        changeHead,
        changeTail,
        addElement,
        checkCollision,
        getCenter,
    }
}