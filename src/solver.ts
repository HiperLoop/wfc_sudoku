import { cell } from "./board.js";
import { drawBoard } from "./canvas.js";
import { set_intersection , set_subtraction, set_union } from "./set_arithmetic.js";

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

function updateLine(board:cell[][], gridSize:number, row:boolean, lineIndex:number, remove:Set<number>, unsolvedSquares:Set<number>, skipSquare:number=-1) {
    for(let i = 0; i < gridSize; ++i) {
        if(i < (skipSquare + 1) * Math.sqrt(gridSize) && i >= skipSquare * Math.sqrt(gridSize)) {continue;}
        if(unsolvedSquares.has(row ? (lineIndex*gridSize) + i : (i*gridSize) + lineIndex)) {
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
    if(!((middleCoords[0] == 1 || middleCoords[0] == 4 || middleCoords[0] == 7) && (middleCoords[1] == 1 || middleCoords[1] == 4 || middleCoords[1] == 7))) {
        console.log("bad square");
        console.log(middleCoords);
    }
    for(let i = -1; i <= 1; ++i) {
        for(let j = -1; j <= 1; ++j) {
            if(unsolvedSquares.has((middleCoords[0] + i)*gridSize + (middleCoords[1] + j))) {
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

function wait(ms:number){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}

function lineSingles(board:cell[][], gridSize:number, row:boolean) {
    for(let i = 0; i < gridSize; ++i) {
        let possibleNums:Set<number> = new Set<number>;
        let solved:boolean = true;
        for(let j = 0; j < gridSize; ++j) {
            if(row) {
                if(board[i][j].possibilities.size > 1) {solved = false;}
                board[i][j].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
            }
            else {
                if(board[i][j].possibilities.size > 1) {solved = false;}
                board[j][i].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
            }
        }
        if(solved) {continue;}
        possibleNums.forEach((value:number, key:number, set:Set<number>) => {
            let numCount = 0;
            let jIndex:number = 0;
            if(row) {
                for(let j = 0; j < gridSize; ++j) {
                    if(board[i][j].possibilities.has(value)) {
                        ++numCount;
                        if(numCount == 2) {break;}
                        jIndex = j;
                    }
                }
            }
            else {
                for(let j = 0; j < gridSize; ++j) {
                    if(board[j][i].possibilities.has(value)) {
                        ++numCount;
                        if(numCount == 2) {break;}
                        jIndex = j;
                    }
                }
            }
            //if(value == 1) console.log(numCount);
            if(numCount == 1) {
                //console.log("found something");
                if(row) {
                    board[i][jIndex].possibilities = new Set<number>([value]);
                }
                else {
                    board[jIndex][i].possibilities = new Set<number>([value]);
                }
            }
        });
    }
}

function boxSingles(board:cell[][], gridSize:number) {
    const gridSqrt = Math.sqrt(gridSize);
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            let possibleNums:Set<number> = new Set<number>;
            let solved:boolean = true;
            for(let k = 0; k < gridSqrt; ++k) {
                for(let l = 0; l < gridSqrt; ++l) {
                    //console.log("checking" + (i+k) + "-" + (j+l));
                    if(board[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.size > 1) {solved = false;}
                    board[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
                }
            }
            if(solved) {continue;}
            possibleNums.forEach((value:number, key:number, set:Set<number>) => {
                let numCount = 0;
                let coords:number[] = [];
                for(let k = 0; k < Math.sqrt(gridSize); ++k) {
                    for(let l = 0; l < Math.sqrt(gridSize); ++l) {
                        if(board[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.has(value)) {
                            ++numCount;
                            coords = [(gridSqrt*i)+k, (gridSqrt*j)+l];
                            if(numCount == 2) {continue;}
                        }
                    }
                }
                if(numCount == 1) {
                    board[coords[0]][coords[1]].possibilities.size > 1 ? board[coords[0]][coords[1]].possibilities = new Set<number>([value]) : null;
                    //wait(20000);
                }
            });
        }
    }
}

function boxRows(board:cell[][], gridSize:number, unsolvedSquares:Set<number>) {
    const gridSqrt = Math.sqrt(gridSize);
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            const directions:number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
            const complementDirections:number[][] = [[1, 2], [0, 2], [0, 1], [4, 5], [3, 5], [4, 5]];
            for(let k = 0; k < 6; ++k) {
                const pairOne:Set<number> = set_intersection([board[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities]);
                const pairtwo:Set<number> = set_intersection([board[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities, board[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                const pairThree:Set<number> = set_intersection([board[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                const possibleNums:Set<number> = set_union([pairOne, pairtwo, pairThree]);

                let otherNums:Set<number> = new Set<number>;
                for(let m = 0; m < 2; ++m) {
                    for(let n = 0; n < 3; ++n) {
                        otherNums = set_union([otherNums, board[(gridSqrt*i)+(Math.floor(directions[complementDirections[k][m]][n]/gridSqrt))][(gridSqrt*j)+(directions[complementDirections[k][m]][n]%gridSqrt)].possibilities]);
                    }
                }
                const removeNums:Set<number> = set_intersection([possibleNums, otherNums]);
                const lineBoundNums:Set<number> = set_subtraction(possibleNums, [removeNums]);
                //console.log(i + " " + j);
                if(directions[k][1] - directions[k][0] == 1) {
                    updateLine(board, gridSize,  true, (gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt)), lineBoundNums, unsolvedSquares, j);
                    //console.log("row: " + ((gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))));
                }
                else {
                    updateLine(board, gridSize,  false, (gridSqrt*j)+(directions[k][0]%gridSqrt), lineBoundNums, unsolvedSquares, i);
                    //console.log("col: " + ((gridSqrt*j)+(directions[k][0]%gridSqrt)));
                }
                /* console.log(lineBoundNums);
                console.log(otherNums); */
            }
        }
    }
}

async function waveFunctionCollapseStep(board:cell[][], gridSize:number, unsolvedSquares:Set<number>, windowSize:number[], canvas:HTMLCanvasElement) {
    let checkSquares:number[][] = [];
    if(unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
    unsolvedSquares.forEach((value:number, key:number, set:Set<number>) => {checkSquares[value] = [board[Math.floor(value/gridSize)][value % gridSize].possibilities.size, value]});
    checkSquares.sort((a, b) => a[0] - b[0]);

    for(let i = 0; checkSquares[i][0] == 1; ++i) {
        const x:number = Math.floor(checkSquares[i][1]/gridSize);
        const y:number = checkSquares[i][1] % gridSize;
        let setValue:number = 0;
        board[x][y].possibilities.forEach((value:number, key:number, set:Set<number>) => {setValue = value});
        board[x][y].num = setValue;
        console.log("pos:" + board[x][y].possibilities.size)
        console.log("val:" + setValue);
        unsolvedSquares.delete(checkSquares[i][1]);
        
        board[x][y].possibilities = new Set<number>;
        let delValue = new Set<number>([setValue]);
        updateLine(board, gridSize, true, x, delValue, unsolvedSquares);
        updateLine(board, gridSize, false, y, delValue, unsolvedSquares);
        updateSquare(board, gridSize, [(Math.floor(x/Math.sqrt(gridSize))*3)+1, (Math.floor(y/Math.sqrt(gridSize))*3)+1], delValue, unsolvedSquares);
        await drawBoard(board, gridSize, canvas, windowSize, true);
        if(unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
        wait(500);
    }
    lineSingles(board, gridSize, true);
    await drawBoard(board, gridSize, canvas, windowSize, true);
    //wait(500);
    lineSingles(board, gridSize, false);
    await drawBoard(board, gridSize, canvas, windowSize, true);
    //wait(500);
    boxSingles(board, gridSize);
    await drawBoard(board, gridSize, canvas, windowSize, true);
    //wait(500);
    boxRows(board, gridSize, unsolvedSquares);
    await drawBoard(board, gridSize, canvas, windowSize, true);
    //wait(500);
    //wait(500000);
}

export async function solve(board:cell[][], gridSize:number, windowSize:number[], canvas:HTMLCanvasElement) {
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
    await drawBoard(board, gridSize, canvas, windowSize, true);
    //wait(10000);

    const maxIterations:number = 100;
    for(let i = 0; unsolvedSquares.size > 0 && i < maxIterations; ++i) {
        console.log("Iterations: " + (i+1) + "/" + maxIterations);
        if(await waveFunctionCollapseStep(board, gridSize, unsolvedSquares, windowSize, canvas) == 1) {console.log("Sudoku solved!"); return 1;}
    }
}