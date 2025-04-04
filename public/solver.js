var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { drawBoard } from "./canvas.js";
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
        if (unsolvedSquares.has(row ? (lineIndex * gridSize) + i : (i * gridSize) + lineIndex)) {
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
    if (!((middleCoords[0] == 1 || middleCoords[0] == 4 || middleCoords[0] == 7) && (middleCoords[1] == 1 || middleCoords[1] == 4 || middleCoords[1] == 7))) {
        console.log("bad square");
        console.log(middleCoords);
    }
    for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (unsolvedSquares.has((middleCoords[0] + i) * gridSize + (middleCoords[1] + j))) {
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
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
function lineSingles(board, gridSize, row) {
    for (let i = 0; i < gridSize; ++i) {
        let possibleNums = new Set;
        for (let j = 0; j < gridSize; ++j) {
            if (row) {
                board[i][j].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
            else {
                board[j][i].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
        }
        if (row && i == 7)
            console.log(possibleNums);
        possibleNums.forEach((value, key, set) => {
            let numCount = 0;
            let jIndex = 0;
            if (row) {
                for (let j = 0; j < gridSize; ++j) {
                    if (board[i][j].possibilities.has(value)) {
                        ++numCount;
                        if (numCount == 2) {
                            break;
                        }
                        jIndex = j;
                    }
                }
            }
            else {
                for (let j = 0; j < gridSize; ++j) {
                    if (board[j][i].possibilities.has(value)) {
                        ++numCount;
                        if (numCount == 2) {
                            break;
                        }
                        jIndex = j;
                    }
                }
            }
            if (value == 1)
                console.log(numCount);
            if (numCount == 1) {
                console.log("found something");
                if (row) {
                    board[i][jIndex].possibilities = new Set([value]);
                }
                else {
                    board[jIndex][i].possibilities = new Set([value]);
                }
            }
        });
    }
}
function waveFunctionCollapseStep(board, gridSize, unsolvedSquares, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        let checkSquares = [];
        unsolvedSquares.forEach((value, key, set) => { checkSquares[value] = [board[Math.floor(value / gridSize)][value % gridSize].possibilities.size, value]; });
        checkSquares.sort((a, b) => a[0] - b[0]);
        for (let i = 0; checkSquares[i][0] == 1; ++i) {
            const x = Math.floor(checkSquares[i][1] / gridSize);
            const y = checkSquares[i][1] % gridSize;
            let setValue = 0;
            board[x][y].possibilities.forEach((value, key, set) => { setValue = value; });
            board[x][y].num = setValue;
            console.log("pos:" + board[x][y].possibilities.size);
            console.log("val:" + setValue);
            unsolvedSquares.delete(checkSquares[i][1]);
            board[x][y].possibilities = new Set;
            let delValue = new Set([setValue]);
            updateLine(board, gridSize, true, x, delValue, unsolvedSquares);
            updateLine(board, gridSize, false, y, delValue, unsolvedSquares);
            updateSquare(board, gridSize, [(Math.floor(x / Math.sqrt(gridSize)) * 3) + 1, (Math.floor(y / Math.sqrt(gridSize)) * 3) + 1], delValue, unsolvedSquares);
            yield drawBoard(board, gridSize, canvas, windowSize, true);
            wait(500);
        }
        console.log("here");
        lineSingles(board, gridSize, true);
        lineSingles(board, gridSize, false);
    });
}
export function solve(board, gridSize, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
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
        for (let i = 0; unsolvedSquares.size > 0 && i < 100; ++i) {
            yield waveFunctionCollapseStep(board, gridSize, unsolvedSquares, windowSize, canvas);
        }
    });
}
