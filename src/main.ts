import { resize_canvas, drawBoard } from "./canvas.js";
import { populateBoard , cell } from "./board.js";
import { generateDegreesOfFreedom, solve } from "./solver.js";
import { test_one , cellBoardFromValues , easy , medium } from "./tests.js";

let cnv:HTMLCanvasElement;
let gridSize = 9;
let board:cell[][] = [[]];

window.onload = function() {
    //board = populateBoard(gridSize);
    //board = test_one;
    board = cellBoardFromValues(easy);
    //board = cellBoardFromValues(medium);
    //console.log("works");
    cnv = <HTMLCanvasElement> document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => {solve(board, gridSize, [window.innerWidth, window.innerHeight], cnv); drawBoard(board, gridSize, cnv, [window.innerWidth, window.innerHeight], true)});
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
}