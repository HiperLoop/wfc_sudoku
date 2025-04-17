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

//generates a baord element from a 2d array of numbers
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

//populates board:unsolvedSquares with coordinates of unsolved cells
//sets the possibilities of solved squares to just the solved number
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

//returns a random board (not necessarily valid sudoku)
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

//modifies the board:selectedCells and board:grid:selected properties to indicated user selected cells -> draws them
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

export function board_deselectAll(board:board, cnv:HTMLCanvasElement, windowSize:number[]) {
    board.selectedCells.forEach((value:number) => {board.grid[Math.floor(value/board.gridSize)][value%board.gridSize].selected = false;});
    board.selectedCells = new Set<number>;
    drawBoard(board, cnv, windowSize);
}

export function board_lockGiven(board:board) {
    for(let i = 0; i < board.gridSize; ++i) {
        for(let j = 0; j < board.gridSize; ++j) {
            if(board.grid[i][j].num != 0) {
                board.grid[i][j].given = true;
            }
        }
    }
}

//converts string to board
export function board_stringToGrid(inputString:string) {
    var numbers:number[][] = [];
    //worng string length
    if(inputString.length != 81) {return [numbers, [[inputString.length]]];}

    //convert string to grid
    for(let i = 0; i < inputString.length; ++i) {
        if(i % 9 == 0) {numbers[Math.floor(i/9)] = [];}
        numbers[Math.floor(i/9)][i%9] = inputString[i] == "." ? 0 : Number(inputString[i]);
    }
    return [numbers, [[-1]]];
}

//converts board to string
export function board_boardToString(board:board, onlyGiven:boolean=false) {
    var outputString:string = "";
    for(let i = 0; i < board.gridSize; ++i) {
        for(let j = 0; j < board.gridSize; ++j) {
            outputString += board.grid[i][j].num == 0 ? "." : onlyGiven ? board.grid[i][j].given ? board.grid[i][j].num.toString() : "." : board.grid[i][j].num.toString();
        }
    }
    return outputString;
}