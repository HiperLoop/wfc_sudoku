export type cell = {
    num:number,
    possibilities:number[],
    selected:boolean
};

export function populateBoard(gridSize:number) {
    let board:cell[][] = [];
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board[i][j] = {num:0, possibilities:[-1], selected:false};
            board[i][j].num = Math.floor(Math.random() * gridSize) + 1;
        }
    }
    return board;
}