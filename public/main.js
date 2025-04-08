import { resize_canvas, drawBoard } from "./canvas.js";
import { solve } from "./solver.js";
import { cellBoardFromValues, easy } from "./tests.js";
let cnv;
let gridSize = 9;
let grid = [[]];
let playBoard;
window.onload = function () {
    //board = populateBoard(gridSize);
    //board = test_one;
    grid = cellBoardFromValues(easy);
    //board = cellBoardFromValues(medium);
    //console.log("works");
    playBoard = { grid: grid, gridSize: gridSize, unsolvedSquares: new Set };
    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => { solve(playBoard, [window.innerWidth, window.innerHeight], cnv); drawBoard(playBoard, cnv, [window.innerWidth, window.innerHeight], true); });
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
};
window.onresize = function () {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, playBoard);
};
