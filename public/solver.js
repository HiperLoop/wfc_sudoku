function getNumbersInLine(board, gridSize, row, lineIndex) {
    let foundNumbers = new Set();
    for (let i = 0; i < gridSize; ++i) {
        if (row) {
            if (board[lineIndex][i].num > 0) {
                foundNumbers.add(board[lineIndex][i].num);
            }
        }
        else {
            if (board[i][lineIndex].num > 0) {
                foundNumbers.add(board[i][lineIndex].num);
            }
        }
    }
    return foundNumbers;
}
function updateLine(board, gridSize, row, lineIndex, remove, unsolvedSquares) {
    for (let i = 0; i < gridSize; ++i) {
        if (!unsolvedSquares.has(row ? (lineIndex * gridSize) + i : (i * gridSize) + lineIndex)) {
            remove.forEach((value, key, set) => {
                row ? board[lineIndex][i].possibilities.delete(value) : board[i][lineIndex].possibilities.delete(value);
            });
        }
    }
}
function getNumbersInSquare(board, middleCoords) {
    let foundNumbers = new Set();
    for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            board[middleCoords[0] + i][middleCoords[1] + j].num > 0 ? foundNumbers.add(board[middleCoords[0] + i][middleCoords[1] + j].num) : null;
        }
    }
    return foundNumbers;
}
function updateSquare(board, gridSize, middleCoords, remove, unsolvedSquares) {
    for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (unsolvedSquares.has((middleCoords[0] + i) * gridSize + j)) {
                remove.forEach((value, key, set) => {
                    board[middleCoords[0] + i][middleCoords[1] + j].possibilities.delete(value);
                });
            }
        }
    }
}
export function generateDegreesOfFreedom(board, gridSize, unsolvedSquares) {
    for (let i = 0; i < gridSize; ++i) {
        updateLine(board, gridSize, true, i, getNumbersInLine(board, gridSize, true, i), unsolvedSquares);
        updateLine(board, gridSize, false, i, getNumbersInLine(board, gridSize, false, i), unsolvedSquares);
    }
    for (let i = 0; i < Math.sqrt(gridSize); ++i) {
        for (let j = 0; j < Math.sqrt(gridSize); ++j) {
            updateSquare(board, gridSize, [(3 * i) + 1, (3 * j) + 1], getNumbersInSquare(board, [(3 * i) + 1, (3 * j) + 1]), unsolvedSquares);
        }
    }
}
export function solve(board, gridSize) {
    let unsolvedSquares = new Set;
    for (let i = 0; i < gridSize; ++i) {
        for (let j = 0; j < gridSize; ++j) {
            if (board[i][j].num == 0) {
                unsolvedSquares.add((i * gridSize) + j);
            }
            else {
                board[i][j].possibilities = new Set;
            }
        }
    }
    generateDegreesOfFreedom(board, gridSize, unsolvedSquares);
}
