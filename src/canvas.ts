export function isHigh(windowSize:number[]): boolean {
    return windowSize[1] > windowSize[0] ? true : false;
}

export function maxSize(windowSize:number[]) {
    return isHigh(windowSize) ? windowSize[0] - 10 : windowSize[1] - 10;
}

function resizeCanvas(windowSize:number[], canvas:HTMLCanvasElement) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}

export function drawGrid(gridSize:number, windowSize:number[], canvas:HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        ctx.strokeStyle = "#000000"
        ctx.fillStyle = "#DCB35C";
        const size:number = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);

        for(let i = 0; i < gridSize; ++i) {
            const rectSize = canvas.height/gridSize;
            const start = 0.5 * rectSize;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(start-1 + i*rectSize, start-1);
            ctx.lineTo(start-1 + i*rectSize, canvas.height - start);
            ctx.moveTo(start-1, start-1 + i*rectSize);
            ctx.lineTo(canvas.height - start, start-1 + i*rectSize);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawNumber(numberToDraw:number, coords:number[], windowSize:number[], gridSize:number, canvas:HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        const cellSize = windowSize[0] / gridSize;
        ctx.font = "50px Arial";
        ctx.fillText(numberToDraw.toString(), coords[0] * cellSize, coords[1] * cellSize);
    }
}

function drawBoard(board:number[][], gridSize:number, canvas:HTMLCanvasElement, windowSize:number[]) {
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            if(board[i][j] != 0) {
                drawNumber(board[i][j], [i, j], windowSize, gridSize, canvas);
            }
        }
    }
}

export function resize_canvas(windowSize:number[], canvas:HTMLCanvasElement, gridSize:number, board:number[][]) {
    console.log("1");
    resizeCanvas(windowSize, canvas);
    console.log("2");
    drawGrid(gridSize, windowSize, canvas);
    console.log("3");
    drawBoard(board, gridSize, canvas, windowSize);
    console.log("4");
}