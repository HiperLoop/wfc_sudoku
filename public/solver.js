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
import { set_intersection, set_subtraction, set_union } from "./set_arithmetic.js";
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
function updateLine(board, gridSize, row, lineIndex, remove, unsolvedSquares, skipSquare = -1) {
    for (let i = 0; i < gridSize; ++i) {
        if (i < (skipSquare + 1) * Math.sqrt(gridSize) && i >= skipSquare * Math.sqrt(gridSize)) {
            continue;
        }
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
        let solved = true;
        for (let j = 0; j < gridSize; ++j) {
            if (row) {
                if (board[i][j].possibilities.size > 1) {
                    solved = false;
                }
                board[i][j].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
            else {
                if (board[i][j].possibilities.size > 1) {
                    solved = false;
                }
                board[j][i].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
        }
        if (solved) {
            continue;
        }
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
            //if(value == 1) console.log(numCount);
            if (numCount == 1) {
                //console.log("found something");
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
function boxSingles(board, gridSize) {
    const gridSqrt = Math.sqrt(gridSize);
    for (let i = 0; i < gridSqrt; ++i) {
        for (let j = 0; j < gridSqrt; ++j) {
            let possibleNums = new Set;
            let solved = true;
            for (let k = 0; k < gridSqrt; ++k) {
                for (let l = 0; l < gridSqrt; ++l) {
                    //console.log("checking" + (i+k) + "-" + (j+l));
                    if (board[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.size > 1) {
                        solved = false;
                    }
                    board[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
                }
            }
            if (solved) {
                continue;
            }
            possibleNums.forEach((value, key, set) => {
                let numCount = 0;
                let coords = [];
                for (let k = 0; k < Math.sqrt(gridSize); ++k) {
                    for (let l = 0; l < Math.sqrt(gridSize); ++l) {
                        if (board[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.has(value)) {
                            ++numCount;
                            coords = [(gridSqrt * i) + k, (gridSqrt * j) + l];
                            if (numCount == 2) {
                                continue;
                            }
                        }
                    }
                }
                if (numCount == 1) {
                    board[coords[0]][coords[1]].possibilities.size > 1 ? board[coords[0]][coords[1]].possibilities = new Set([value]) : null;
                    //wait(20000);
                }
            });
        }
    }
}
function boxRows(board, gridSize, unsolvedSquares) {
    const gridSqrt = Math.sqrt(gridSize);
    for (let i = 0; i < gridSqrt; ++i) {
        for (let j = 0; j < gridSqrt; ++j) {
            const directions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
            const complementDirections = [[1, 2], [0, 2], [0, 1], [4, 5], [3, 5], [4, 5]];
            for (let k = 0; k < 6; ++k) {
                const pairOne = set_intersection([board[(gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt))][(gridSqrt * j) + (directions[k][0] % gridSqrt)].possibilities, board[(gridSqrt * i) + (Math.floor(directions[k][1] / gridSqrt))][(gridSqrt * j) + (directions[k][1] % gridSqrt)].possibilities]);
                const pairtwo = set_intersection([board[(gridSqrt * i) + (Math.floor(directions[k][1] / gridSqrt))][(gridSqrt * j) + (directions[k][1] % gridSqrt)].possibilities, board[(gridSqrt * i) + (Math.floor(directions[k][2] / gridSqrt))][(gridSqrt * j) + (directions[k][2] % gridSqrt)].possibilities]);
                const pairThree = set_intersection([board[(gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt))][(gridSqrt * j) + (directions[k][0] % gridSqrt)].possibilities, board[(gridSqrt * i) + (Math.floor(directions[k][2] / gridSqrt))][(gridSqrt * j) + (directions[k][2] % gridSqrt)].possibilities]);
                const possibleNums = set_union([pairOne, pairtwo, pairThree]);
                let otherNums = new Set;
                for (let m = 0; m < 2; ++m) {
                    for (let n = 0; n < 3; ++n) {
                        otherNums = set_union([otherNums, board[(gridSqrt * i) + (Math.floor(directions[complementDirections[k][m]][n] / gridSqrt))][(gridSqrt * j) + (directions[complementDirections[k][m]][n] % gridSqrt)].possibilities]);
                    }
                }
                const removeNums = set_intersection([possibleNums, otherNums]);
                const lineBoundNums = set_subtraction(possibleNums, [removeNums]);
                //console.log(i + " " + j);
                if (directions[k][1] - directions[k][0] == 1) {
                    updateLine(board, gridSize, true, (gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt)), lineBoundNums, unsolvedSquares, j);
                    //console.log("row: " + ((gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))));
                }
                else {
                    updateLine(board, gridSize, false, (gridSqrt * j) + (directions[k][0] % gridSqrt), lineBoundNums, unsolvedSquares, i);
                    //console.log("col: " + ((gridSqrt*j)+(directions[k][0]%gridSqrt)));
                }
                /* console.log(lineBoundNums);
                console.log(otherNums); */
            }
        }
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
        lineSingles(board, gridSize, true);
        yield drawBoard(board, gridSize, canvas, windowSize, true);
        lineSingles(board, gridSize, false);
        yield drawBoard(board, gridSize, canvas, windowSize, true);
        boxSingles(board, gridSize);
        yield drawBoard(board, gridSize, canvas, windowSize, true);
        boxRows(board, gridSize, unsolvedSquares);
        yield drawBoard(board, gridSize, canvas, windowSize, true);
        //wait(500000);
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
        const maxIterations = 2000;
        for (let i = 0; unsolvedSquares.size > 0 && i < maxIterations; ++i) {
            console.log("Iterations: " + (i + 1) + "/" + maxIterations);
            yield waveFunctionCollapseStep(board, gridSize, unsolvedSquares, windowSize, canvas);
        }
    });
}
