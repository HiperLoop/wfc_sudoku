import { easy, medium, als } from "./tests.js";
import { coordsFromClick, drawBoard } from "./canvas.js";
import { board, board_selectCell, cellBoardFromValues, empty_grid} from "./board.js";
import { solve } from "./solver.js";

//initializes all event listeners for user input
export function eventListeners_init(cnv:HTMLCanvasElement, board:board, windowSize:number[]) {
    //canvas
    cnv.addEventListener("mousedown", (event) => {
        board_selectCell(board, coordsFromClick(event, board.gridSize, cnv, [window.innerWidth, window.innerHeight]), cnv, windowSize, event.ctrlKey);
        console.log(coordsFromClick(event, board.gridSize, cnv, [window.innerWidth, window.innerHeight]));
        console.log(board.selectedCells);
        drawBoard(board, cnv, windowSize);
    });
    //solve
    const maxSolverIterations = 10;
    const useInference = true;
    const solve_button = document.getElementById("solve_button");
    solve_button ? solve_button.addEventListener("click", (event) => {solve(board, [window.innerWidth, window.innerHeight], cnv, maxSolverIterations, useInference); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], true)}) : console.error("Solve event listener failed!");
    //clear
    const clear_button = document.getElementById("clear_button");
    clear_button ? clear_button.addEventListener("click", (event) => {board.grid = cellBoardFromValues(empty_grid); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false)}) : console.error("Clear event listener failed!");
    //load
    const load_button = document.getElementById("load_button");
    const load_options = <HTMLInputElement>document.getElementById("load_options");
    const load_sudokus:number[][][] = [easy, medium, als];
    load_button && load_options ? load_button.addEventListener("click", (event) => {board.grid = cellBoardFromValues(load_sudokus[Number(load_options.value)]); board.unsolvedSquares = new Set<number>; drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false)}) : console.error("Load event listener failed!");
    //keyboard
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        const num:number = Number(event.key);
        if(num > 0 && num <= 9) {
            console.log(num);
            board.selectedCells.forEach((value:number) => {
                //if number was given, it cannot be changed
                board.grid[Math.floor(value/board.gridSize)][value%board.gridSize].given ? null : board.grid[Math.floor(value/board.gridSize)][value%board.gridSize].num = num;
            });
        }
      
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
        drawBoard(board, cnv, windowSize);
      }, true);
}