import { board, board_generateUnsolvedSquares, board_getGivenSquares, board_givenGrid } from "./board.js";
import { drawBoard } from "./canvas.js";
import { generateDegreesOfFreedom, solve, updateCell } from "./solver.js";

export async function fixBoardToFitDifficulty(board:board, difficulty:number, windowSize:number[], canvas:HTMLCanvasElement):Promise<board> {
    const squareSize = board.gridSize * board.gridSize;
    const intendedSolvedSquares = squareSize - Math.floor(difficulty/2);
    const nonGiven = board_getGivenSquares(board, true);
    const given = board_getGivenSquares(board, false);
    /* for(;squareSize - nonGiven.size < intendedSolvedSquares;) {
        const randomIndex:number = Math.floor(Math.random() * nonGiven.size);
        const randomCoords:number = Array.from(nonGiven)[randomIndex];
        const x:number = Math.floor(randomCoords/board.gridSize);
        const y:number = randomCoords%board.gridSize;
        board.grid[x][y].given = true;
        nonGiven.delete(randomCoords);
    } */

    var givenCopy:Set<number> = new Set<number>(given);
    for(;given.size > intendedSolvedSquares;) {
        const randomIndex:number = Math.floor(Math.random() * givenCopy.size);
        const randomCoords:number = Array.from(givenCopy)[randomIndex];
        const x:number = Math.floor(randomCoords/board.gridSize);
        const y:number = randomCoords%board.gridSize;
        board.grid[x][y].given = false;
        givenCopy.delete(randomCoords);
        if(await solve(board_givenGrid(board), windowSize, canvas, 1, false, true, 3, 1) == 1) {
            given.delete(randomCoords);
        }
        else {board.grid[x][y].given = true;}
        if(givenCopy.size == 0) {break;}
    }
    return board;
}

export async function generateBoard(gridSize:number, difficulty:number, windowSize:number[], canvas:HTMLCanvasElement):Promise<board> {
    var generatorPossibilities:Set<number> = new Set<number>();
    const board:board = {grid:[], gridSize:gridSize, unsolvedSquares:new Set<number>(), selectedCells:new Set<number>()};
    for(let i = 0; i < gridSize; ++i) {
        board.grid[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board.grid[i][j] = {num:0, possibilities:new Set<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected:false, given:false};
            generatorPossibilities.add((i*gridSize)+j);
        }
    }

    board_generateUnsolvedSquares(board); //generate set of unsolved squares
    generateDegreesOfFreedom(board); //initial possiblities for every cell
    
    for(;board.unsolvedSquares.size > 0;) {
        const randomIndex:number = Math.floor(Math.random() * board.unsolvedSquares.size);
        const randomCoords = Array.from(board.unsolvedSquares)[randomIndex];
        const x = Math.floor(randomCoords/gridSize);
        const y = randomCoords%gridSize;
        const randomValueIndex:number = Math.floor(Math.random() * board.grid[x][y].possibilities.size);
        const randomValue = Array.from(board.grid[x][y].possibilities)[randomValueIndex];

        updateCell(board, [x , y], randomValue);
        board.grid[x][y].given = true;

        var useInference:boolean = true;
        var maxSolverIterations:number = 1;
        if(difficulty < 30) {
            useInference = false;
            maxSolverIterations = 5;
        }
        const solvable:number = board.unsolvedSquares.size < (board.gridSize * board.gridSize - 20) ? await solve(board, windowSize, canvas, maxSolverIterations, false, useInference, 3, 1) : await solve(board, windowSize, canvas, maxSolverIterations, false, useInference, 5, 0);
        if(solvable == -1) {
            return await generateBoard(gridSize, difficulty, windowSize, canvas);
        }
        if(solvable == 1) {
            return board;
        }
        await drawBoard(board, canvas, windowSize, false, false, true);
    }
    console.log("failed!");
    return board;
}