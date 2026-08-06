const Container = document.getElementById("container");
const snakeCanvas = document.getElementById("SnakeCanvas");
const BlocksX = 40;
const BlocksY = 16;

snakeCanvas.width = Container.offsetWidth - 60;
snakeCanvas.height = snakeCanvas.width / (BlocksX/BlocksY);


const pixelsPerBlock = snakeCanvas.height/BlocksY;
let centerX = (Math.ceil(BlocksX / 2) - 1) * pixelsPerBlock;
let centerY = (Math.ceil(BlocksY / 2) - 1) * pixelsPerBlock;
const interval = 100;

const eventKeysToDirection = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
    ArrowRight: 'right',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowUp: 'up',
};

const oppositeDirections = {
    right: 'left',
    left: 'right',
    up: 'down',
    down: 'up',
};

let score = 0;
let length = 1;

let snakeCoords = {
    H: { x: centerX, y: centerY },
    B: [],
    F: {},
};

do {
    snakeCoords["F"] = {x: Math.floor(Math.random() * BlocksX)* pixelsPerBlock, y:Math.floor(Math.random() * BlocksY)* pixelsPerBlock};
}
while(snakeCoords["H"].x == snakeCoords["F"].x && snakeCoords["H"].y && snakeCoords["F"].y);

let gameOver = 0;
let moveDirection = null;
let oppositeDirection = null;
let repeat = window.setInterval(main, interval);

function reset(){
    document.getElementById("restart").style.display = "none";
    score = 0;
    length = 1;

    snakeCoords = {
        H: { x: centerX, y: centerY },
        B: [],
        F: {},
    };

    do {
        snakeCoords["F"] = {x: Math.floor(Math.random() * BlocksX)* pixelsPerBlock, y:Math.floor(Math.random() * BlocksY)* pixelsPerBlock};
    }
    while(snakeCoords["H"].x == snakeCoords["F"].x && snakeCoords["H"].y && snakeCoords["F"].y);

    gameOver = 0;
    moveDirection = null;
    oppositeDirection = null;
    repeat = window.setInterval(main, interval);
}

reset()



function render(){
    if (!gameOver){
        let context = snakeCanvas.getContext('2d');
        context.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);
        context.strokeStyle = 'black';
        context.fillStyle = 'red';

        context.fillRect(snakeCoords["H"].x, snakeCoords["H"].y, pixelsPerBlock, pixelsPerBlock);
        context.fillStyle = 'black';

        for (let block of snakeCoords["B"]){
            context.fillRect(block.x, block.y, pixelsPerBlock, pixelsPerBlock);
        }
        context.fillStyle = 'green';

        context.fillRect(snakeCoords["F"].x, snakeCoords["F"].y, pixelsPerBlock, pixelsPerBlock);
        document.getElementById("score").innerText = `Score: ${score}`;
        document.getElementById("length").innerText = `Length: ${length}`;
    }
}

function moveSnake(){
    if (moveDirection == null){
        return;
    }
    
    snakeCoords["B"].unshift({x: snakeCoords["H"].x, y: snakeCoords["H"].y});

    if (moveDirection === 'up') {
        snakeCoords.H.y -= pixelsPerBlock;
    } else if (moveDirection === 'down') {
        snakeCoords.H.y += pixelsPerBlock;
    } else if (moveDirection === 'right') {
        snakeCoords.H.x += pixelsPerBlock;
    } else {
        snakeCoords.H.x -= pixelsPerBlock;
    }
    snakeCoords["B"].pop();

    if (snakeCoords.B.length > 0) {
        oppositeDirection = oppositeDirections[moveDirection];
      }
}

function CheckOut(){
    if (
        snakeCoords["H"].x < 0 || snakeCoords["H"].x > snakeCanvas.width ||
        snakeCoords["H"].y < 0 || snakeCoords["H"].y > snakeCoords.height
    ){
        gameOver = 1;
    }
}

function CheckPassThrough(obj){
    if (!gameOver){
        for (let block of snakeCoords["B"]){
            if (block.x == obj.x && block.y == obj.y){
                gameOver = 1;
                return gameOver;
            }
        }
    }
    else {
        return gameOver;
    }
}

function CheckFood(){
    if (((snakeCoords["H"].x === snakeCoords["F"].x) && (snakeCoords["H"].y === snakeCoords["F"].y)) && !gameOver){
        do {
            snakeCoords["F"] = {x: Math.floor(Math.random() * BlocksX)* pixelsPerBlock, y:Math.floor(Math.random() * BlocksY)* pixelsPerBlock};
        }
        while(snakeCoords["F"] == snakeCoords["H"] || CheckPassThrough(snakeCoords["F"]));
        snakeCoords["B"].push(0);
        score++;
        length++;
    }
}

function main(){
    moveSnake();

    CheckOut();
    gameOver = CheckPassThrough(snakeCoords["H"]);
    CheckFood();

    render();
    if (gameOver){
        clearInterval(repeat);
        document.getElementById("restart").style.display = "block";
    }   
}

document.addEventListener("keypress", event =>{
    event.preventDefault();
    let direction = eventKeysToDirection[event.key] || moveDirection;
    moveDirection = direction === oppositeDirection ? moveDirection : direction; 
})

document.getElementById("restart").addEventListener("click", event => {
    event.preventDefault();
    reset();
})


