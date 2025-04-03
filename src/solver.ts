import { cell } from "./board.js";

function getNumbersInLine(board:cell[][], gridSize:number, row:boolean, lineIndex:number) {
    let foundNumbers = new Set<number>();
    for(let i = 0; i < gridSize; ++i) {
        if(row) {
            if(board[lineIndex][i].num > 0) {
                foundNumbers.add(board[lineIndex][i].num);
            }
        }
        else {
            if(board[i][lineIndex].num > 0) {
                foundNumbers.add(board[i][lineIndex].num);
            }
        }
    }
    return foundNumbers;
}

function updateLine(board:cell[][], gridSize:number, row:boolean, lineIndex:number, remove:Set<number>, unsolvedSquares:Set<number>) {
    for(let i = 0; i < gridSize; ++i) {
        if(!unsolvedSquares.has(row ? (lineIndex*gridSize) + i : (i*gridSize) + lineIndex)) {
            remove.forEach((value:number, key:number, set:Set<number>) => {
                    row ? board[lineIndex][i].possibilities.delete(value) : board[i][lineIndex].possibilities.delete(value);
                }
            );
        }
    }
}

function getNumbersInSquare(board:cell[][], middleCoords:number[]) {
    let foundNumbers = new Set<number>();
    for(let i = -1; i <= 1; ++i) {
        for(let j = -1; j <= 1; ++j) {
            board[middleCoords[0]+i][middleCoords[1]+j].num > 0 ? foundNumbers.add(board[middleCoords[0]+i][middleCoords[1]+j].num) : null;
        }
    }
    return foundNumbers;
}

function updateSquare(board:cell[][], gridSize:number, middleCoords:number[], remove:Set<number>, unsolvedSquares:Set<number>) {
    for(let i = -1; i <= 1; ++i) {
        for(let j = -1; j <= 1; ++j) {
            if(unsolvedSquares.has((middleCoords[0] + i)*gridSize + j)) {
                remove.forEach((value:number, key:number, set:Set<number>) => {
                        board[middleCoords[0] + i][middleCoords[1] + j].possibilities.delete(value);
                    }
                );
            }
        }
    }
}

export function generateDegreesOfFreedom(board:cell[][], gridSize:number, unsolvedSquares:Set<number>) {
    for(let i = 0; i < gridSize; ++i) {
        updateLine(board, gridSize, true, i, getNumbersInLine(board, gridSize, true, i), unsolvedSquares);
        updateLine(board, gridSize, false, i, getNumbersInLine(board, gridSize, false, i), unsolvedSquares);
    }
    for(let i = 0; i < Math.sqrt(gridSize); ++i) {
        for(let j = 0; j < Math.sqrt(gridSize); ++j) {
            updateSquare(board, gridSize, [(3*i)+1, (3*j)+1], getNumbersInSquare(board, [(3*i)+1, (3*j)+1]), unsolvedSquares);
        }
    }
}

export function solve(board:cell[][], gridSize:number) {
    let unsolvedSquares:Set<number> = new Set<number>;
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            if(board[i][j].num == 0) {
                unsolvedSquares.add((i*gridSize)+j);
            }
            else {board[i][j].possibilities = new Set<number>;}
        }
    }
    generateDegreesOfFreedom(board, gridSize, unsolvedSquares);
}