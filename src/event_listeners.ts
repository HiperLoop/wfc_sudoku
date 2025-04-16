import { easy, medium, als } from "./tests.js";
import { coordsFromClick, drawBoard } from "./canvas.js";
import { board, cellBoardFromValues, empty_grid } from "./board.js";
import { solve } from "./solver.js";

export function eventListeners_init(cnv:HTMLCanvasElement, board:board) {
    //canvas
    cnv.addEventListener("mouseup", (event) => {console.log(coordsFromClick(event, board.gridSize, cnv, [window.innerWidth, window.innerHeight]))});
    //solve
    const solve_button = document.getElementById("solve_button");  
    solve_button ? solve_button.addEventListener("click", (event) => {solve(board, [window.innerWidth, window.innerHeight], cnv); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], true)}) : console.error("Solve event listener failed!");
    //clear
    const clear_button = document.getElementById("clear_button");
    clear_button ? clear_button.addEventListener("click", (event) => {board.grid = cellBoardFromValues(empty_grid); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false)}) : console.error("Clear event listener failed!");
    //load
    const load_button = document.getElementById("load_button");
    const load_options = <HTMLInputElement>document.getElementById("load_options");
    const load_sudokus:number[][][] = [easy, medium, als];
    load_button && load_options ? load_button.addEventListener("click", (event) => {board.grid = cellBoardFromValues(load_sudokus[Number(load_options.value)]); drawBoard(board, cnv, [window.innerWidth, window.innerHeight], false)}) : console.error("Load event listener failed!");
}