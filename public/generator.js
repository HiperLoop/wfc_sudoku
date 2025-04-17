var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { board_generateUnsolvedSquares, board_getGivenSquares, board_givenGrid } from "./board.js";
import { drawBoard } from "./canvas.js";
import { generateDegreesOfFreedom, solve, updateCell } from "./solver.js";
export function fixBoardToFitDifficulty(board, difficulty, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        const squareSize = board.gridSize * board.gridSize;
        const intendedSolvedSquares = squareSize - Math.floor(difficulty / 2);
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
        var givenCopy = new Set(given);
        for (; given.size > intendedSolvedSquares;) {
            const randomIndex = Math.floor(Math.random() * givenCopy.size);
            const randomCoords = Array.from(givenCopy)[randomIndex];
            const x = Math.floor(randomCoords / board.gridSize);
            const y = randomCoords % board.gridSize;
            board.grid[x][y].given = false;
            givenCopy.delete(randomCoords);
            if ((yield solve(board_givenGrid(board), windowSize, canvas, 1, false, true, 3, 1)) == 1) {
                given.delete(randomCoords);
            }
            else {
                board.grid[x][y].given = true;
            }
            if (givenCopy.size == 0) {
                break;
            }
        }
        return board;
    });
}
export function generateBoard(gridSize, difficulty, windowSize, canvas) {
    return __awaiter(this, void 0, void 0, function* () {
        var generatorPossibilities = new Set();
        const board = { grid: [], gridSize: gridSize, unsolvedSquares: new Set(), selectedCells: new Set() };
        for (let i = 0; i < gridSize; ++i) {
            board.grid[i] = [];
            for (let j = 0; j < gridSize; ++j) {
                board.grid[i][j] = { num: 0, possibilities: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]), selected: false, given: false };
                generatorPossibilities.add((i * gridSize) + j);
            }
        }
        board_generateUnsolvedSquares(board); //generate set of unsolved squares
        generateDegreesOfFreedom(board); //initial possiblities for every cell
        for (; board.unsolvedSquares.size > 0;) {
            const randomIndex = Math.floor(Math.random() * board.unsolvedSquares.size);
            const randomCoords = Array.from(board.unsolvedSquares)[randomIndex];
            const x = Math.floor(randomCoords / gridSize);
            const y = randomCoords % gridSize;
            const randomValueIndex = Math.floor(Math.random() * board.grid[x][y].possibilities.size);
            const randomValue = Array.from(board.grid[x][y].possibilities)[randomValueIndex];
            updateCell(board, [x, y], randomValue);
            board.grid[x][y].given = true;
            var useInference = true;
            var maxSolverIterations = 1;
            if (difficulty < 30) {
                useInference = false;
                maxSolverIterations = 5;
            }
            const solvable = board.unsolvedSquares.size < (board.gridSize * board.gridSize - 20) ? yield solve(board, windowSize, canvas, maxSolverIterations, false, useInference, 3, 1) : yield solve(board, windowSize, canvas, maxSolverIterations, false, useInference, 5, 0);
            if (solvable == -1) {
                return yield generateBoard(gridSize, difficulty, windowSize, canvas);
            }
            if (solvable == 1) {
                return board;
            }
            yield drawBoard(board, canvas, windowSize, false, false, true);
        }
        console.log("failed!");
        return board;
    });
}
