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
function getNumbersInLine(board, row, lineIndex) {
    let foundNumbers = new Set();
    for (let i = 0; i < board.gridSize; ++i) {
        if (row) {
            if (board.grid[lineIndex][i].num > 0) {
                foundNumbers.add(board.grid[lineIndex][i].num);
            }
        }
        else {
            if (board.grid[i][lineIndex].num > 0) {
                foundNumbers.add(board.grid[i][lineIndex].num);
            }
        }
    }
    return foundNumbers;
}
function updateLine(board, row, lineIndex, remove, skipSquare = -1) {
    for (let i = 0; i < board.gridSize; ++i) {
        if (i < (skipSquare + 1) * Math.sqrt(board.gridSize) && i >= skipSquare * Math.sqrt(board.gridSize)) {
            continue;
        }
        if (board.unsolvedSquares.has(row ? (lineIndex * board.gridSize) + i : (i * board.gridSize) + lineIndex)) {
            remove.forEach((value, key, set) => {
                row ? board.grid[lineIndex][i].possibilities.delete(value) : board.grid[i][lineIndex].possibilities.delete(value);
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
function updateSquare(board, middleCoords, remove) {
    if (!((middleCoords[0] == 1 || middleCoords[0] == 4 || middleCoords[0] == 7) && (middleCoords[1] == 1 || middleCoords[1] == 4 || middleCoords[1] == 7))) {
        console.log("bad square");
        console.log(middleCoords);
    }
    for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (board.unsolvedSquares.has((middleCoords[0] + i) * board.gridSize + (middleCoords[1] + j))) {
                remove.forEach((value, key, set) => {
                    board.grid[middleCoords[0] + i][middleCoords[1] + j].possibilities.delete(value);
                });
            }
        }
    }
}
export function generateDegreesOfFreedom(board) {
    for (let i = 0; i < board.gridSize; ++i) {
        updateLine(board, true, i, getNumbersInLine(board, true, i));
        updateLine(board, false, i, getNumbersInLine(board, false, i));
    }
    for (let i = 0; i < Math.sqrt(board.gridSize); ++i) {
        for (let j = 0; j < Math.sqrt(board.gridSize); ++j) {
            updateSquare(board, [(3 * i) + 1, (3 * j) + 1], getNumbersInSquare(board.grid, [(3 * i) + 1, (3 * j) + 1]));
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
function lineSingles(board, row) {
    for (let i = 0; i < board.gridSize; ++i) {
        let possibleNums = new Set;
        let solved = true;
        for (let j = 0; j < board.gridSize; ++j) {
            if (row) {
                if (board.grid[i][j].possibilities.size > 1) {
                    solved = false;
                }
                board.grid[i][j].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
            else {
                if (board.grid[i][j].possibilities.size > 1) {
                    solved = false;
                }
                board.grid[j][i].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
            }
        }
        if (solved) {
            continue;
        }
        possibleNums.forEach((value, key, set) => {
            let numCount = 0;
            let jIndex = 0;
            if (row) {
                for (let j = 0; j < board.gridSize; ++j) {
                    if (board.grid[i][j].possibilities.has(value)) {
                        ++numCount;
                        if (numCount == 2) {
                            break;
                        }
                        jIndex = j;
                    }
                }
            }
            else {
                for (let j = 0; j < board.gridSize; ++j) {
                    if (board.grid[j][i].possibilities.has(value)) {
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
                    board.grid[i][jIndex].possibilities = new Set([value]);
                }
                else {
                    board.grid[jIndex][i].possibilities = new Set([value]);
                }
            }
        });
    }
}
function boxSingles(board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    for (let i = 0; i < gridSqrt; ++i) {
        for (let j = 0; j < gridSqrt; ++j) {
            let possibleNums = new Set;
            let solved = true;
            for (let k = 0; k < gridSqrt; ++k) {
                for (let l = 0; l < gridSqrt; ++l) {
                    //console.log("checking" + (i+k) + "-" + (j+l));
                    if (board.grid[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.size > 1) {
                        solved = false;
                    }
                    board.grid[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.forEach((value, key, set) => { possibleNums.add(value); });
                }
            }
            if (solved) {
                continue;
            }
            possibleNums.forEach((value, key, set) => {
                let numCount = 0;
                let coords = [];
                for (let k = 0; k < Math.sqrt(board.gridSize); ++k) {
                    for (let l = 0; l < Math.sqrt(board.gridSize); ++l) {
                        if (board.grid[(gridSqrt * i) + k][(gridSqrt * j) + l].possibilities.has(value)) {
                            ++numCount;
                            coords = [(gridSqrt * i) + k, (gridSqrt * j) + l];
                            if (numCount == 2) {
                                continue;
                            }
                        }
                    }
                }
                if (numCount == 1) {
                    board.grid[coords[0]][coords[1]].possibilities.size > 1 ? board.grid[coords[0]][coords[1]].possibilities = new Set([value]) : null;
                    //wait(20000);
                }
            });
        }
    }
}
function boxRows(board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    for (let i = 0; i < gridSqrt; ++i) {
        for (let j = 0; j < gridSqrt; ++j) {
            const directions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
            const complementDirections = [[1, 2], [0, 2], [0, 1], [4, 5], [3, 5], [4, 5]];
            for (let k = 0; k < 6; ++k) {
                const pairOne = set_intersection([board.grid[(gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt))][(gridSqrt * j) + (directions[k][0] % gridSqrt)].possibilities, board.grid[(gridSqrt * i) + (Math.floor(directions[k][1] / gridSqrt))][(gridSqrt * j) + (directions[k][1] % gridSqrt)].possibilities]);
                const pairtwo = set_intersection([board.grid[(gridSqrt * i) + (Math.floor(directions[k][1] / gridSqrt))][(gridSqrt * j) + (directions[k][1] % gridSqrt)].possibilities, board.grid[(gridSqrt * i) + (Math.floor(directions[k][2] / gridSqrt))][(gridSqrt * j) + (directions[k][2] % gridSqrt)].possibilities]);
                const pairThree = set_intersection([board.grid[(gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt))][(gridSqrt * j) + (directions[k][0] % gridSqrt)].possibilities, board.grid[(gridSqrt * i) + (Math.floor(directions[k][2] / gridSqrt))][(gridSqrt * j) + (directions[k][2] % gridSqrt)].possibilities]);
                const possibleNums = set_union([pairOne, pairtwo, pairThree]);
                let otherNums = new Set;
                for (let m = 0; m < 2; ++m) {
                    for (let n = 0; n < 3; ++n) {
                        otherNums = set_union([otherNums, board.grid[(gridSqrt * i) + (Math.floor(directions[complementDirections[k][m]][n] / gridSqrt))][(gridSqrt * j) + (directions[complementDirections[k][m]][n] % gridSqrt)].possibilities]);
                    }
                }
                const removeNums = set_intersection([possibleNums, otherNums]);
                const lineBoundNums = set_subtraction(possibleNums, [removeNums]);
                //console.log(i + " " + j);
                if (directions[k][1] - directions[k][0] == 1) {
                    updateLine(board, true, (gridSqrt * i) + (Math.floor(directions[k][0] / gridSqrt)), lineBoundNums, j);
                    //console.log("row: " + ((gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))));
                }
                else {
                    updateLine(board, false, (gridSqrt * j) + (directions[k][0] % gridSqrt), lineBoundNums, i);
                    //console.log("col: " + ((gridSqrt*j)+(directions[k][0]%gridSqrt)));
                }
                /* console.log(lineBoundNums);
                console.log(otherNums); */
            }
        }
    }
}
function inferenceChain(board, gridSize, checkSquares) {
    let trySquare = [];
    let tryBoards = [];
    for (let i = 0; checkSquares[i][0] == 2; ++i) {
    }
}
function waveFunctionCollapseStep(board, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        let checkSquares = [];
        if (board.unsolvedSquares.size == 0) {
            return 1;
        } //return if sudoku solved
        board.unsolvedSquares.forEach((value, key, set) => { checkSquares[value] = [board.grid[Math.floor(value / board.gridSize)][value % board.gridSize].possibilities.size, value]; });
        checkSquares.sort((a, b) => a[0] - b[0]);
        for (let i = 0; checkSquares[i][0] == 1; ++i) {
            const x = Math.floor(checkSquares[i][1] / board.gridSize);
            const y = checkSquares[i][1] % board.gridSize;
            let setValue = 0;
            board.grid[x][y].possibilities.forEach((value, key, set) => { setValue = value; });
            board.grid[x][y].num = setValue;
            console.log("pos:" + board.grid[x][y].possibilities.size);
            console.log("val:" + setValue);
            board.unsolvedSquares.delete(checkSquares[i][1]);
            board.grid[x][y].possibilities = new Set;
            let delValue = new Set([setValue]);
            updateLine(board, true, x, delValue);
            updateLine(board, false, y, delValue);
            updateSquare(board, [(Math.floor(x / Math.sqrt(board.gridSize)) * 3) + 1, (Math.floor(y / Math.sqrt(board.gridSize)) * 3) + 1], delValue);
            yield drawBoard(board, canvas, windowSize, true);
            if (board.unsolvedSquares.size == 0) {
                return 1;
            } //return if sudoku solved
            wait(500);
        }
        lineSingles(board, true);
        yield drawBoard(board, canvas, windowSize, true);
        //wait(500);
        lineSingles(board, false);
        yield drawBoard(board, canvas, windowSize, true);
        //wait(500);
        boxSingles(board);
        yield drawBoard(board, canvas, windowSize, true);
        //wait(500);
        boxRows(board);
        yield drawBoard(board, canvas, windowSize, true);
        //wait(500);
        //wait(500000);
    });
}
export function solve(board, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < board.gridSize; ++i) {
            for (let j = 0; j < board.gridSize; ++j) {
                if (board.grid[i][j].num == 0) {
                    board.unsolvedSquares.add((i * board.gridSize) + j);
                }
                else {
                    board.grid[i][j].possibilities = new Set;
                }
            }
        }
        generateDegreesOfFreedom(board);
        yield drawBoard(board, canvas, windowSize, true);
        //wait(10000);
        const maxIterations = 100;
        for (let i = 0; board.unsolvedSquares.size > 0 && i < maxIterations; ++i) {
            console.log("Iterations: " + (i + 1) + "/" + maxIterations);
            if ((yield waveFunctionCollapseStep(board, windowSize, canvas)) == 1) {
                console.log("Sudoku solved!");
                return 1;
            }
        }
        return -1; //sudoku unsolved
    });
}
