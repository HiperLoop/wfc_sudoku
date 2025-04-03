function getNumbersInLine(board, gridSize, row, lineIndex) {
    let foundNumbers = new Set();
    for (let i = 0; i < gridSize; ++i) {
        foundNumbers.add(row ? board[lineIndex][i] : board[i][lineIndex]);
    }
}
export function generateDegreesOfFreedom(board, gridSize) {
}
