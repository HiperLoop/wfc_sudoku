export function populateBoard(gridSize:number) {
    let board:number[][] = [];
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board[i][j] = Math.floor(Math.random() * gridSize) + 1;
        }
    }
    return board;
}