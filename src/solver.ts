import { board, cell } from "./board.js";
import { drawBoard } from "./canvas.js";
import { set_intersection , set_subtraction, set_union } from "./set_arithmetic.js";

function getNumbersInLine(board:board, row:boolean, lineIndex:number) {
    let foundNumbers = new Set<number>();
    for(let i = 0; i < board.gridSize; ++i) {
        if(row) {
            if(board.grid[lineIndex][i].num > 0) {
                foundNumbers.add(board.grid[lineIndex][i].num);
            }
        }
        else {
            if(board.grid[i][lineIndex].num > 0) {
                foundNumbers.add(board.grid[i][lineIndex].num);
            }
        }
    }
    return foundNumbers;
}

function updateLine(board:board, row:boolean, lineIndex:number, remove:Set<number>, skipSquare:number=-1) {
    for(let i = 0; i < board.gridSize; ++i) {
        if(i < (skipSquare + 1) * Math.sqrt(board.gridSize) && i >= skipSquare * Math.sqrt(board.gridSize)) {continue;}
        if(board.unsolvedSquares.has(row ? (lineIndex*board.gridSize) + i : (i*board.gridSize) + lineIndex)) {
            remove.forEach((value:number, key:number, set:Set<number>) => {
                    row ? board.grid[lineIndex][i].possibilities.delete(value) : board.grid[i][lineIndex].possibilities.delete(value);
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

function updateSquare(board:board, middleCoords:number[], remove:Set<number>) {
    if(!((middleCoords[0] == 1 || middleCoords[0] == 4 || middleCoords[0] == 7) && (middleCoords[1] == 1 || middleCoords[1] == 4 || middleCoords[1] == 7))) {
        console.log("bad square");
        console.log(middleCoords);
    }
    for(let i = -1; i <= 1; ++i) {
        for(let j = -1; j <= 1; ++j) {
            if(board.unsolvedSquares.has((middleCoords[0] + i)*board.gridSize + (middleCoords[1] + j))) {
                remove.forEach((value:number, key:number, set:Set<number>) => {
                        board.grid[middleCoords[0] + i][middleCoords[1] + j].possibilities.delete(value);
                    }
                );
            }
        }
    }
}

export function generateDegreesOfFreedom(board:board) {
    for(let i = 0; i < board.gridSize; ++i) {
        updateLine(board, true, i, getNumbersInLine(board, true, i));
        updateLine(board, false, i, getNumbersInLine(board, false, i));
    }
    for(let i = 0; i < Math.sqrt(board.gridSize); ++i) {
        for(let j = 0; j < Math.sqrt(board.gridSize); ++j) {
            updateSquare(board, [(3*i)+1, (3*j)+1], getNumbersInSquare(board.grid, [(3*i)+1, (3*j)+1]));
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

function lineSingles(board:board, row:boolean) {
    for(let i = 0; i < board.gridSize; ++i) {
        let possibleNums:Set<number> = new Set<number>;
        let solved:boolean = true;
        for(let j = 0; j < board.gridSize; ++j) {
            if(row) {
                if(board.grid[i][j].possibilities.size > 1) {solved = false;}
                board.grid[i][j].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
            }
            else {
                if(board.grid[i][j].possibilities.size > 1) {solved = false;}
                board.grid[j][i].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
            }
        }
        if(solved) {continue;}
        possibleNums.forEach((value:number, key:number, set:Set<number>) => {
            let numCount = 0;
            let jIndex:number = 0;
            if(row) {
                for(let j = 0; j < board.gridSize; ++j) {
                    if(board.grid[i][j].possibilities.has(value)) {
                        ++numCount;
                        if(numCount == 2) {break;}
                        jIndex = j;
                    }
                }
            }
            else {
                for(let j = 0; j < board.gridSize; ++j) {
                    if(board.grid[j][i].possibilities.has(value)) {
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
                    board.grid[i][jIndex].possibilities = new Set<number>([value]);
                }
                else {
                    board.grid[jIndex][i].possibilities = new Set<number>([value]);
                }
            }
        });
    }
}

function boxSingles(board:board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            let possibleNums:Set<number> = new Set<number>;
            let solved:boolean = true;
            for(let k = 0; k < gridSqrt; ++k) {
                for(let l = 0; l < gridSqrt; ++l) {
                    //console.log("checking" + (i+k) + "-" + (j+l));
                    if(board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.size > 1) {solved = false;}
                    board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)});
                }
            }
            if(solved) {continue;}
            possibleNums.forEach((value:number, key:number, set:Set<number>) => {
                let numCount = 0;
                let coords:number[] = [];
                for(let k = 0; k < Math.sqrt(board.gridSize); ++k) {
                    for(let l = 0; l < Math.sqrt(board.gridSize); ++l) {
                        if(board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.has(value)) {
                            ++numCount;
                            coords = [(gridSqrt*i)+k, (gridSqrt*j)+l];
                            if(numCount == 2) {continue;}
                        }
                    }
                }
                if(numCount == 1) {
                    board.grid[coords[0]][coords[1]].possibilities.size > 1 ? board.grid[coords[0]][coords[1]].possibilities = new Set<number>([value]) : null;
                    //wait(20000);
                }
            });
        }
    }
}

function boxRows(board:board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            const directions:number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
            const complementDirections:number[][] = [[1, 2], [0, 2], [0, 1], [4, 5], [3, 5], [4, 5]];
            for(let k = 0; k < 6; ++k) {
                const pairOne:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities]);
                const pairtwo:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                const pairThree:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                const possibleNums:Set<number> = set_union([pairOne, pairtwo, pairThree]);

                let otherNums:Set<number> = new Set<number>;
                for(let m = 0; m < 2; ++m) {
                    for(let n = 0; n < 3; ++n) {
                        otherNums = set_union([otherNums, board.grid[(gridSqrt*i)+(Math.floor(directions[complementDirections[k][m]][n]/gridSqrt))][(gridSqrt*j)+(directions[complementDirections[k][m]][n]%gridSqrt)].possibilities]);
                    }
                }
                const removeNums:Set<number> = set_intersection([possibleNums, otherNums]);
                const lineBoundNums:Set<number> = set_subtraction(possibleNums, [removeNums]);
                //console.log(i + " " + j);
                if(directions[k][1] - directions[k][0] == 1) {
                    updateLine(board,  true, (gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt)), lineBoundNums, j);
                    //console.log("row: " + ((gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))));
                }
                else {
                    updateLine(board, false, (gridSqrt*j)+(directions[k][0]%gridSqrt), lineBoundNums, i);
                    //console.log("col: " + ((gridSqrt*j)+(directions[k][0]%gridSqrt)));
                }
                /* console.log(lineBoundNums);
                console.log(otherNums); */
            }
        }
    }
}

function inferenceChain(board:cell[][], gridSize:number, checkSquares:number[][]) {
    let trySquare:number[] = [];
    let tryBoards:cell[][][] = [];
    for(let i = 0; checkSquares[i][0] == 2; ++i) {
        
    }
}

async function waveFunctionCollapseStep(board:board, windowSize:number[], canvas:HTMLCanvasElement) {
    let checkSquares:number[][] = [];
    if(board.unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
    board.unsolvedSquares.forEach((value:number, key:number, set:Set<number>) => {checkSquares[value] = [board.grid[Math.floor(value/board.gridSize)][value % board.gridSize].possibilities.size, value]});
    checkSquares.sort((a, b) => a[0] - b[0]);

    for(let i = 0; checkSquares[i][0] == 1; ++i) {
        const x:number = Math.floor(checkSquares[i][1]/board.gridSize);
        const y:number = checkSquares[i][1] % board.gridSize;
        let setValue:number = 0;
        board.grid[x][y].possibilities.forEach((value:number, key:number, set:Set<number>) => {setValue = value});
        board.grid[x][y].num = setValue;
        console.log("pos:" + board.grid[x][y].possibilities.size)
        console.log("val:" + setValue);
        board.unsolvedSquares.delete(checkSquares[i][1]);
        
        board.grid[x][y].possibilities = new Set<number>;
        let delValue = new Set<number>([setValue]);
        updateLine(board, true, x, delValue);
        updateLine(board, false, y, delValue);
        updateSquare(board, [(Math.floor(x/Math.sqrt(board.gridSize))*3)+1, (Math.floor(y/Math.sqrt(board.gridSize))*3)+1], delValue);
        await drawBoard(board, canvas, windowSize, true);
        if(board.unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
        wait(500);
    }
    lineSingles(board, true);
    await drawBoard(board, canvas, windowSize, true);
    //wait(500);
    lineSingles(board, false);
    await drawBoard(board, canvas, windowSize, true);
    //wait(500);
    boxSingles(board);
    await drawBoard(board, canvas, windowSize, true);
    //wait(500);
    boxRows(board);
    await drawBoard(board, canvas, windowSize, true);
    //wait(500);
    //wait(500000);
}

export async function solve(board:board, windowSize:number[], canvas:HTMLCanvasElement) {
    for(let i = 0; i < board.gridSize; ++i) {
        for(let j = 0; j < board.gridSize; ++j) {
            if(board.grid[i][j].num == 0) {
                board.unsolvedSquares.add((i*board.gridSize)+j);
            }
            else {board.grid[i][j].possibilities = new Set<number>;}
        }
    }
    generateDegreesOfFreedom(board);
    await drawBoard(board, canvas, windowSize, true);
    //wait(10000);

    const maxIterations:number = 100;
    for(let i = 0; board.unsolvedSquares.size > 0 && i < maxIterations; ++i) {
        console.log("Iterations: " + (i+1) + "/" + maxIterations);
        if(await waveFunctionCollapseStep(board, windowSize, canvas) == 1) {console.log("Sudoku solved!"); return 1;}
    }
    return -1; //sudoku unsolved
}