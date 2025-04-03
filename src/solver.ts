import { cell } from "./board.js";

function getNumbersInLine(board:cell[][], gridSize:number, row:boolean, lineIndex:number) {
    let foundNumbers = new Set();
    for(let i = 0; i < gridSize; ++i) {
        foundNumbers.add(row ? board[lineIndex][i]: board[i][lineIndex]);
    }
}

export function generateDegreesOfFreedom(board:cell[][], gridSize:number) {

}