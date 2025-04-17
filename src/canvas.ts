import { board, cell } from "./board.js";

//offset from edges (both sides together)
export const CANVAS_OFFSET = 20;

//return wheather window is higher than wide (pohone mode)
export function isHigh(windowSize:number[]): boolean {
    return windowSize[1] > windowSize[0] ? true : false;
}

//returns max size of canvas that fits - CANVAS_OFFSET
export function maxSize(windowSize:number[]) {
    return isHigh(windowSize) ? windowSize[0] - CANVAS_OFFSET : windowSize[1] - CANVAS_OFFSET;
}

//changes size of canvas to fit maximum size
function resizeCanvas(windowSize:number[], canvas:HTMLCanvasElement) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}

//draws gridlines + selected cells
export function drawGrid(board:board, windowSize:number[], canvas:HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        //clear out canvas
        ctx.strokeStyle = "#000000"
        ctx.fillStyle = "#FFFFFF";
        const size:number = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);
        drawSelected(board, canvas); //draw selected cells

        //draw grid lines
        for(let i = 0; i <= board.gridSize; ++i) {
            const rectSize = canvas.height/board.gridSize;
            //const start = 0.5 * rectSize;
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

//draws filled in numbers and possibilities into cells
function drawNumber(numberToDraw:number, coords:number[], gridSize:number, canvas:HTMLCanvasElement, colour:string, possibilities:boolean=false) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        const cellSize = canvas.height / gridSize;
        const smallOffsetSize = cellSize/3;
        ctx.fillStyle = colour;
        ctx.font = (Math.floor(cellSize * 0.8)).toString() + "px Arial";
        //cell possibilities
        if(possibilities) {
            const offsetY = Math.floor((numberToDraw-1)/Math.sqrt(gridSize));
            const offsetX = (numberToDraw-1) % Math.sqrt(gridSize);
            ctx.font = (Math.floor((cellSize * 0.8)/Math.sqrt(gridSize))).toString() + "px Arial";
            ctx.fillText(numberToDraw.toString(), (coords[0] + 0.08) * cellSize + (offsetX * smallOffsetSize), (coords[1] + 0.28) * cellSize + (offsetY * smallOffsetSize));
        }
        //cell value
        else {
            ctx.fillText(numberToDraw.toString(), (coords[0]+ 0.25) * cellSize, (coords[1] + 0.8) * cellSize);
        }
    }
}

//colours selected cells
export function drawSelected(board:board, canvas:HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(ctx) {
        board.selectedCells.forEach((value:number) => {
            const x = Math.floor(value/board.gridSize);
            const y = value % board.gridSize;
            const cellSize = canvas.height/board.gridSize;

            ctx.beginPath();
            ctx.fillStyle = "#FFFF00";
            ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
            ctx.stroke();
            ctx.closePath();
        });
    }
}

//draws grid, selected cells, numbers, possibilites
export async function drawBoard(board:board, canvas:HTMLCanvasElement, windowSize:number[], df:boolean=false, onlyDF:boolean=false) {
    return await new Promise<boolean>((resolve) => {
        //grid lines and selected cells
        drawGrid(board, windowSize, canvas);
        for(let i = 0; i < board.gridSize; ++i) {
            for(let j = 0; j < board.gridSize; ++j) {
                //only possiblities
                if(onlyDF) {
                    board.grid[i][j].possibilities.forEach((value:number) => {
                        drawNumber(value, [j, i], board.gridSize, canvas, "#FF0000", true);
                    });
                }
                //values and possibilities
                else {
                    //possibilities in empty cells
                    if(df && board.grid[i][j].num == 0) { 
                        board.grid[i][j].possibilities.forEach((value:number) => {
                            drawNumber(value, [j, i], board.gridSize, canvas, "#FF0000", true);
                        });
                        //drawNumber(board[i][j].possibilities.size, [j, i], windowSize, gridSize, canvas, "#FF0000", true);
                    }
                    //only values
                    else if(board.grid[i][j].num != 0) {
                        drawNumber(board.grid[i][j].num, [j, i], board.gridSize, canvas, board.grid[i][j].given ? "#00CC00" : "#E81E63");
                    }
                }
            }
        }
        setTimeout(() => { 
            resolve(true);
        }, 1);
    });
}

//resize canvas + redraw grid to fit new size of canvas
export function resize_canvas(windowSize:number[], canvas:HTMLCanvasElement, board:board) {
    resizeCanvas(windowSize, canvas);
    drawBoard(board, canvas, windowSize);
}

//return grid cell coordinates from coordinates of event in window
export function coordsFromClick(event:MouseEvent, gridSize:number, canvas:HTMLCanvasElement, windowSize:number[]) {
    var clickX:number = event.x;
    var clickY:number = event.y;
    if(isHigh(windowSize)) {
        clickX -= CANVAS_OFFSET;
        clickY -= (windowSize[1] - canvas.height)/2;
    }
    else {
        clickY -= CANVAS_OFFSET;
        clickX -= (windowSize[0] - canvas.width)/2;
    }
    const cellSize = canvas.height/gridSize;

    return [Math.floor(clickY/cellSize), Math.floor(clickX/cellSize)];
}