export function isHigh(windowSize) {
    return windowSize[1] > windowSize[0] ? true : false;
}
export function maxSize(windowSize) {
    return isHigh(windowSize) ? windowSize[0] - 10 : windowSize[1] - 10;
}
function resizeCanvas(windowSize, canvas) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}
export function drawGrid(gridSize, windowSize, canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#FFFFFF";
        const size = maxSize(windowSize);
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i <= gridSize; ++i) {
            const rectSize = canvas.height / gridSize;
            const start = 0.5 * rectSize;
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
function drawNumber(numberToDraw, coords, windowSize, gridSize, canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const cellSize = canvas.height / gridSize;
        ctx.fillStyle = "#0000CC";
        ctx.font = (Math.floor(cellSize * 0.8)).toString() + "px Arial";
        ctx.fillText(numberToDraw.toString(), (coords[0] + 0.25) * cellSize, (coords[1] + 0.8) * cellSize);
    }
}
export function drawBoard(board, gridSize, canvas, windowSize, df = false) {
    drawGrid(gridSize, windowSize, canvas);
    for (let i = 0; i < gridSize; ++i) {
        for (let j = 0; j < gridSize; ++j) {
            if (df) {
                if (board[i][j].possibilities.size > 0) {
                    drawNumber(board[i][j].possibilities.size, [j, i], windowSize, gridSize, canvas);
                }
            }
            else if (board[i][j].num != 0) {
                drawNumber(board[i][j].num, [j, i], windowSize, gridSize, canvas);
            }
        }
    }
}
export function resize_canvas(windowSize, canvas, gridSize, board) {
    resizeCanvas(windowSize, canvas);
    drawBoard(board, gridSize, canvas, windowSize);
}
