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
};

export function board_generateUnsolvedSquares() {
    
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