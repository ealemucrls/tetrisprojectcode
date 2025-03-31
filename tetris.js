class Tetris {

    constructor(imageX, imageY, template) {
        this.imageY = imageY;
        this.imageX = imageX;
        this.template = template;
        this.x = squareCountX / 2;
        this.y = 0;

        let blockColors = [ "red", "orange", "yellow", "green", "blue", "purple", "pink"];
        this.color = blockColors[Math.floor(Math.random() * blockColors.length)];

        document.addEventListener('keydown', (event) => {
            if(!keypressed){
                keypressed = true;
                switch(event.key){
                    case 'ArrowLeft':
                        currentBlock.moveLeft();
                        break;
                    case 'ArrowRight': 
                        currentBlock.moveRight();
                        break;
                    case 'ArrowDown':
                        gamespeed = 10;
                        changeSpeed();
                        break;
                    case 'ArrowUp':
                        currentBlock.rotateBlock();
                        break;
                }

            }
        });

        document.addEventListener('keyup', (event) => {
            keypressed = false;
            switch(event.key){
                case 'ArrowDown':
                    gamespeed = 5;
                    changeSpeed();
                    break;
            }
            
        });

    }
    


    checkBottom() {
        
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template[i].length; j++) {
                if (this.template[i][j] === 1) {
                    if (this.y + i + 1 >= squareCountY || Feild[this.y + i + 1][this.x + j] !== 0){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    checkLeft() {

        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template[i].length; j++) {
                if (this.template[i][j] === 1) {
                    if (this.x + j - 1 < 0 || Feild[this.y + i][this.x + j - 1] !==0){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    checkRight() {
    
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template[i].length; j++) {
                if (this.template[i][j] === 1) {
                    if (this.x + j + 1 >= squareCountX || Feild[this.y + i][this.x + j + 1] !== 0){
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    moveDown() {
        if (this.checkBottom()) {
            this.y++;
        
        }
        else{
            this.placeBlock();
            clearLines();
            currentBlock = nextBlock;
            nextBlock = randomblock();
            currentBlock.y = 0;
            currentBlock.x = Math.floor(squareCountX / 2);

            if(!currentBlock.checkBottom()){
                isGameStart = false;
                clearInterval(startGame);
                return;
            }
        }
    }

    moveLeft() {
        if (this.checkLeft()) {
            console.log("Moving left ", this.x);
            this.x -= 1;
        }
    }

    moveRight() {
        if (this.checkRight()) {
            console.log("Moving right ", this.x);
            this.x++;
        }
    }
    placeBlock(){
        for(let i = 0; i < currentBlock.template.length; i++){
            for(let j = 0; j < currentBlock.template[i].length; j++){
                if(currentBlock.template[i][j] === 1){
                    if(this.y + i >= 0 && this.y + i < squareCountY && this.x + j >= 0 && this.x + j < squareCountX){
                        Feild[this.y + i][this.x + j] = currentBlock.color;
                    }
                }
            }
        }
    }
    rotateBlock(){
        let r = rotate(this.template);
        for(let i = 0; i < r.length; i++){
            for(let j = 0; j < r[i].length; j++){
                if(r[i][j] === 1){
                    if(this.x + j < 0 || this.x + j >= squareCountX || this.y + i >= squareCountY || (this.y + i >= 0 && Feild[this.y + i][this.x + j] !== 0)){
                        return;
                    }
                }
            }
        }
        this.template = r;
    }
}

function rotate(matrix) {
    const n = matrix.length;
    let rotatearray = [];

    for (let i = 0; i < n; i++) {
        rotatearray[i] = [];
        for (let j = 0; j < n; j++) {
            rotatearray[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rotatearray[j][n - i - 1] = matrix[i][j];
        }
    }

    return rotatearray;
}


const pixelSize = 24;
const size = 40;
const speed = 5;
const frames = 24;
const nextBlockCanvas = document.getElementById("mini");
const canvas = document.getElementById("frame");
const points = document.getElementById("points");
const d = canvas.getContext("2d");
const nBlock= nextBlockCanvas.getContext("2d");
const p = points.getContext("2d");
const width = 12;
const height = 21; 
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

const tiles = [
    new Tetris(0, 120, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]),

    new Tetris(0, 120, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),

    new Tetris(0, 90, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),

    new Tetris(0, 60, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]),

    new Tetris(0, 60, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),

    new Tetris(0, 30, [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]),

    new Tetris(0, 20, [
        [1, 1],
        [1, 1],
    ])
]

let randomblock = () => {
    return Object.create(tiles[Math.floor(Math.random() * tiles.length)]);
}

let keypressed = false;
let startGame;
let gamespeed = 5;
let endGame;
let currentBlock = randomblock();
let nextBlock = randomblock();
let score = 0;
let isGameStart = true;
let black = "black";

let Feild = new Array(squareCountY).fill(0).map(() => Array(squareCountX).fill(0));



let clearLines = () => {
    for (let i = 0; i < Feild.length; i++) {
        let CompleteRow = true; 
        for (let j = 0; j < Feild[i].length; j++) {
            if (Feild[i][j] === 0) {
                CompleteRow = false; 
                break;
            }
        }

        if (CompleteRow) {
            score += 500; 
            for (let k = i; k > 0; k--) {
                Feild[k] = Feild[k - 1].slice(); 
            }

            Feild[0] = new Array(Feild[i].length).fill(0);
        }
    }
};

let drawRect = (x, y, width, height, black) => {
    d.fillStyle = black;
    d.fillRect(x, y, width, height);
};

let drawBoard = () => {
    drawRect(0, 0, canvas.width, canvas.height, "gray");
    for(let i = 1; i < squareCountX + 1; i++){
        drawRect(i * size, 0, 2, canvas.height, "black");
    }
    for(let i = 1; i < squareCountY + 1; i++){
        drawRect(0, i * size, canvas.width, 2, "black");
    }
};


let drawSquare = () => {
    for(let i = 0; i < Feild.length; i++) {
        for(let j = 0; j < Feild[i].length; j++){
            if(Feild[i][j] !== 0){

                d.fillStyle = Feild[i][j];
                d.fillRect(j * size, i * size, size, size);

                d.strokeStyle = "black";
                d.lineWidth = 2.5;
                d.strokeRect(j * size, i * size, size, size);
            }
        }
    }
}

let drawBlock = () => {
    for(let i = 0; i < currentBlock.template.length; i++){
        for(let j = 0; j < currentBlock.template[i].length; j++){
            if(currentBlock.template[i][j] === 1){
                let x = currentBlock.x + j;
                let y = currentBlock.y + i;

                d.fillStyle = currentBlock.color;
                d.fillRect(x * size, y * size, size, size);

                d.strokeStyle = "black";
                d.lineWidth = 2.5;
                d.strokeRect(x * size, y * size, size, size);
            }
        }
    }
};
let drawNextBlock = () => {
    nBlock.clearRect(0, 0, nextBlockCanvas.width, nextBlockCanvas.height);

    let previewSize = size / 1.5;  
    let offsetX = (nextBlockCanvas.width - nextBlock.template[0].length * previewSize) / 2;
    let offsetY = (nextBlockCanvas.height - nextBlock.template.length * previewSize) / 2;

    for (let i = 0; i < nextBlock.template.length; i++) {
        for (let j = 0; j < nextBlock.template[i].length; j++) {
            if (nextBlock.template[i][j] === 1) {
            
                nBlock.fillStyle = nextBlock.color;
                nBlock.fillRect(offsetX + j * previewSize, offsetY + i * previewSize, previewSize, previewSize);
                nBlock.strokeStyle = "black";
                nBlock.strokeRect(offsetX + j * previewSize, offsetY + i * previewSize, previewSize, previewSize);
            }
        }
    }
};



let update = () => {
    if(isGameStart){
        currentBlock.moveDown();
    }
};


let drawScore = () => {
    p.clearRect(0, 0, points.width, points.height);
    p.fillStyle = "black";
    p.font = "34px Lucida Sans";
    p.fillText("Score: " + score, 45, 60);
}

let drawGameOver = () => {
    d.fillStyle = "Black";
    d.font = "48px Lucida Sans";
    d.fillText("Game Over", 90, 380);
}

let draw = () => {

    drawBoard();
    drawSquare();
    drawBlock();
    drawNextBlock();
    drawScore();
    
    if(!isGameStart){
       drawGameOver(); 
    }
};

let gameloop;

let changeSpeed = () => {
    if (gameloop) clearInterval(gameloop);
    gameloop = setInterval(update, 1000 / gamespeed);
};

let game = () => {

    setInterval(draw, 1000 / frames);
    changeSpeed();
  
};

game();