import { cell } from "./board.js";

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
        ctx.fillStyle = "#FFFFFF";
        const size:number = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);

        for(let i = 0; i <= gridSize; ++i) {
            const rectSize = canvas.height/gridSize;
            const start = 0.5 * rectSize;
            const outerOffset = 0;
            ctx.beginPath();
            ctx.lineWidth = i % 3 == 0 ? 5 : 2;
            ctx.moveTo(outerOffset + i*rectSize, outerOffset);
            ctx.lineTo(outerOffset + i*rectSize, canvas.height - outerOffset);
            ctx.moveTo(outerOffset, outerOffset + i*rectSize);
            ctx.lineTo(canvas.height - outerOffset, outerOffset + i*rectSize);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawNumber(numberToDraw:number, coords:number[], windowSize:number[], gridSize:number, canvas:HTMLCanvasElement, colour:string) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        const cellSize = canvas.height / gridSize;
        ctx.fillStyle = colour;
        ctx.font = (Math.floor(cellSize * 0.8)).toString() + "px Arial";
        ctx.fillText(numberToDraw.toString(), (coords[0]+ 0.25) * cellSize, (coords[1] + 0.8) * cellSize);
    }
}

export async function drawBoard(board:cell[][], gridSize:number, canvas:HTMLCanvasElement, windowSize:number[], df:boolean=false) {
    return await new Promise<boolean>((resolve) => {
        drawGrid(gridSize, windowSize, canvas);
        for(let i = 0; i < gridSize; ++i) {
            for(let j = 0; j < gridSize; ++j) {
                if(df && board[i][j].possibilities.size > 0) {
                    drawNumber(board[i][j].possibilities.size, [j, i], windowSize, gridSize, canvas, "#FF0000");
                }
                else if(board[i][j].num != 0) {
                    drawNumber(board[i][j].num, [j, i], windowSize, gridSize, canvas, "#0000CC");
                }
            }
        }
        setTimeout(() => { 
            resolve(true);
        }, 10);
    });
}

export function resize_canvas(windowSize:number[], canvas:HTMLCanvasElement, gridSize:number, board:cell[][]) {
    resizeCanvas(windowSize, canvas);
    drawBoard(board, gridSize, canvas, windowSize);
}