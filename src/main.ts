import { resize_canvas, drawBoard } from "./canvas.js";
import { board, cell } from "./board.js";
import { generateDegreesOfFreedom, solve } from "./solver.js";
import { cellBoardFromValues , easy , medium, sofia, shion, test_one } from "./tests.js";

let cnv:HTMLCanvasElement;
let gridSize = 9;
let grid:cell[][] = [[]];
let playBoard:board;

window.onload = function() {
    //board = populateBoard(gridSize);
    grid = cellBoardFromValues(test_one);
    //grid = cellBoardFromValues(easy);
    //grid= cellBoardFromValues(medium);
    //grid= cellBoardFromValues(sofia[0]);
    //grid= cellBoardFromValues(shion);
    //console.log("works");
    playBoard = {grid:grid, gridSize:gridSize, unsolvedSquares:new Set<number>};
    cnv = <HTMLCanvasElement> document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => {solve(playBoard, [window.innerWidth, window.innerHeight], cnv); drawBoard(playBoard, cnv, [window.innerWidth, window.innerHeight], true)});
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
}