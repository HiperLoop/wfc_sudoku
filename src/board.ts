import { drawBoard } from "./canvas.js";

export type cell = {
    num:number,
    possibilities:Set<number>,
    selected:boolean,
    given:boolean
};

export type board = {
    grid:cell[][],
    gridSize:number,
    unsolvedSquares:Set<number>,
    selectedCells:Set<number>,
};

export const empty_grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]];

export function cellBoardFromValues(values:number[][]) {
    let board:cell[][] = [];
    for(let i = 0; i < values[0].length; ++i) {
        board[i] = [];
        for(let j = 0; j < values[0].length; ++j) {
            board[i][j] = {num:values[i][j], possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false, given:values[i][j] > 0};
        }
    }
    return board;
}

export function board_generateUnsolvedSquares(board:board) {
    for(let i = 0; i < board.gridSize; ++i) {
        for(let j = 0; j < board.gridSize; ++j) {
            if(board.grid[i][j].num == 0) {
                board.unsolvedSquares.add((i*board.gridSize)+j);
            }
            else {board.grid[i][j].possibilities = new Set<number>([board.grid[i][j].num]);}
        }
    }
}

export function board_random(gridSize:number) {
    let board:cell[][] = [];
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            const temp:Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            board[i][j] = {num:0, possibilities:temp, selected:false, given:true};
            board[i][j].num = Math.floor(Math.random() * 2) >= 1 ?  Math.floor(Math.random() * gridSize) + 1 : 0;
        }
    }
    /* board[0][0].num = 1;
    board[2][2].num = 3; */
    return board;
}

export function board_selectCell(board:board, coords:number[], cnv:HTMLCanvasElement, windowSize:number[], ctrl:boolean) {
    board.grid[coords[0]][coords[1]].selected = !board.grid[coords[0]][coords[1]].selected;
    if(ctrl) {
        board.grid[coords[0]][coords[1]].selected ? board.selectedCells.add((board.gridSize * coords[0]) + coords[1]) : board.selectedCells.delete((board.gridSize * coords[0]) + coords[1]);
    }
    else {
        board.selectedCells.forEach((value:number) => {board.grid[Math.floor(value/board.gridSize)][value%board.gridSize].selected = false;});
        board.selectedCells = new Set<number>(board.grid[coords[0]][coords[1]].selected ? [(board.gridSize * coords[0]) + coords[1]] : null);
    }
    drawBoard(board, cnv, windowSize);
}

export function keyboardInput_init(board:board, cnv:HTMLCanvasElement, windowSize:number[]) {
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        console.log("inside:");
        console.log(board.selectedCells);
        const num:number = Number(event.key);
        console.log(num);
        if(num > 0 && num <= 9) {
            board.selectedCells.forEach((value:number) => {
                board.grid[Math.floor(value/board.gridSize)][value%board.gridSize].num = num;
            });
        }
      
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
        drawBoard(board, cnv, windowSize);
      }, true);
}