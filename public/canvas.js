var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//offset from edges (both sides together)
export const CANVAS_OFFSET = 60;
export const whitePalette = {
    window: "#FFFFFF",
    buttons_background: "#CCCCCC",
    font: "#000000",
    slider: "#0000FF",
    background: "#FFFFFF",
    gridLines: "#000000",
    selected: "#FFFF00",
    given: "#00CC00",
    filled: "#E81E63",
    possibilities: "#FF0000"
};
export const blackPalette = {
    window: "#111111",
    buttons_background: "#333333",
    font: "#FF0000",
    slider: "#FF0000",
    background: "#000000",
    gridLines: "#FFFFFF",
    selected: "#FFFF00",
    given: "#00CC00",
    filled: "#E81E63",
    possibilities: "#FF0000"
};
export const traditionalPalette = {
    window: "#FFFFFF",
    buttons_background: "#CCCCCC",
    font: "#000000",
    slider: "#0000FF",
    background: "#FFFFFF",
    gridLines: "#000000",
    selected: "#00FF00",
    given: "#000000",
    filled: "#0033FF",
    possibilities: "#FF0000"
};
export const DEFAULT_PALETTE = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? blackPalette : whitePalette;
export var currentPalette = DEFAULT_PALETTE;
//return wheather window is higher than wide (pohone mode)
export function isHigh(windowSize) {
    return windowSize[1] > windowSize[0] ? true : false;
}
//returns max size of canvas that fits - CANVAS_OFFSET
export function maxSize(windowSize) {
    return isHigh(windowSize) ? windowSize[0] - CANVAS_OFFSET : windowSize[1] - CANVAS_OFFSET;
}
//changes size of canvas to fit maximum size
function resizeCanvas(windowSize, canvas) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}
//draws gridlines + selected cells
export function drawGrid(board, windowSize, canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        //clear out canvas
        ctx.strokeStyle = currentPalette.gridLines;
        ctx.fillStyle = currentPalette.background;
        const size = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);
        drawSelected(board, canvas); //draw selected cells
        //draw grid lines
        for (let i = 0; i <= board.gridSize; ++i) {
            const rectSize = canvas.height / board.gridSize;
            //const start = 0.5 * rectSize;
            const outerOffset = 0;
            ctx.beginPath();
            ctx.lineWidth = i % 3 == 0 ? 5 : 2;
            ctx.moveTo(outerOffset + i * rectSize, outerOffset);
            ctx.lineTo(outerOffset + i * rectSize, canvas.height - outerOffset);
            ctx.moveTo(outerOffset, outerOffset + i * rectSize);
            ctx.lineTo(canvas.height - outerOffset, outerOffset + i * rectSize);
            ctx.stroke();
            ctx.closePath();
        }
    }
}
//draws filled in numbers and possibilities into cells
function drawNumber(numberToDraw, coords, gridSize, canvas, colour, possibilities = false) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const cellSize = canvas.height / gridSize;
        const smallOffsetSize = cellSize / 3;
        ctx.fillStyle = colour;
        ctx.font = (Math.floor(cellSize * 0.8)).toString() + "px Arial";
        //cell possibilities
        if (possibilities) {
            const offsetY = Math.floor((numberToDraw - 1) / Math.sqrt(gridSize));
            const offsetX = (numberToDraw - 1) % Math.sqrt(gridSize);
            ctx.font = (Math.floor((cellSize * 0.8) / Math.sqrt(gridSize))).toString() + "px Arial";
            ctx.fillText(numberToDraw.toString(), (coords[0] + 0.08) * cellSize + (offsetX * smallOffsetSize), (coords[1] + 0.28) * cellSize + (offsetY * smallOffsetSize));
        }
        //cell value
        else {
            numberToDraw ? ctx.fillText(numberToDraw.toString(), (coords[0] + 0.25) * cellSize, (coords[1] + 0.8) * cellSize) : null;
        }
    }
}
//colours selected cells
export function drawSelected(board, canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        board.selectedCells.forEach((value) => {
            const x = Math.floor(value / board.gridSize);
            const y = value % board.gridSize;
            const cellSize = canvas.height / board.gridSize;
            ctx.beginPath();
            ctx.fillStyle = "#FFFF00";
            ctx.fillRect(y * cellSize, x * cellSize, cellSize, cellSize);
            ctx.stroke();
            ctx.closePath();
        });
    }
}
//draws grid, selected cells, numbers, possibilites
export function drawBoard(board_1, canvas_1, windowSize_1) {
    return __awaiter(this, arguments, void 0, function* (board, canvas, windowSize, df = false, onlyDF = false, onlyGiven = false) {
        return yield new Promise((resolve) => {
            //grid lines and selected cells
            drawGrid(board, windowSize, canvas);
            for (let i = 0; i < board.gridSize; ++i) {
                for (let j = 0; j < board.gridSize; ++j) {
                    //only possiblities
                    if (onlyDF) {
                        board.grid[i][j].possibilities.forEach((value) => {
                            drawNumber(value, [j, i], board.gridSize, canvas, currentPalette.possibilities, true);
                        });
                    }
                    //values and possibilities
                    else {
                        //possibilities in empty cells
                        if (df && board.grid[i][j].num == 0) {
                            board.grid[i][j].possibilities.forEach((value) => {
                                drawNumber(value, [j, i], board.gridSize, canvas, currentPalette.possibilities, true);
                            });
                            //drawNumber(board[i][j].possibilities.size, [j, i], windowSize, gridSize, canvas, "#FF0000", true);
                        }
                        //only values
                        else if (board.grid[i][j].num != 0 && !onlyGiven) {
                            drawNumber(board.grid[i][j].num, [j, i], board.gridSize, canvas, board.grid[i][j].given ? currentPalette.given : currentPalette.filled);
                        }
                        else if (onlyGiven && board.grid[i][j].num != 0) {
                            if (board.grid[i][j].given) {
                                drawNumber(board.grid[i][j].num, [j, i], board.gridSize, canvas, currentPalette.given);
                            }
                        }
                    }
                }
            }
            setTimeout(() => {
                resolve(true);
            }, 1);
        });
    });
}
//resize canvas + redraw grid to fit new size of canvas
export function resize_canvas(windowSize, canvas, board) {
    resizeCanvas(windowSize, canvas);
    drawBoard(board, canvas, windowSize);
}
//return grid cell coordinates from coordinates of event in window
export function coordsFromClick(event, gridSize, canvas, windowSize) {
    var clickX = event.x;
    var clickY = event.y;
    if (isHigh(windowSize)) {
        clickX -= CANVAS_OFFSET / 2;
        clickY -= (windowSize[1] - canvas.height) / 2;
    }
    else {
        clickY -= CANVAS_OFFSET / 2;
        clickX -= (windowSize[0] - canvas.width) / 2;
    }
    const cellSize = canvas.height / gridSize;
    return [Math.floor(clickY / cellSize), Math.floor(clickX / cellSize)];
}
export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
};
export function colourInit() {
    document.body.style.backgroundColor = currentPalette.window;
    const elements = document.getElementsByClassName("colour_one");
    Array.from(elements).forEach(element => {
        element.style.backgroundColor = currentPalette.buttons_background;
        element.style.color = currentPalette.font;
    });
    /* const choices = document.getElementsByClassName("colour_two");
    Array.from(choices).forEach(element => {
        (element as HTMLElement).style.backgroundColor = currentPalette.slider;
    }); */
    const slider = document.getElementById("difficulty");
    slider ? slider.style.color = currentPalette.slider : null;
    const diffDisplay = document.getElementById("diff");
    diffDisplay ? diffDisplay.style.color = currentPalette.font : null;
    const colourPick = document.getElementById("colourPick");
    colourPick ? colourPick.style.color = currentPalette.font : null;
}
export function setPalette(palette) {
    currentPalette = palette;
    colourInit();
}
