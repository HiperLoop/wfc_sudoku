import { board, board_generateUnsolvedSquares, cell, cellBoardFromValues } from "./board.js";
import { drawBoard } from "./canvas.js";
import { set_intersection , set_subtraction, set_union } from "./set_arithmetic.js";

//returns all solved values in a line (row/column)
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

//removes found numbers from all unsolved cells in a line (row/column)
function updateLine(board:board, row:boolean, lineIndex:number, remove:Set<number>, skipSquare:number=-1) {
    for(let i = 0; i < board.gridSize; ++i) {
        if(i < (skipSquare + 1) * Math.sqrt(board.gridSize) && i >= skipSquare * Math.sqrt(board.gridSize)) {continue;} //skips square if called by sneyder line method
        if(board.unsolvedSquares.has(row ? (lineIndex*board.gridSize) + i : (i*board.gridSize) + lineIndex)) {
            remove.forEach((value:number, key:number, set:Set<number>) => {
                    row ? board.grid[lineIndex][i].possibilities.delete(value) : board.grid[i][lineIndex].possibilities.delete(value);
                }
            );
        }
    }
}

//returns all solved values in a square
function getNumbersInSquare(board:cell[][], middleCoords:number[]) {
    let foundNumbers = new Set<number>();
    for(let i = -1; i <= 1; ++i) {
        for(let j = -1; j <= 1; ++j) {
            board[middleCoords[0]+i][middleCoords[1]+j].num > 0 ? foundNumbers.add(board[middleCoords[0]+i][middleCoords[1]+j].num) : null;
        }
    }
    return foundNumbers;
}

//removes found numbers from all unsolved cells in a square
function updateSquare(board:board, middleCoords:number[], remove:Set<number>) {
    //checking if input coords are valid
    if(!((middleCoords[0] == 1 || middleCoords[0] == 4 || middleCoords[0] == 7) && (middleCoords[1] == 1 || middleCoords[1] == 4 || middleCoords[1] == 7))) {
        console.error("bad square");
        console.error(middleCoords);
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

//generate initial possiblities for whole grid
export function generateDegreesOfFreedom(board:board) {
    //rows + cols
    for(let i = 0; i < board.gridSize; ++i) {
        updateLine(board, true, i, getNumbersInLine(board, true, i));
        updateLine(board, false, i, getNumbersInLine(board, false, i));
    }
    //squares
    for(let i = 0; i < Math.sqrt(board.gridSize); ++i) {
        for(let j = 0; j < Math.sqrt(board.gridSize); ++j) {
            updateSquare(board, [(3*i)+1, (3*j)+1], getNumbersInSquare(board.grid, [(3*i)+1, (3*j)+1]));
        }
    }
}

//debugging function that pauses program for ms(milliseconds)
function wait(ms:number){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
}

//finds nums that go only in 1 place in a line (row/column)
function lineSingles(board:board, row:boolean) {
    //go through all rows/cols
    for(let i = 0; i < board.gridSize; ++i) {
        let possibleNums:Set<number> = new Set<number>;
        let solved:boolean = true;
        for(let j = 0; j < board.gridSize; ++j) {
            if(board.grid[row ? i : j][row ? j : i].possibilities.size > 1) {solved = false;} //if line is fully solved, skip
            board.grid[row ? i : j][row ? j : i].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)}); //add found numbers to possibilities for singles
        }
        if(solved) {continue;} //if line solved go to next line
        //check all possibilities for singles
        possibleNums.forEach((value:number, key:number, set:Set<number>) => {
            let numCount = 0;
            let jIndex:number = 0;
            //check if possible value is in more than 1 cell in line
            for(let j = 0; j < board.gridSize; ++j) {
                if(board.grid[row ? i : j][row ? j : i].possibilities.has(value)) {
                    ++numCount;
                    if(numCount == 2) {break;} //break if found 2nd time
                    jIndex = j; //remember where found 1st time
                }
            }
            //if found only once in line
            if(numCount == 1) {
                //set possiblities for the square to only the single value
                board.grid[row ? i : jIndex][row ? jIndex : i].possibilities = new Set<number>([value]);
            }
        });
    }
}

//finds nums that go only in 1 place in a square
function boxSingles(board:board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    //go through all boxes
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            let possibleNums:Set<number> = new Set<number>;
            let solved:boolean = true;
            //go through every cell in box
            for(let k = 0; k < gridSqrt; ++k) {
                for(let l = 0; l < gridSqrt; ++l) {
                    if(board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.size > 1) {solved = false;} //if box solved skip
                    board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.forEach((value:number, key:number, set:Set<number>) => {possibleNums.add(value)}); //add found numbers to possibilities for singles
                }
            }
            if(solved) {continue;} //if box solved, go to next
            //check all possibilities for singles
            possibleNums.forEach((value:number, key:number, set:Set<number>) => {
                let numCount = 0;
                let coords:number[] = [];
                //check if possible value is in more than 1 cell in box
                for(let k = 0; k < Math.sqrt(board.gridSize); ++k) {
                    for(let l = 0; l < Math.sqrt(board.gridSize); ++l) {
                        if(board.grid[(gridSqrt*i)+k][(gridSqrt*j)+l].possibilities.has(value)) {
                            ++numCount;
                            coords = [(gridSqrt*i)+k, (gridSqrt*j)+l]; //remember where found 1st time
                            if(numCount == 2) {continue;} //break if found 2nd time
                        }
                    }
                }
                if(numCount == 1) {
                    //set possiblities for the square to only the single value
                    board.grid[coords[0]][coords[1]].possibilities.size > 1 ? board.grid[coords[0]][coords[1]].possibilities = new Set<number>([value]) : null;
                }
            });
        }
    }
}

//sneyder line exclusion method
function boxRows(board:board) {
    const gridSqrt = Math.sqrt(board.gridSize);
    //go through all boxes
    for(let i = 0; i < gridSqrt; ++i) {
        for(let j = 0; j < gridSqrt; ++j) {
            const directions:number[][] = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]]; //all possible rows and cols in box
            const complementDirections:number[][] = [[1, 2], [0, 2], [0, 1], [4, 5], [3, 5], [4, 5]]; //indices of directions to complete a box
            //go through all possible directions
            for(let k = 0; k < directions.length; ++k) {
                //try all possible 2-ples in chosen direction that have a value in common
                const pairOne:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities]);
                const pairtwo:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][1]/gridSqrt))][(gridSqrt*j)+(directions[k][1]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                const pairThree:Set<number> = set_intersection([board.grid[(gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt))][(gridSqrt*j)+(directions[k][0]%gridSqrt)].possibilities, board.grid[(gridSqrt*i)+(Math.floor(directions[k][2]/gridSqrt))][(gridSqrt*j)+(directions[k][2]%gridSqrt)].possibilities]);
                //unite all possibilities for sneyder pairs
                const possibleNums:Set<number> = set_union([pairOne, pairtwo, pairThree]);

                //union of complement directions to current direction
                let otherNums:Set<number> = new Set<number>;
                for(let m = 0; m < complementDirections[0].length; ++m) {
                    for(let n = 0; n < directions[0].length; ++n) {
                        otherNums = set_union([otherNums, board.grid[(gridSqrt*i)+(Math.floor(directions[complementDirections[k][m]][n]/gridSqrt))][(gridSqrt*j)+(directions[complementDirections[k][m]][n]%gridSqrt)].possibilities]);
                    }
                }
                const lineBoundNums:Set<number> = set_subtraction(possibleNums, [otherNums]); //remove numbers found outside line to get sneyder bound nums
                if(directions[k][1] - directions[k][0] == 1) {
                    updateLine(board,  true, (gridSqrt*i)+(Math.floor(directions[k][0]/gridSqrt)), lineBoundNums, j); //update row
                }
                else {
                    updateLine(board, false, (gridSqrt*j)+(directions[k][0]%gridSqrt), lineBoundNums, i); //update column
                }
            }
        }
    }
}

//uses inference chains to conclude inevitable truths about cells
async function inferenceChain(board:board, coords:number[], windowSize:number[], canvas:HTMLCanvasElement) {
    let tryBoards:board[] = [];
    const x:number = coords[0];
    const y:number = coords[1];
    const checks = board.grid[x][y].possibilities.size;
    //creates new boards to try all possiblities for selected cell
    let gridCopy:cell[][][] = [];
    for(let o = 0; o < checks; ++o) {
        gridCopy[o] = [];
        for(let m = 0; m < board.gridSize; ++m) {
            gridCopy[o][m] = [];
            for(let n = 0; n < board.gridSize; ++n) {
                gridCopy[o][m][n] = {num:board.grid[m][n].num, possibilities:new Set<number>(board.grid[m][n].possibilities), selected:board.grid[m][n].selected, given:board.grid[m][n].given};
            }
        }
    }
    //sets the boards to be copies of current board
    for(let j = 0; j < checks; ++j) {
        tryBoards[j] = {grid:gridCopy[j], gridSize:board.gridSize, unsolvedSquares:new Set<number>(board.unsolvedSquares), selectedCells:new Set<number>};
    }
    let setValue:number[] = [];
    let count = 0;
    board.grid[x][y].possibilities.forEach((value:number, key:number, set:Set<number>) => {setValue[count] = value; count++;});
    //updates selected cell in each board to a different possibility for selected cell
    for(let j = 0; j < checks; ++j) {
        updateCell(tryBoards[j], [x, y], setValue[j]);
    }

    //run wfc on copied boards
    const maxIterations = 5;
    for(let j = 0; j < checks; ++j) {
        for(let k = 0; k < maxIterations && tryBoards[j].unsolvedSquares.size > 0; ++k) {
            if(await waveFunctionCollapseStep(tryBoards[j], windowSize, canvas, false, false, true) != 0) {break;}; //exclude recursive inference
        }
    }

    //consolidate found overlap between copied boards
    //go through every cell
    for(let m = 0; m < board.gridSize; ++m) {
        for(let n = 0; n < board.gridSize; ++n) {
            if(board.grid[m][n].num != 0) {continue;} //skip if cell solved
            //board.unsolvedSquares.add((m*board.gridSize) + n); //if not solved, add it to unsolved squares
            if(tryBoards[0].grid[m][n].num != 0) {
                let fits = true;
                //check if value matches in every board copy
                for(let j = 1; j < checks; ++j) {
                    if(tryBoards[j].grid[m][n].num != tryBoards[0].grid[m][n].num) {
                        fits = false;
                        break;
                    }
                }
                if(fits) {updateCell(board, [m, n], tryBoards[0].grid[m][n].num); continue;} //if value matches, update square to that value (works without this so if something breaks try removing)
            }

            //if value does not match, try matching possibilities
            let allBoardPossibilities:Set<number> = new Set<number>(tryBoards[0].grid[m][n].possibilities);
            //union of all possiblities for cell across board copies
            for(let j = 1; j < checks; ++j) {
                allBoardPossibilities = set_union([allBoardPossibilities, tryBoards[j].grid[m][n].possibilities]);
            }
            board.grid[m][n].possibilities = new Set<number>(allBoardPossibilities); //set possiblities to union of possibilities
        }
    }
    return 0;
}

//updates cell value, possibilities, removes form unsolved squares and updates lines + box
function updateCell(board:board, coords:number[], value:number) {
    board.grid[coords[0]][coords[1]].num = value; //set cell to value
    board.unsolvedSquares.delete((coords[0]*board.gridSize) + coords[1]); //remove cell form unsolved
    board.grid[coords[0]][coords[1]].possibilities = new Set<number>([value]); //set only possibility to value
    let delValue = new Set<number>([value]);
    updateLine(board, true, coords[0], delValue); //update row
    updateLine(board, false, coords[1], delValue); //update col
    updateSquare(board, [(Math.floor(coords[0]/Math.sqrt(board.gridSize))*3)+1, (Math.floor(coords[1]/Math.sqrt(board.gridSize))*3)+1], delValue); //update box
}

//based on wfc, looks at cell with least entropy and updates if solvable. no solvable -> inference/line+box methods/sneyder method
async function waveFunctionCollapseStep(board:board, windowSize:number[], canvas:HTMLCanvasElement, drawSteps:boolean=true, doInference:boolean=true, calledByChain:boolean=false) {
    let checkSquares:number[][] = [];
    if(board.unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
    //sort unsolved squares to find cell with least possibilities
    board.unsolvedSquares.forEach((value:number, key:number, set:Set<number>) => {checkSquares[value] = [board.grid[Math.floor(value/board.gridSize)][value % board.gridSize].possibilities.size, value]});
    checkSquares.sort((a, b) => a[0] - b[0]);

    //solve all solvable
    for(let i = 0; checkSquares[i][0] == 1; ++i) {
        const x:number = Math.floor(checkSquares[i][1]/board.gridSize);
        const y:number = checkSquares[i][1] % board.gridSize;
        let setValue:number = 10;
        if(board.grid[x][y].possibilities.size == 0 && calledByChain) {continue;} //if called by chain it is possible that solution is wrong so skip unsolvable squares
        board.grid[x][y].possibilities.forEach((value:number, key:number, set:Set<number>) => {setValue = value});
        //error alert
        if(setValue == 10) {
            console.error(`No possibilities in cell [${x}, ${y}]`);
            console.error(board.unsolvedSquares);
        }
        else {
            updateCell(board, [x, y], setValue); //if no error, update cell
        }
        if(drawSteps) await drawBoard(board, canvas, windowSize, true);
        if(board.unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
    }

    if(doInference) {
        checkSquares = [];
        //sort unsolved squares to find cell with least possibilities
        board.unsolvedSquares.forEach((value:number, key:number, set:Set<number>) => {checkSquares[value] = [board.grid[Math.floor(value/board.gridSize)][value % board.gridSize].possibilities.size, value]});
        checkSquares.sort((a, b) => a[0] - b[0]);
        //call inference on all unsolved squares
        for(let i = 0; i < board.unsolvedSquares.size && checkSquares[i][0] <= 9; ++i) {
            const x:number = Math.floor(checkSquares[i][1]/board.gridSize);
            const y:number = checkSquares[i][1] % board.gridSize;
            await inferenceChain(board, [x, y], windowSize, canvas); //call inference on cell
            if(drawSteps) await drawBoard(board, canvas, windowSize, true);
            if(board.unsolvedSquares.size == 0) {return 1;} //return if sudoku solved
        }
    }

    //conventional solving methods
    lineSingles(board, true); //rows
    if(drawSteps) await drawBoard(board, canvas, windowSize, true);
    lineSingles(board, false); //cols
    if(drawSteps) await drawBoard(board, canvas, windowSize, true);
    boxSingles(board);
    if(drawSteps) await drawBoard(board, canvas, windowSize, true);
    boxRows(board); //sneyder
    if(drawSteps) await drawBoard(board, canvas, windowSize, true);
    return 0; //sudoku unsolved
}

//sudoku solver
export async function solve(board:board, windowSize:number[], canvas:HTMLCanvasElement, maxWFCiterations:number, useInference:boolean=true) {
    board_generateUnsolvedSquares(board); //generate set of unsolved squares
    generateDegreesOfFreedom(board); //initial possiblities for every cell
    await drawBoard(board, canvas, windowSize, true);

    for(let i = 0; board.unsolvedSquares.size > 0 && i < maxWFCiterations; ++i) {
        console.log(`Iterations: ${i+1}/${maxWFCiterations}`);
        if(await waveFunctionCollapseStep(board, windowSize, canvas, true, useInference) == 1) {
            console.log(`Sudoku solved in ${i+1} iterations!`);
            await drawBoard(board, canvas, windowSize, true, false);
            return 1;
        }
        await drawBoard(board, canvas, windowSize, true, false);
    }
    console.log(`Solver ran out of iterations before solving with ${board.unsolvedSquares.size} unsolved squares.`);
    await drawBoard(board, canvas, windowSize, true, false);
    let solved:number = 1;
    board.unsolvedSquares.size > 0 ? console.log("Sudoku solved!") : solved = -1;
    return solved; //return 1 if solved, -1 if unsoved
}