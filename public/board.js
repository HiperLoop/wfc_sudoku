export function populateBoard(gridSize) {
    let board = [];
    for (let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for (let j = 0; j < gridSize; ++j) {
            board[i][j] = Math.floor(Math.random() * gridSize) + 1;
        }
    }
    return board;
}
